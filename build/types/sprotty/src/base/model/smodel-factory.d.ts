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
import { FactoryRegistry } from '../../utils/registry';
import { SChildElement, SModelElement, SModelElementSchema, SModelRoot, SModelRootSchema, SParentElement, FeatureSet } from './smodel';
/**
 * A model factory transforms a serializable model schema into the model representation that is used
 * internally by sprotty.
 */
export interface IModelFactory {
    createElement(schema: SModelElementSchema | SModelElement, parent?: SParentElement): SChildElement;
    createRoot(schema: SModelRootSchema | SModelRoot): SModelRoot;
    createSchema(element: SModelElement): SModelElementSchema;
}
/**
 * The default model factory creates SModelRoot for the root element and SChildElement for all other
 * model elements.
 */
export declare class SModelFactory implements IModelFactory {
    protected readonly registry: SModelRegistry;
    createElement(schema: SModelElementSchema | SModelElement, parent?: SParentElement): SChildElement;
    createRoot(schema: SModelRootSchema | SModelRoot): SModelRoot;
    createSchema(element: SModelElement): SModelElementSchema;
    protected initializeElement(element: SModelElement, schema: SModelElementSchema | SModelElement): SModelElement;
    protected isReserved(element: SModelElement, propertyName: string): boolean;
    protected initializeParent(parent: SParentElement, schema: SModelElementSchema | SParentElement): SParentElement;
    protected initializeChild(child: SChildElement, schema: SModelElementSchema, parent?: SParentElement): SChildElement;
    protected initializeRoot(root: SModelRoot, schema: SModelRootSchema | SModelRoot): SModelRoot;
}
export declare const EMPTY_ROOT: Readonly<SModelRootSchema>;
/**
 * Used to bind a model element type to a class constructor in the SModelRegistry.
 */
export interface SModelElementRegistration {
    type: string;
    constr: SModelElementConstructor;
    features?: CustomFeatures;
}
export interface SModelElementConstructor {
    DEFAULT_FEATURES?: ReadonlyArray<symbol>;
    new (): SModelElement;
}
export interface CustomFeatures {
    enable?: symbol[];
    disable?: symbol[];
}
/**
 * Model element classes registered here are considered automatically when constructring a model from its schema.
 */
export declare class SModelRegistry extends FactoryRegistry<SModelElement, void> {
    constructor(registrations: SModelElementRegistration[]);
    protected getDefaultFeatures(constr: SModelElementConstructor): ReadonlyArray<symbol> | undefined;
}
export declare function createFeatureSet(defaults: ReadonlyArray<symbol>, custom?: CustomFeatures): FeatureSet;
//# sourceMappingURL=smodel-factory.d.ts.map