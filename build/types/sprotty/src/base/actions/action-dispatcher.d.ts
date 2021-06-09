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
import { ILogger } from "../../utils/logging";
import { Deferred } from "../../utils/async";
import { ICommandStack } from "../commands/command-stack";
import { AnimationFrameSyncer } from "../animations/animation-frame-syncer";
import { Action, RequestAction, ResponseAction } from './action';
import { ActionHandlerRegistry } from "./action-handler";
import { IDiagramLocker } from "./diagram-locker";
export interface IActionDispatcher {
    dispatch(action: Action): Promise<void>;
    dispatchAll(actions: Action[]): Promise<void>;
    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res>;
}
/**
 * Collects actions, converts them to commands and dispatches them.
 * Also acts as the proxy to model sources such as diagram servers.
 */
export declare class ActionDispatcher implements IActionDispatcher {
    protected actionHandlerRegistryProvider: () => Promise<ActionHandlerRegistry>;
    protected commandStack: ICommandStack;
    protected logger: ILogger;
    protected syncer: AnimationFrameSyncer;
    protected diagramLocker: IDiagramLocker;
    protected actionHandlerRegistry: ActionHandlerRegistry;
    protected initialized: Promise<void> | undefined;
    protected blockUntil?: (action: Action) => boolean;
    protected postponedActions: PostponedAction[];
    protected readonly requests: Map<string, Deferred<ResponseAction>>;
    initialize(): Promise<void>;
    /**
     * Dispatch an action by querying all handlers that are registered for its kind.
     * The returned promise is resolved when all handler results (commands or actions)
     * have been processed.
     */
    dispatch(action: Action): Promise<void>;
    /**
     * Calls `dispatch` on every action in the given array. The returned promise
     * is resolved when the promises of all `dispatch` calls have been resolved.
     */
    dispatchAll(actions: Action[]): Promise<void>;
    /**
     * Dispatch a request. The returned promise is resolved when a response with matching
     * identifier is dispatched. That response is _not_ passed to the registered action
     * handlers. Instead, it is the responsibility of the caller of this method to handle
     * the response properly. For example, it can be sent to the registered handlers by
     * passing it again to the `dispatch` method.
     */
    request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res>;
    protected handleAction(action: Action): Promise<void>;
    protected handleBlocked(action: Action, predicate: (action: Action) => boolean): Promise<void>;
}
export interface PostponedAction {
    action: Action;
    resolve: () => void;
    reject: (reason: any) => void;
}
export declare type IActionDispatcherProvider = () => Promise<IActionDispatcher>;
//# sourceMappingURL=action-dispatcher.d.ts.map