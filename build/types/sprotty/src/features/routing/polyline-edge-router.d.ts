/********************************************************************************
 * Copyright (c) 2019 TypeFox and others.
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
import { SRoutingHandle } from "./model";
import { ResolvedHandleMove } from "../move/move";
import { AnchorComputerRegistry } from "./anchor";
import { LinearEdgeRouter, LinearRouteOptions } from "./linear-edge-router";
import { SRoutableElement } from "./model";
import { RoutedPoint } from "./routing";
export interface PolylineRouteOptions extends LinearRouteOptions {
    /** The angle in radians below which a routing handle is removed. */
    removeAngleThreshold: number;
}
export declare class PolylineEdgeRouter extends LinearEdgeRouter {
    anchorRegistry: AnchorComputerRegistry;
    static readonly KIND = "polyline";
    get kind(): string;
    protected getOptions(edge: SRoutableElement): PolylineRouteOptions;
    route(edge: SRoutableElement): RoutedPoint[];
    /**
     * Remove routed points that are in edit mode and for which the angle between the preceding and
     * following points falls below a threshold.
     */
    protected filterEditModeHandles(route: RoutedPoint[], edge: SRoutableElement, options: PolylineRouteOptions): RoutedPoint[];
    createRoutingHandles(edge: SRoutableElement): void;
    getInnerHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
}
//# sourceMappingURL=polyline-edge-router.d.ts.map