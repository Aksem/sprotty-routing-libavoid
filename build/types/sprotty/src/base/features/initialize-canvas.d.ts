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
import { Bounds } from '../../utils/geometry';
import { Action } from '../actions/action';
import { IActionDispatcher } from '../actions/action-dispatcher';
import { IVNodePostprocessor } from "../views/vnode-postprocessor";
import { SModelElement, SModelRoot } from "../model/smodel";
import { SystemCommand, CommandExecutionContext, CommandReturn } from '../commands/command';
/**
 * Grabs the bounds from the root element in page coordinates and fires a
 * InitializeCanvasBoundsAction. This size is needed for other actions such
 * as FitToScreenAction.
 */
export declare class CanvasBoundsInitializer implements IVNodePostprocessor {
    protected rootAndVnode: [SModelRoot, VNode] | undefined;
    protected actionDispatcher: IActionDispatcher;
    decorate(vnode: VNode, element: SModelElement): VNode;
    postUpdate(): void;
    protected getBoundsInPage(element: Element): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}
export declare class InitializeCanvasBoundsAction implements Action {
    readonly newCanvasBounds: Bounds;
    static readonly KIND: string;
    readonly kind: string;
    constructor(newCanvasBounds: Bounds);
}
export declare class InitializeCanvasBoundsCommand extends SystemCommand {
    protected readonly action: InitializeCanvasBoundsAction;
    static readonly KIND: string;
    private newCanvasBounds;
    constructor(action: InitializeCanvasBoundsAction);
    execute(context: CommandExecutionContext): CommandReturn;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
}
//# sourceMappingURL=initialize-canvas.d.ts.map