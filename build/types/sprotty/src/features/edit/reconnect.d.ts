/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
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
import { Action } from "../../base/actions/action";
import { Command, CommandExecutionContext, CommandReturn } from "../../base/commands/command";
import { EdgeMemento, EdgeRouterRegistry } from "../routing/routing";
export declare class ReconnectAction implements Action {
    readonly routableId: string;
    readonly newSourceId?: string | undefined;
    readonly newTargetId?: string | undefined;
    static readonly KIND = "reconnect";
    readonly kind = "reconnect";
    constructor(routableId: string, newSourceId?: string | undefined, newTargetId?: string | undefined);
}
export declare class ReconnectCommand extends Command {
    protected readonly action: ReconnectAction;
    static readonly KIND = "reconnect";
    edgeRouterRegistry: EdgeRouterRegistry;
    memento: EdgeMemento | undefined;
    constructor(action: ReconnectAction);
    execute(context: CommandExecutionContext): CommandReturn;
    private doExecute;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
}
//# sourceMappingURL=reconnect.d.ts.map