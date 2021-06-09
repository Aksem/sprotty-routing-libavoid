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
import { SChildElement, SModelElement, SModelElementSchema, SParentElement } from "../../base/model/smodel";
import { SModelExtension } from "../../base/model/smodel-extension";
import { DOMHelper } from "../../base/views/dom-helper";
import { ViewerOptions } from "../../base/views/viewer-options";
import { Bounds, Dimension, Point } from "../../utils/geometry";
import { Locateable } from '../move/model';
export declare const boundsFeature: unique symbol;
export declare const layoutContainerFeature: unique symbol;
export declare const layoutableChildFeature: unique symbol;
export declare const alignFeature: unique symbol;
/**
 * Model elements that implement this interface have a position and a size.
 */
export interface BoundsAware extends SModelExtension {
    bounds: Bounds;
}
/**
 * Used to identify model elements that specify a layout to apply to their children.
 */
export interface LayoutContainer extends LayoutableChild {
    layout: string;
}
export declare type ModelLayoutOptions = {
    [key: string]: string | number | boolean;
};
export interface LayoutableChild extends SModelExtension, BoundsAware {
    layoutOptions?: ModelLayoutOptions;
}
/**
 * Used to adjust elements whose bounding box is not at the origin, e.g.
 * labels, or pre-rendered SVG figures.
 */
export interface Alignable extends SModelExtension {
    alignment: Point;
}
export declare function isBoundsAware(element: SModelElement): element is SModelElement & BoundsAware;
export declare function isLayoutContainer(element: SModelElement): element is SParentElement & LayoutContainer;
export declare function isLayoutableChild(element: SModelElement): element is SChildElement & LayoutableChild;
export declare function isSizeable(element: SModelElement): element is SModelElement & BoundsAware;
export declare function isAlignable(element: SModelElement): element is SModelElement & Alignable;
export declare function getAbsoluteBounds(element: SModelElement): Bounds;
/**
 * Returns the "client-absolute" bounds of the specified `element`.
 *
 * The client-absolute bounds are relative to the entire browser page.
 *
 * @param element The element to get the bounds for.
 * @param domHelper The dom helper to obtain the SVG element's id.
 * @param viewerOptions The viewer options to obtain sprotty's container div id.
 */
export declare function getAbsoluteClientBounds(element: SModelElement, domHelper: DOMHelper, viewerOptions: ViewerOptions): Bounds;
export declare function findChildrenAtPosition(parent: SParentElement, point: Point): SModelElement[];
/**
 * Serializable schema for SShapeElement.
 */
export interface SShapeElementSchema extends SModelElementSchema {
    position?: Point;
    size?: Dimension;
    children?: SModelElementSchema[];
    layoutOptions?: ModelLayoutOptions;
}
/**
 * Abstract class for elements with a position and a size.
 */
export declare abstract class SShapeElement extends SChildElement implements BoundsAware, Locateable, LayoutableChild {
    position: Point;
    size: Dimension;
    layoutOptions?: ModelLayoutOptions;
    get bounds(): Bounds;
    set bounds(newBounds: Bounds);
    localToParent(point: Point | Bounds): Bounds;
    parentToLocal(point: Point | Bounds): Bounds;
}
//# sourceMappingURL=model.d.ts.map