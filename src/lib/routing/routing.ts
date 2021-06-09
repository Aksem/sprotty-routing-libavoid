/********************************************************************************
 * Copyright (c) 2018-2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { AvoidLib } from 'libavoid-js';
import { Point } from "sprotty/src/utils/geometry";
import { SRoutableElement, SConnectableElement } from "./model";
import { InstanceRegistry } from "sprotty/src//utils/registry";
import { PolylineEdgeRouter } from "./polyline-edge-router";
import { injectable, multiInject } from "inversify";
import { ResolvedHandleMove } from "sprotty/src/features/move/move";
import { SRoutingHandle } from "../routing/model";
import { TYPES } from "sprotty/src/base/types";
import { SParentElement } from "sprotty/src/base/model/smodel";

/**
 * A point describing the shape of an edge.
 *
 * The <code>RoutedPoints</code> of an edge are derived from the <code>routingPoints</code>
 * which plain <code>Points</code> stored in the SModel by the <code>IEdgeRouter</code>.
 * As opposed to the originals, the also contain the source and target anchor points.
 * The router may also add or remove points in order to satisfy the constraints
 * the constraints of the routing algorithm or in order to to filter out points which are
 * obsolete, e.g. to close to each other.
 */
export interface RoutedPoint extends Point {
    kind: 'source' | 'target' | 'linear'
    pointIndex?: number
}

/**
 * Stores the state of an edge at a specific time.
 */
export interface EdgeSnapshot {
    routingHandles: SRoutingHandle[]
    routingPoints: Point[]
    routedPoints: RoutedPoint[]
    router: IEdgeRouter
    source?: SConnectableElement
    target?: SConnectableElement
}

export interface EdgeMemento {
    edge: SRoutableElement
    before: EdgeSnapshot
    after: EdgeSnapshot
}

export type AvoidRouteEdge = { child: SRoutableElement, connRef: ConnRef }
export type AvoidRoutes = {[key:string]: AvoidRouteEdge};

/**
 * Encapsulates the logic of how the actual shape of an edge is derived from its routing points,
 * and how the user can modify it.
 */
export interface IEdgeRouter {

    readonly kind: string;
    avoidRouter: Router;
    avoidRoutes: AvoidRoutes;

    /**
     * Calculates the route of the given edge.
     */
    route(edge: SRoutableElement): RoutedPoint[]

    /**
     * Calculates a point on the edge
     *
     * @param t a value between 0 (sourceAnchor) and 1 (targetAnchor)
     * @returns the point or undefined if t is out of bounds or it cannot be computed
     */
    pointAt(edge: SRoutableElement, t: number): Point | undefined

    /**
     * Calculates the derivative at a point on the edge.
     *
     * @param t a value between 0 (sourceAnchor) and 1 (targetAnchor)
     * @returns the point or undefined if t is out of bounds or it cannot be computed
     */
    derivativeAt(edge: SRoutableElement, t: number): Point | undefined

    /**
     * Retuns the position of the given handle based on the routing points of the edge.
     */
    getHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined

    /**
     * Creates the routing handles for the given target.
     */
    createRoutingHandles(edge: SRoutableElement): void

    /**
     * Updates the routing points and handles of the given edge with regard to the given moves.
     */
    applyHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void

    /**
     * Updates the routing points and handles of the given edge with regard to the given moves.
     */
    applyReconnect(edge: SRoutableElement, newSourceId?: string, newTargetId?: string): void

    /**
     * Remove/add points in order to keep routing constraints consistent, or reset RPs on reconnect.
     */
    cleanupRoutingPoints(edge: SRoutableElement, routingPoints: Point[], updateHandles: boolean, addRoutingPoints: boolean): void;

    /**
     * Creates a snapshot of the given edge, storing all the data needed to restore it to
     * its current state.
     */
    takeSnapshot(edge: SRoutableElement): EdgeSnapshot;

    /**
     * Applies a snapshot to the current edge.
     */
    applySnapshot(edge: SRoutableElement, edgeSnapshot: EdgeSnapshot): void;
}


@injectable()
export class EdgeRouterRegistry extends InstanceRegistry<IEdgeRouter> {
    avoidRouter: Router;
    avoidRoutes: AvoidRoutes;
    renderedTimes = 0

    constructor(@multiInject(TYPES.IEdgeRouter) edgeRouters: IEdgeRouter[]) {
        super();
        const Avoid = AvoidLib.getInstance();
        this.avoidRouter = new Avoid.Router(Avoid.OrthogonalRouting | Avoid.PolyLineRouting);
        this.avoidRoutes = {};
        edgeRouters.forEach(router => {
            this.register(router.kind, router);
            router.avoidRouter = this.avoidRouter;
            router.avoidRoutes = this.avoidRoutes;
        });
    }

    protected get defaultKind() {
        return PolylineEdgeRouter.KIND;
    }

