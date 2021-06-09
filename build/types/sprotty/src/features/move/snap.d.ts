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
import { SModelElement } from "../../base/model/smodel";
import { Point } from "../../utils/geometry";
/**
 * A snapper helps to align nodes and routing handles.
 */
export interface ISnapper {
    /**
     * @retruns the closest snapped position that for the `element` located at `position`
     */
    snap(position: Point, element: SModelElement): Point;
}
/**
 * A simple snapper that snaps the center of nodes and routing points to a grid.
 */
export declare class CenterGridSnapper implements ISnapper {
    get gridX(): number;
    get gridY(): number;
    snap(position: Point, element: SModelElement): Point;
}
//# sourceMappingURL=snap.d.ts.map