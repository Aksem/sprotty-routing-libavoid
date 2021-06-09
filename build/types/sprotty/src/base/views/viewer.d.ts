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
import { VNode } from "snabbdom/vnode";
import { Module } from "snabbdom/modules/module";
import { ILogger } from "../../utils/logging";
import { SModelElement, SModelRoot, SParentElement } from "../model/smodel";
import { IActionDispatcher } from "../actions/action-dispatcher";
import { Action } from '../actions/action';
import { IVNodePostprocessor } from "./vnode-postprocessor";
import { RenderingContext, ViewRegistry, RenderingTargetKind } from "./view";
import { ViewerOptions } from "./viewer-options";
export interface IViewer {
    update(model: SModelRoot, cause?: Action): void;
}
export interface IViewerProvider {
    readonly modelViewer: IViewer;
    readonly hiddenModelViewer: IViewer;
    readonly popupModelViewer: IViewer;
}
export declare class ModelRenderer implements RenderingContext {
    readonly viewRegistry: ViewRegistry;
    readonly targetKind: RenderingTargetKind;
    private postprocessors;
    constructor(viewRegistry: ViewRegistry, targetKind: RenderingTargetKind, postprocessors: IVNodePostprocessor[]);
    decorate(vnode: VNode, element: Readonly<SModelElement>): VNode;
    renderElement(element: Readonly<SModelElement>, args?: object): VNode | undefined;
    renderChildren(element: Readonly<SParentElement>, args?: object): VNode[];
    postUpdate(cause?: Action): void;
}
export declare type ModelRendererFactory = (targetKind: RenderingTargetKind, postprocessors: IVNodePostprocessor[]) => ModelRenderer;
export declare type Patcher = (oldRoot: VNode | Element, newRoot: VNode) => VNode;
export declare class PatcherProvider {
    readonly patcher: Patcher;
    constructor();
    protected createModules(): Module[];
}
/**
 * The component that turns the model into an SVG DOM.
 * Uses a VDOM based on snabbdom.js for performance.
 */
export declare class ModelViewer implements IViewer {
    protected options: ViewerOptions;
    protected logger: ILogger;
    protected actiondispatcher: IActionDispatcher;
    constructor(modelRendererFactory: ModelRendererFactory, patcherProvider: PatcherProvider, postprocessors: IVNodePostprocessor[]);
    protected readonly renderer: ModelRenderer;
    protected readonly patcher: Patcher;
    protected lastVDOM: VNode;
    update(model: Readonly<SModelRoot>, cause?: Action): void;
    protected hasFocus(): boolean;
    protected restoreFocus(focus: boolean): void;
    protected onWindowResize: (vdom: VNode) => void;
    protected getBoundsInPage(element: Element): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
/**
 * Viewer for the _hidden_ model. This serves as an intermediate step to compute bounds
 * of elements. The model is rendered in a section that is not visible to the user,
 * and then the bounds are extracted from the DOM.
 */
export declare class HiddenModelViewer implements IViewer {
    protected options: ViewerOptions;
    protected logger: ILogger;
    constructor(modelRendererFactory: ModelRendererFactory, patcherProvider: PatcherProvider, hiddenPostprocessors: IVNodePostprocessor[]);
    protected readonly hiddenRenderer: ModelRenderer;
    protected readonly patcher: Patcher;
    protected lastHiddenVDOM: VNode;
    update(hiddenModel: Readonly<SModelRoot>, cause?: Action): void;
}
export declare class PopupModelViewer implements IViewer {
    protected readonly modelRendererFactory: ModelRendererFactory;
    protected options: ViewerOptions;
    protected logger: ILogger;
    constructor(modelRendererFactory: ModelRendererFactory, patcherProvider: PatcherProvider, popupPostprocessors: IVNodePostprocessor[]);
    protected readonly popupRenderer: ModelRenderer;
    protected readonly patcher: Patcher;
    protected lastPopupVDOM: VNode;
    update(model: Readonly<SModelRoot>, cause?: Action): void;
}
//# sourceMappingURL=viewer.d.ts.map