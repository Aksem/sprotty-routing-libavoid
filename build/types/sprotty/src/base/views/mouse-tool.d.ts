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
import { Action } from "../actions/action";
import { IActionDispatcher } from "../actions/action-dispatcher";
import { SModelElement, SModelRoot } from "../model/smodel";
import { DOMHelper } from "./dom-helper";
import { IVNodePostprocessor } from "./vnode-postprocessor";
import { Point } from "../../utils/geometry";
export declare class MouseTool implements IVNodePostprocessor {
    protected mouseListeners: MouseListener[];
    protected actionDispatcher: IActionDispatcher;
    protected domHelper: DOMHelper;
    constructor(mouseListeners?: MouseListener[]);
    register(mouseListener: MouseListener): void;
    deregister(mouseListener: MouseListener): void;
    protected getTargetElement(model: SModelRoot, event: MouseEvent): SModelElement | undefined;
    protected handleEvent<K extends keyof MouseListener>(methodName: K, model: SModelRoot, event: MouseEvent): void;
    protected focusOnMouseEvent<K extends keyof MouseListener>(methodName: K, model: SModelRoot): void;
    mouseOver(model: SModelRoot, event: MouseEvent): void;
    mouseOut(model: SModelRoot, event: MouseEvent): void;
    mouseEnter(model: SModelRoot, event: MouseEvent): void;
    mouseLeave(model: SModelRoot, event: MouseEvent): void;
    mouseDown(model: SModelRoot, event: MouseEvent): void;
    mouseMove(model: SModelRoot, event: MouseEvent): void;
    mouseUp(model: SModelRoot, event: MouseEvent): void;
    wheel(model: SModelRoot, event: WheelEvent): void;
    doubleClick(model: SModelRoot, event: MouseEvent): void;
    decorate(vnode: VNode, element: SModelElement): VNode;
    postUpdate(): void;
}
export declare class PopupMouseTool extends MouseTool {
    protected mouseListeners: MouseListener[];
    constructor(mouseListeners?: MouseListener[]);
}
export declare class MouseListener {
    mouseOver(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    mouseOut(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    mouseEnter(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    mouseLeave(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    mouseDown(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    mouseMove(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    mouseUp(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    wheel(target: SModelElement, event: WheelEvent): (Action | Promise<Action>)[];
    doubleClick(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    decorate(vnode: VNode, element: SModelElement): VNode;
}
export declare class MousePositionTracker extends MouseListener {
    protected lastPosition: Point | undefined;
    mouseMove(target: SModelElement, event: MouseEvent): (Action | Promise<Action>)[];
    /**
     * Returns the last tracked mouse cursor position relative to the diagram root or `undefined`
     * if no mouse cursor position was ever tracked yet.
     */
    get lastPositionOnDiagram(): Point | undefined;
}
//# sourceMappingURL=mouse-tool.d.ts.map