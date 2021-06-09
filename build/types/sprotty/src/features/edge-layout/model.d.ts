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
import { SModelExtension } from "../../base/model/smodel-extension";
import { SModelElement, SChildElement } from "../../base/model/smodel";
import { BoundsAware } from "../bounds/model";
export declare const edgeLayoutFeature: unique symbol;
export interface EdgeLayoutable extends SModelExtension {
    edgePlacement: EdgePlacement;
}
export declare function isEdgeLayoutable<T extends SModelElement>(element: T): element is T & SChildElement & BoundsAware & EdgeLayoutable;
export declare type EdgeSide = 'left' | 'right' | 'top' | 'bottom' | 'on';
export declare class EdgePlacement extends Object {
    /**
     * true, if the label should be rotated to touch the edge tangentially
     */
    rotate: boolean;
    /**
     * where is the label relative to the line's direction
     */
    side: EdgeSide;
    /**
     * between 0 (source anchor) and 1 (target anchor)
     */
    position: number;
    /**
     * space between label and edge/connected nodes
     */
    offset: number;
}
export declare const DEFAULT_EDGE_PLACEMENT: EdgePlacement;
//# sourceMappingURL=model.d.ts.map