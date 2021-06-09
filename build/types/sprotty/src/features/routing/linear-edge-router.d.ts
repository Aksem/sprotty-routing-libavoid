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
import { SParentElement } from "../../base/model/smodel";
import { Bounds, Point } from "../../utils/geometry";
import { ResolvedHandleMove } from "../move/move";
import { RoutingHandleKind, SRoutingHandle } from "../routing/model";
import { AnchorComputerRegistry, IAnchorComputer } from "./anchor";
import { SConnectableElement, SRoutableElement } from "./model";
import { EdgeSnapshot, IEdgeRouter, RoutedPoint } from "./routing";
export interface LinearRouteOptions {
    minimalPointDistance: number;
    standardDistance: number;
    selfEdgeOffset: number;
}
export declare enum Side {
    RIGHT = 0,
    LEFT = 1,
    TOP = 2,
    BOTTOM = 3
}
export declare class DefaultAnchors {
    readonly element: SConnectableElement;
    readonly kind: 'source' | 'target';
    readonly bounds: Bounds;
    readonly left: RoutedPoint;
    readonly right: RoutedPoint;
    readonly top: RoutedPoint;
    readonly bottom: RoutedPoint;
    constructor(element: SConnectableElement, edgeParent: SParentElement, kind: 'source' | 'target');
    get(side: Side): RoutedPoint;
    getNearestSide(point: Point): Side;
}
export declare abstract class LinearEdgeRouter implements IEdgeRouter {
    anchorRegistry: AnchorComputerRegistry;
    abstract get kind(): string;
    abstract route(edge: SRoutableElement): RoutedPoint[];
    abstract createRoutingHandles(edge: SRoutableElement): void;
    protected abstract getOptions(edge: SRoutableElement): LinearRouteOptions;
    pointAt(edge: SRoutableElement, t: number): Point | undefined;
    derivativeAt(edge: SRoutableElement, t: number): Point | undefined;
    protected calculateSegment(edge: SRoutableElement, t: number): {
        segmentStart: Point;
        segmentEnd: Point;
        lambda: number;
    } | undefined;
    protected addHandle(edge: SRoutableElement, kind: RoutingHandleKind, type: string, routingPointIndex: number): SRoutingHandle;
    getHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    protected abstract getInnerHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    protected findRouteSegment(edge: SRoutableElement, route: RoutedPoint[], handleIndex: number): {
        start?: Point;
        end?: Point;
    };
    getTranslatedAnchor(connectable: SConnectableElement, refPoint: Point, refContainer: SParentElement, edge: SRoutableElement, anchorCorrection?: number): Point;
    protected getAnchorComputer(connectable: SConnectableElement): IAnchorComputer;
    applyHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    protected abstract applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    cleanupRoutingPoints(edge: SRoutableElement, routingPoints: Point[], updateHandles: boolean, addRoutingPoints: boolean): void;
    protected resetRoutingPointsOnReconnect(edge: SRoutableElement, routingPoints: Point[], updateHandles: boolean, sourceAnchors: DefaultAnchors, targetAnchors: DefaultAnchors): boolean;
    applyReconnect(edge: SRoutableElement, newSourceId?: string, newTargetId?: string): void;
    takeSnapshot(edge: SRoutableElement): EdgeSnapshot;
    applySnapshot(edge: SRoutableElement, snapshot: EdgeSnapshot): void;
    protected calculateDefaultCorners(edge: SRoutableElement, sourceAnchors: DefaultAnchors, targetAnchors: DefaultAnchors, options: LinearRouteOptions): Point[];
    protected getSelfEdgeIndex(edge: SRoutableElement): number;
}
//# sourceMappingURL=linear-edge-router.d.ts.map