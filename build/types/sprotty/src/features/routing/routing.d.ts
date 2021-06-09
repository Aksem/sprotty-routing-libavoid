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
import { Point } from "../../utils/geometry";
import { SRoutableElement, SConnectableElement } from "./model";
import { InstanceRegistry } from "../../utils/registry";
import { ResolvedHandleMove } from "../move/move";
import { SRoutingHandle } from "../routing/model";
import { SParentElement } from "../../base/model/smodel";
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
    kind: 'source' | 'target' | 'linear';
    pointIndex?: number;
}
/**
 * Stores the state of an edge at a specific time.
 */
export interface EdgeSnapshot {
    routingHandles: SRoutingHandle[];
    routingPoints: Point[];
    routedPoints: RoutedPoint[];
    router: IEdgeRouter;
    source?: SConnectableElement;
    target?: SConnectableElement;
}
export interface EdgeMemento {
    edge: SRoutableElement;
    before: EdgeSnapshot;
    after: EdgeSnapshot;
}
/**
 * Encapsulates the logic of how the actual shape of an edge is derived from its routing points,
 * and how the user can modify it.
 */
export interface IEdgeRouter {
    readonly kind: string;
    /**
     * Calculates the route of the given edge.
     */
    route(edge: SRoutableElement): RoutedPoint[];
    /**
     * Calculates a point on the edge
     *
     * @param t a value between 0 (sourceAnchor) and 1 (targetAnchor)
     * @returns the point or undefined if t is out of bounds or it cannot be computed
     */
    pointAt(edge: SRoutableElement, t: number): Point | undefined;
    /**
     * Calculates the derivative at a point on the edge.
     *
     * @param t a value between 0 (sourceAnchor) and 1 (targetAnchor)
     * @returns the point or undefined if t is out of bounds or it cannot be computed
     */
    derivativeAt(edge: SRoutableElement, t: number): Point | undefined;
    /**
     * Retuns the position of the given handle based on the routing points of the edge.
     */
    getHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    /**
     * Creates the routing handles for the given target.
     */
    createRoutingHandles(edge: SRoutableElement): void;
    /**
     * Updates the routing points and handles of the given edge with regard to the given moves.
     */
    applyHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    /**
     * Updates the routing points and handles of the given edge with regard to the given moves.
     */
    applyReconnect(edge: SRoutableElement, newSourceId?: string, newTargetId?: string): void;
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
export declare class EdgeRouterRegistry extends InstanceRegistry<IEdgeRouter> {
    constructor(edgeRouters: IEdgeRouter[]);
    protected get defaultKind(): string;
    get(kind: string | undefined): IEdgeRouter;
    routeAllChildren(parent: Readonly<SParentElement>): EdgeRoutes;
    route(edge: Readonly<SRoutableElement>, args?: object): RoutedPoint[];
}
export interface EdgeRoutesContainer {
    edgeRoutes: EdgeRoutes;
}
export declare function containsEdgeRoutes(args?: object): args is object & EdgeRoutesContainer;
export declare class EdgeRoutes {
    protected _routes: Map<string, RoutedPoint[]>;
    set(routable: Readonly<SRoutableElement>, route: RoutedPoint[]): void;
    setAll(otherRoutes: EdgeRoutes): void;
    get(routable: Readonly<SRoutableElement>): RoutedPoint[] | undefined;
    get routes(): Map<string, RoutedPoint[]>;
}
//# sourceMappingURL=routing.d.ts.map