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
import { IActionDispatcher } from "../actions/action-dispatcher";
import { SModelElement, SModelRoot } from "../model/smodel";
import { Action } from "../actions/action";
import { IVNodePostprocessor } from "./vnode-postprocessor";
export declare class KeyTool implements IVNodePostprocessor {
    protected keyListeners: KeyListener[];
    protected actionDispatcher: IActionDispatcher;
    constructor(keyListeners?: KeyListener[]);
    register(keyListener: KeyListener): void;
    deregister(keyListener: KeyListener): void;
    protected handleEvent<K extends keyof KeyListener>(methodName: K, model: SModelRoot, event: KeyboardEvent): void;
    keyDown(element: SModelRoot, event: KeyboardEvent): void;
    keyUp(element: SModelRoot, event: KeyboardEvent): void;
    focus(): void;
    decorate(vnode: VNode, element: SModelElement): VNode;
    postUpdate(): void;
}
export declare class KeyListener {
    keyDown(element: SModelElement, event: KeyboardEvent): Action[];
    keyUp(element: SModelElement, event: KeyboardEvent): Action[];
}
//# sourceMappingURL=key-tool.d.ts.map