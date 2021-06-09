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
import { Action, RequestAction, ResponseAction } from "../../base/actions/action";
import { Command, CommandExecutionContext } from "../../base/commands/command";
import { ModelRequestCommand } from '../../base/commands/request-command';
import { SChildElement, SModelElement, SModelRoot, SParentElement } from '../../base/model/smodel';
import { KeyListener } from "../../base/views/key-tool";
import { MouseListener } from "../../base/views/mouse-tool";
import { ButtonHandlerRegistry } from '../button/button-handler';
import { Selectable } from "./model";
/**
 * Triggered when the user changes the selection, e.g. by clicking on a selectable element. The resulting
 * SelectCommand changes the `selected` state accordingly, so the elements can be rendered differently.
 * This action is also forwarded to the diagram server, if present, so it may react on the selection change.
 * Furthermore, the server can send such an action to the client in order to change the selection programmatically.
 */
export declare class SelectAction implements Action {
    readonly selectedElementsIDs: string[];
    readonly deselectedElementsIDs: string[];
    static readonly KIND = "elementSelected";
    kind: string;
    constructor(selectedElementsIDs?: string[], deselectedElementsIDs?: string[]);
}
/**
 * Programmatic action for selecting or deselecting all elements.
 */
export declare class SelectAllAction implements Action {
    readonly select: boolean;
    static readonly KIND = "allSelected";
    kind: string;
    /**
     * If `select` is true, all elements are selected, othewise they are deselected.
     */
    constructor(select?: boolean);
}
/**
 * Request action for retrieving the current selection.
 */
export declare class GetSelectionAction implements RequestAction<SelectionResult> {
    readonly requestId: string;
    static readonly KIND = "getSelection";
    kind: string;
    constructor(requestId?: string);
    /** Factory function to dispatch a request with the `IActionDispatcher` */
    static create(): RequestAction<SelectionResult>;
}
export declare class SelectionResult implements ResponseAction {
    readonly selectedElementsIDs: string[];
    readonly responseId: string;
    static readonly KIND = "selectionResult";
    kind: string;
    constructor(selectedElementsIDs: string[], responseId: string);
}
export declare class SelectCommand extends Command {
    action: SelectAction;
    static readonly KIND = "elementSelected";
    protected selected: (SChildElement & Selectable)[];
    protected deselected: (SChildElement & Selectable)[];
    constructor(action: SelectAction);
    execute(context: CommandExecutionContext): SModelRoot;
    undo(context: CommandExecutionContext): SModelRoot;
    redo(context: CommandExecutionContext): SModelRoot;
}
export declare class SelectAllCommand extends Command {
    protected readonly action: SelectAllAction;
    static readonly KIND = "allSelected";
    protected previousSelection: Record<string, boolean>;
    constructor(action: SelectAllAction);
    execute(context: CommandExecutionContext): SModelRoot;
    protected selectAll(element: SParentElement, newState: boolean): void;
    undo(context: CommandExecutionContext): SModelRoot;
    redo(context: CommandExecutionContext): SModelRoot;
}
export declare class SelectMouseListener extends MouseListener {
    protected buttonHandlerRegistry: ButtonHandlerRegistry;
    wasSelected: boolean;
    hasDragged: boolean;
    mouseDown(target: SModelElement, event: MouseEvent): Action[];
    mouseMove(target: SModelElement, event: MouseEvent): Action[];
    mouseUp(target: SModelElement, event: MouseEvent): Action[];
    decorate(vnode: VNode, element: SModelElement): VNode;
}
export declare class GetSelectionCommand extends ModelRequestCommand {
    protected readonly action: GetSelectionAction;
    static readonly KIND = "getSelection";
    protected previousSelection: Record<string, boolean>;
    constructor(action: GetSelectionAction);
    protected retrieveResult(context: CommandExecutionContext): ResponseAction;
}
export declare class SelectKeyboardListener extends KeyListener {
    keyDown(element: SModelElement, event: KeyboardEvent): Action[];
}
//# sourceMappingURL=select.d.ts.map