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
import { VNode } from "snabbdom/vnode";
import { InstanceRegistry } from "../../utils/registry";
import { SModelElement, SModelRoot, SParentElement } from "../model/smodel";
import { CustomFeatures } from "../model/smodel-factory";
/**
 * Base interface for the components that turn GModelElements into virtual DOM elements.
 */
export interface IView {
    render(model: Readonly<SModelElement>, context: RenderingContext, args?: object): VNode | undefined;
}
export declare type RenderingTargetKind = 'main' | 'popup' | 'hidden';
/**
 * Bundles additional data that is passed to views for VNode creation.
 */
export interface RenderingContext {
    readonly viewRegistry: ViewRegistry;
    readonly targetKind: RenderingTargetKind;
    decorate(vnode: VNode, element: Readonly<SModelElement>): VNode;
    renderElement(element: Readonly<SModelElement>, args?: object): VNode | undefined;
    renderChildren(element: Readonly<SParentElement>, args?: object): VNode[];
}
/**
 * Used to bind a model element type to a view factory in the ViewRegistry.
 */
export interface ViewRegistration {
    type: string;
    factory: () => IView;
}
export declare type ViewRegistrationFactory = () => ViewRegistration;
/**
 * Allows to look up the IView for a given SModelElement based on its type.
 */
export declare class ViewRegistry extends InstanceRegistry<IView> {
    constructor(registrations: ViewRegistration[]);
    protected registerDefaults(): void;
    missing(key: string): IView;
}
/**
 * Combines `registerModelElement` and `configureView`.
 */
export declare function configureModelElement(context: {
    bind: interfaces.Bind;
    isBound: interfaces.IsBound;
}, type: string, modelConstr: new () => SModelElement, viewConstr: interfaces.ServiceIdentifier<IView>, features?: CustomFeatures): void;
/**
 * Utility function to register a view for a model element type.
 */
export declare function configureView(context: {
    bind: interfaces.Bind;
    isBound: interfaces.IsBound;
}, type: string, constr: interfaces.ServiceIdentifier<IView>): void;
/**
 * This view is used when the model is the EMPTY_ROOT.
 */
export declare class EmptyView implements IView {
    render(model: SModelRoot, context: RenderingContext): VNode;
}
/**
 * This view is used when no view has been registered for a model element type.
 */
export declare class MissingView implements IView {
    render(model: Readonly<SModelElement>, context: RenderingContext): VNode;
}
//# sourceMappingURL=view.d.ts.map