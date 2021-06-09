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
import { JsonPrimitive } from '../../utils/json';
import { Action, RequestAction, ResponseAction } from "../actions/action";
import { CommandExecutionContext, ResetCommand } from "../commands/command";
import { SModelRoot, SModelRootSchema } from "../model/smodel";
/**
 * Sent from the client to the model source (e.g. a DiagramServer) in order to request a model. Usually this
 * is the first message that is sent to the source, so it is also used to initiate the communication.
 * The response is a SetModelAction or an UpdateModelAction.
 */
export declare class RequestModelAction implements RequestAction<SetModelAction> {
    readonly options?: {
        [key: string]: string | number | boolean;
    } | undefined;
    readonly requestId: string;
    static readonly KIND = "requestModel";
    readonly kind = "requestModel";
    constructor(options?: {
        [key: string]: string | number | boolean;
    } | undefined, requestId?: string);
    /** Factory function to dispatch a request with the `IActionDispatcher` */
    static create(options?: {
        [key: string]: JsonPrimitive;
    }): RequestAction<SetModelAction>;
}
/**
 * Sent from the model source to the client in order to set the model. If a model is already present, it is replaced.
 */
export declare class SetModelAction implements ResponseAction {
    readonly newRoot: SModelRootSchema;
    readonly responseId: string;
    static readonly KIND = "setModel";
    readonly kind = "setModel";
    constructor(newRoot: SModelRootSchema, responseId?: string);
}
export declare class SetModelCommand extends ResetCommand {
    protected readonly action: SetModelAction;
    static readonly KIND = "setModel";
    oldRoot: SModelRoot;
    newRoot: SModelRoot;
    constructor(action: SetModelAction);
    execute(context: CommandExecutionContext): SModelRoot;
    undo(context: CommandExecutionContext): SModelRoot;
    redo(context: CommandExecutionContext): SModelRoot;
    get blockUntil(): (action: Action) => boolean;
}
//# sourceMappingURL=set-model.d.ts.map