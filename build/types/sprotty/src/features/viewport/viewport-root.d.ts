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
import { Bounds, Point } from "../../utils/geometry";
import { SModelRoot, SModelIndex, SModelElement } from '../../base/model/smodel';
import { Viewport } from "./model";
/**
 * Model root element that defines a viewport, so it transforms the coordinate system with
 * a `scroll` translation and a `zoom` scaling.
 */
export declare class ViewportRootElement extends SModelRoot implements Viewport {
    static readonly DEFAULT_FEATURES: symbol[];
    scroll: Point;
    zoom: number;
    constructor(index?: SModelIndex<SModelElement>);
    localToParent(point: Point | Bounds): Bounds;
    parentToLocal(point: Point | Bounds): Bounds;
}
//# sourceMappingURL=viewport-root.d.ts.map