/********************************************************************************
 * Copyright (c) 2017-2018 TypeFox and others.
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
import { SModelElement, SModelRoot } from "../../base/model/smodel";
import { MouseListener } from "../../base/views/mouse-tool";
import { Action } from "../../base/actions/action";
import { SModelExtension } from "../../base/model/smodel-extension";
export interface Zoomable extends SModelExtension {
    zoom: number;
}
export declare function isZoomable(element: SModelElement | Zoomable): element is Zoomable;
export declare function getZoom(label: SModelElement): number;
export declare class ZoomMouseListener extends MouseListener {
    wheel(target: SModelElement, event: WheelEvent): Action[];
    protected getViewportOffset(root: SModelRoot, event: WheelEvent): Point;
    protected getZoomFactor(event: WheelEvent): number;
}
//# sourceMappingURL=zoom.d.ts.map