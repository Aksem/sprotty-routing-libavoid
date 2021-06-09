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
import { interfaces } from "inversify";
import { Point, Bounds } from "../../utils/geometry";
import { SModelElement, SModelElementSchema } from "./smodel";
import { CustomFeatures } from "./smodel-factory";
/**
 * Register a model element constructor for an element type.
 */
export declare function registerModelElement(context: {
    bind: interfaces.Bind;
    isBound: interfaces.IsBound;
}, type: string, constr: new () => SModelElement, features?: CustomFeatures): void;
/**
 * Model element types can include a colon to separate the basic type and a sub-type. This function
 * extracts the basic type of a model element.
 */
export declare function getBasicType(schema: SModelElementSchema | SModelElement): string;
/**
 * Model element types can include a colon to separate the basic type and a sub-type. This function
 * extracts the sub-type of a model element.
 */
export declare function getSubType(schema: SModelElementSchema | SModelElement): string;
/**
 * Find the element with the given identifier. If you need to find multiple elements, using an
 * SModelIndex might be more effective.
 */
export declare function findElement(parent: SModelElementSchema, elementId: string): SModelElementSchema | undefined;
/**
 * Find a parent element that satisfies the given predicate.
 */
export declare function findParent(element: SModelElement, predicate: (e: SModelElement) => boolean): SModelElement | undefined;
/**
 * Find a parent element that implements the feature identified with the given predicate.
 */
export declare function findParentByFeature<T>(element: SModelElement, predicate: (t: SModelElement) => t is SModelElement & T): SModelElement & T | undefined;
/**
 * Translate a point from the coordinate system of the source element to the coordinate system
 * of the target element.
 */
export declare function translatePoint(point: Point, source: SModelElement, target: SModelElement): Point;
/**
 * Translate some bounds from the coordinate system of the source element to the coordinate system
 * of the target element.
 */
export declare function translateBounds(bounds: Bounds, source: SModelElement, target: SModelElement): Bounds;
//# sourceMappingURL=smodel-utils.d.ts.map