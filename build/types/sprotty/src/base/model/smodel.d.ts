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
import { FluentIterable } from "../../utils/iterable";
/**
 * The schema of an SModelElement describes its serializable form. The actual model is created from
 * its schema with an IModelFactory.
 * Each model element must have a unique ID and a type that is used to look up its view.
 */
export interface SModelElementSchema {
    type: string;
    id: string;
    children?: SModelElementSchema[];
    cssClasses?: string[];
}
/**
 * Serializable schema for the root element of the model tree.
 */
export interface SModelRootSchema extends SModelElementSchema {
    canvasBounds?: Bounds;
    revision?: number;
}
/**
 * Base class for all elements of the diagram model.
 * Each model element must have a unique ID and a type that is used to look up its view.
 */
export declare class SModelElement {
    type: string;
    id: string;
    features?: FeatureSet;
    cssClasses?: string[];
    get root(): SModelRoot;
    get index(): SModelIndex<SModelElement>;
    /**
     * A feature is a symbol identifying some functionality that can be enabled or disabled for
     * a model element. The set of supported features is determined by the `features` property.
     */
    hasFeature(feature: symbol): boolean;
}
export interface FeatureSet {
    has(feature: symbol): boolean;
}
export declare function isParent(element: SModelElementSchema | SModelElement): element is SModelElementSchema & {
    children: SModelElementSchema[];
};
/**
 * A parent element may contain child elements, thus the diagram model forms a tree.
 */
export declare class SParentElement extends SModelElement {
    readonly children: ReadonlyArray<SChildElement>;
    add(child: SChildElement, index?: number): void;
    remove(child: SChildElement): void;
    removeAll(filter?: (e: SChildElement) => boolean): void;
    move(child: SChildElement, newIndex: number): void;
    /**
     * Transform the given bounds from the local coordinate system of this element to the coordinate
     * system of its parent. This function should consider any transformation that is applied to the
     * view of this element and its contents.
     * The base implementation assumes that this element does not define a local coordinate system,
     * so it leaves the bounds unchanged.
     */
    localToParent(point: Point | Bounds): Bounds;
    /**
     * Transform the given bounds from the coordinate system of this element's parent to its local
     * coordinate system. This function should consider any transformation that is applied to the
     * view of this element and its contents.
     * The base implementation assumes that this element does not define a local coordinate system,
     * so it leaves the bounds unchanged.
     */
    parentToLocal(point: Point | Bounds): Bounds;
}
/**
 * A child element is contained in a parent element. All elements except the model root are child
 * elements. In order to keep the model class hierarchy simple, every child element is also a
 * parent element, although for many elements the array of children is empty (i.e. they are
 * leafs in the model element tree).
 */
export declare class SChildElement extends SParentElement {
    readonly parent: SParentElement;
}
/**
 * Base class for the root element of the diagram model tree.
 */
export declare class SModelRoot extends SParentElement {
    readonly index: SModelIndex<SModelElement>;
    revision?: number;
    canvasBounds: Bounds;
    constructor(index?: SModelIndex<SModelElement>);
}
export declare function createRandomId(length?: number): string;
/**
 * Used to speed up model element lookup by id.
 */
export declare class SModelIndex<E extends SModelElementSchema> {
    private readonly id2element;
    private id2parent?;
    add(element: E): void;
    remove(element: E): void;
    contains(element: E): boolean;
    getById(id: string): E | undefined;
    /**
     * This utility method is for SModelElementSchema. For SChildElements, simply
     * use the `parent` property.
     */
    getParent(id: string): E | undefined;
    /**
     * This utility method is for SModelElementSchema. For SModelElements, simply
     * use the `root` property.
     */
    getRoot(element: E): E extends SModelElement ? SModelRoot : SModelRootSchema;
    getAttachedElements(element: E): FluentIterable<E>;
    all(): FluentIterable<E>;
}
//# sourceMappingURL=smodel.d.ts.map