    get(kind: string | undefined): IEdgeRouter {
        return super.get(kind || this.defaultKind);
    }

    getAllChildren(parent: Readonly<SParentElement>): { routables: Array<SRoutableElement>, connectables: Array<SConnectableElement>  } {
        const routables = [];
        const connectables = [];

        for (const child of parent.children) {
            if (child instanceof SRoutableElement) {
                routables.push(child);
            } else if (child instanceof SConnectableElement) {
                connectables.push(child);
            }
            
            if (child instanceof SParentElement) {
                const children = this.getAllChildren(child);
                routables.push(...children.routables);
                connectables.push(...children.connectables);
            }
        }

        return { routables, connectables };
    }

    getCenterPoint(element: SConnectableElement): { x: number, y: number } {
        let x = element.bounds.width / 2, y = element.bounds.height / 2;
        let currentElement = element;
        while (currentElement) {
            if (currentElement.position) {
                x += currentElement.position.x;
                y += currentElement.position.y;
            }

            if (!(currentElement.parent && currentElement.parent.id === 'graph')) {
                currentElement = (currentElement.parent as SConnectableElement);
            } else {
                break;
            }
        }
        return { x, y };
    }

    avoidRoutesToEdgeRoutes(avoidRoutes:AvoidRouteEdge[]):EdgeRoutes {
        const routes = new EdgeRoutes();
        for (const connection of avoidRoutes) {
            const sprottyRoute = [];
            const route = connection.connRef.displayRoute();
            for (let i = 0; i < route.size(); i++) {
                let kind:('source'|'linear'|'target') = 'linear';
                if (i === 0) {
                    kind = 'source';
                } else if (i === route.size() - 1) {
                    kind = 'target';
                }
                sprottyRoute.push({ x: route.get_ps(i).x, y: route.get_ps(i).y, kind, pointIndex: 1 });
            }
            routes.set(connection.child, sprottyRoute);
        }

        return routes;
    }

    routeAllChildren(parent: Readonly<SParentElement>): EdgeRoutes {
        if (this.renderedTimes < 2) {
            const connections = [];
            const Avoid = AvoidLib.getInstance();
            // const router = new Avoid.Router(Avoid.OrthogonalRouting | Avoid.PolyLineRouting);
            const children = this.getAllChildren(parent);

            for (const child of children.routables) {
                const sourceConnectionEnd = this.getCenterPoint(child.source as SConnectableElement);
                const targetConnectionEnd = this.getCenterPoint(child.target as SConnectableElement);
                const connRef = new Avoid.ConnRef(
                    this.avoidRouter,
                    new Avoid.ConnEnd(new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)),
                    new Avoid.ConnEnd(new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)),
                );

                let routingType = Avoid.PolyLineRouting;
                if (child.routerKind === 'manhattan') {
                    routingType = Avoid.OrthogonalRouting;
                }
                connRef.setRoutingType(routingType);
                connections.push({ child, connRef });
                this.avoidRoutes[child.id] = { connRef, child };
            }

            for (const child of children.connectables) {
                const centerPoint = this.getCenterPoint(child);
                const rectangle = new Avoid.Rectangle(
                    new Avoid.Point(centerPoint.x, centerPoint.y),
                    child.bounds.width,
                    child.bounds.height,
                );
                new Avoid.ShapeRef(this.avoidRouter, rectangle);
            }

            this.avoidRouter.processTransaction();

            // for (const connection of connections) {
            //     router.deleteConnector(connection.connRef);
            // }
            // Avoid.destroy(router);
            this.renderedTimes += 1;
            return this.avoidRoutesToEdgeRoutes(connections);
        } else {
            this.avoidRouter.processTransaction();
            return this.avoidRoutesToEdgeRoutes(Object.values(this.avoidRoutes));
        }
    }

    route(edge: Readonly<SRoutableElement>, args?: object): RoutedPoint[] {
        if (containsEdgeRoutes(args)) {
            const route = args.edgeRoutes.get(edge);
            if (route) {
                return route;
            }
        }
        const router = this.get(edge.routerKind);
        return router.route(edge);
    }

}

export interface EdgeRoutesContainer {
    edgeRoutes: EdgeRoutes;
}

export function containsEdgeRoutes(args?: object): args is object & EdgeRoutesContainer {
    return args !== undefined && 'edgeRoutes' in args;
}

export class EdgeRoutes {

    protected _routes = new Map<string, RoutedPoint[]>();

    set(routable: Readonly<SRoutableElement>, route: RoutedPoint[]): void {
        this._routes.set(routable.id, route);
    }

    setAll(otherRoutes: EdgeRoutes): void {
        otherRoutes.routes.forEach((route, routableId) => this._routes.set(routableId, route));
    }

    get(routable: Readonly<SRoutableElement>): RoutedPoint[] | undefined {
        return this._routes.get(routable.id);
    }

    get routes() {
        return this._routes;
    }

}
