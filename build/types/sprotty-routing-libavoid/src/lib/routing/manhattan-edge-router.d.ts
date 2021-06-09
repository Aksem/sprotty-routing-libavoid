/********************************************************************************
 * Copyright (c) 2019-2020 TypeFox and others.
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
import { Point } from "sprotty/src/utils/geometry";
import { ResolvedHandleMove } from "sprotty/src/features/move/move";
import { DefaultAnchors, LinearEdgeRouter, LinearRouteOptions, Side } from "./linear-edge-router";
import { SRoutableElement, RoutingHandleKind, SRoutingHandle, SConnectableElement } from "./model";
import { RoutedPoint } from "./routing";
export interface ManhattanRouterOptions extends LinearRouteOptions {
    standardDistance: number;
}
export declare class ManhattanEdgeRouter extends LinearEdgeRouter {
    static readonly KIND = "manhattan";
    get kind(): string;
    protected getOptions(edge: SRoutableElement): ManhattanRouterOptions;
    route(edge: SRoutableElement): RoutedPoint[];
    protected createRoutedCorners(edge: SRoutableElement): RoutedPoint[];
    createRoutingHandles(edge: SRoutableElement): void;
    protected getInnerHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    protected getFraction(kind: RoutingHandleKind): number | undefined;
    protected commitRoute(edge: SRoutableElement, routedPoints: RoutedPoint[]): void;
    protected applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    protected correctX(routingPoints: Point[], index: number, x: number, minimalPointDistance: number): number;
    protected alignX(routingPoints: Point[], index: number, x: number): void;
    protected correctY(routingPoints: Point[], index: number, y: number, minimalPointDistance: number): number;
    protected alignY(routingPoints: Point[], index: number, y: number): void;
    getCenterPoint(element: SConnectableElement): {
        x: number;
        y: number;
    };
    cleanupRoutingPoints(edge: SRoutableElement, routingPoints: Point[], updateHandles: boolean, addRoutingPoints: boolean): void;
    protected removeHandle(edge: SRoutableElement, pointIndex: number): void;
    protected addAdditionalCorner(edge: SRoutableElement, routingPoints: Point[], currentAnchors: DefaultAnchors, otherAnchors: DefaultAnchors, updateHandles: boolean): void;
    /**
     * Add artificial routing points to keep all angles rectilinear.
     *
     * This makes edge morphing look a lot smoother, where RP positions are interpolated
     * linearly probably resulting in non-rectilinear angles. We don't add handles for
     * these additional RPs.
     */
    protected manhattanify(edge: SRoutableElement, routingPoints: Point[]): void;
    protected calculateDefaultCorners(edge: SRoutableElement, sourceAnchors: DefaultAnchors, targetAnchors: DefaultAnchors, options: ManhattanRouterOptions): Point[];
    protected getBestConnectionAnchors(edge: SRoutableElement, sourceAnchors: DefaultAnchors, targetAnchors: DefaultAnchors, options: ManhattanRouterOptions): {
        source: Side;
        target: Side;
    };
}
//# sourceMappingURL=manhattan-edge-router.d.ts.map