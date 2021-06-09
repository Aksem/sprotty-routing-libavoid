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
import { IAnchorComputer } from "sprotty/src/features/routing/anchor";
import { SConnectableElement } from "./model";
import { Point } from "sprotty/src/utils/geometry";
export declare class EllipseAnchor implements IAnchorComputer {
    get kind(): string;
    getAnchor(connectable: SConnectableElement, refPoint: Point, offset?: number): Point;
}
export declare class RectangleAnchor implements IAnchorComputer {
    get kind(): string;
    getAnchor(connectable: SConnectableElement, refPoint: Point, offset?: number): Point;
    protected getXIntersection(yIntersection: number, centerPoint: Point, point: Point): number;
    protected getYIntersection(xIntersection: number, centerPoint: Point, point: Point): number;
}
export declare class DiamondAnchor implements IAnchorComputer {
    get kind(): string;
    getAnchor(connectable: SConnectableElement, refPoint: Point, offset: number): Point;
}
//# sourceMappingURL=polyline-anchors.d.ts.map