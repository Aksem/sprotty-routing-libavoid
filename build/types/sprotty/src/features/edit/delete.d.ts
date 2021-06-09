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
import { Command, CommandExecutionContext, CommandReturn } from "../../base/commands/command";
import { Action } from "../../base/actions/action";
import { SModelElement, SParentElement, SChildElement } from "../../base/model/smodel";
import { SModelExtension } from "../../base/model/smodel-extension";
export declare const deletableFeature: unique symbol;
export interface Deletable extends SModelExtension {
}
export declare function isDeletable<T extends SModelElement>(element: T): element is T & Deletable & SChildElement;
export declare class DeleteElementAction implements Action {
    readonly elementIds: string[];
    static readonly KIND = "delete";
    kind: string;
    constructor(elementIds: string[]);
}
export declare class ResolvedDelete {
    child: SChildElement;
    parent: SParentElement;
}
export declare class DeleteElementCommand extends Command {
    protected readonly action: DeleteElementAction;
    static readonly KIND = "delete";
    resolvedDeletes: ResolvedDelete[];
    constructor(action: DeleteElementAction);
    execute(context: CommandExecutionContext): CommandReturn;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
}
//# sourceMappingURL=delete.d.ts.map