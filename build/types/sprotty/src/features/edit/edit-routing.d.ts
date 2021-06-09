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
import { SModelElement, SModelRoot } from '../../base/model/smodel';
import { Point } from "../../utils/geometry";
import { SRoutableElement, SRoutingHandle } from "../routing/model";
import { EdgeRouterRegistry } from "../routing/routing";
export declare class SwitchEditModeAction implements Action {
    readonly elementsToActivate: string[];
    readonly elementsToDeactivate: string[];
    static readonly KIND: string;
    kind: string;
    constructor(elementsToActivate?: string[], elementsToDeactivate?: string[]);
}
export declare class SwitchEditModeCommand extends Command {
    protected readonly action: SwitchEditModeAction;
    static readonly KIND: string;
    edgeRouterRegistry: EdgeRouterRegistry;
    protected elementsToActivate: SModelElement[];
    protected elementsToDeactivate: SModelElement[];
    protected handlesToRemove: {
        handle: SRoutingHandle;
        parent: SRoutableElement;
        point?: Point;
    }[];
    constructor(action: SwitchEditModeAction);
    execute(context: CommandExecutionContext): CommandReturn;
    protected doExecute(context: CommandExecutionContext): SModelRoot;
    protected shouldRemoveHandle(handle: SRoutingHandle, parent: SRoutableElement): boolean;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
}
//# sourceMappingURL=edit-routing.d.ts.map