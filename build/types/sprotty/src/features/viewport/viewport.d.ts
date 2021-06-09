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
import { Bounds } from "../../utils/geometry";
import { SModelElement, SModelRoot } from "../../base/model/smodel";
import { Action, RequestAction, ResponseAction } from "../../base/actions/action";
import { MergeableCommand, ICommand, CommandExecutionContext, CommandReturn } from "../../base/commands/command";
import { Animation } from "../../base/animations/animation";
import { Viewport } from "./model";
import { ModelRequestCommand } from "../../base/commands/request-command";
export declare class SetViewportAction implements Action {
    readonly elementId: string;
    readonly newViewport: Viewport;
    readonly animate: boolean;
    static readonly KIND = "viewport";
    kind: string;
    constructor(elementId: string, newViewport: Viewport, animate: boolean);
}
/**
 * Request action for retrieving the current viewport and canvas bounds.
 */
export declare class GetViewportAction implements RequestAction<ViewportResult> {
    readonly requestId: string;
    static readonly KIND = "getViewport";
    kind: string;
    constructor(requestId?: string);
    /** Factory function to dispatch a request with the `IActionDispatcher` */
    static create(): RequestAction<ViewportResult>;
}
export declare class ViewportResult implements ResponseAction {
    readonly viewport: Viewport;
    readonly canvasBounds: Bounds;
    readonly responseId: string;
    static readonly KIND = "viewportResult";
    kind: string;
    constructor(viewport: Viewport, canvasBounds: Bounds, responseId: string);
}
export declare class SetViewportCommand extends MergeableCommand {
    protected readonly action: SetViewportAction;
    static readonly KIND = "viewport";
    protected element: SModelElement & Viewport;
    protected oldViewport: Viewport;
    protected newViewport: Viewport;
    constructor(action: SetViewportAction);
    execute(context: CommandExecutionContext): CommandReturn;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
    merge(command: ICommand, context: CommandExecutionContext): boolean;
}
export declare class GetViewportCommand extends ModelRequestCommand {
    protected readonly action: GetViewportAction;
    static readonly KIND = "getViewport";
    constructor(action: GetViewportAction);
    protected retrieveResult(context: CommandExecutionContext): ResponseAction;
}
export declare class ViewportAnimation extends Animation {
    protected element: SModelElement & Viewport;
    protected oldViewport: Viewport;
    protected newViewport: Viewport;
    protected context: CommandExecutionContext;
    protected zoomFactor: number;
    constructor(element: SModelElement & Viewport, oldViewport: Viewport, newViewport: Viewport, context: CommandExecutionContext);
    tween(t: number, context: CommandExecutionContext): SModelRoot;
}
//# sourceMappingURL=viewport.d.ts.map