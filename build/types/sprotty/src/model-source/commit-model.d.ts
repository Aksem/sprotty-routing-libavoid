/********************************************************************************
 * Copyright (c) 2019 TypeFox and others.
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
import { Action } from "../base/actions/action";
import { CommandExecutionContext, CommandReturn, SystemCommand } from "../base/commands/command";
import { SModelRoot, SModelRootSchema } from "../base/model/smodel";
import { ModelSource } from "./model-source";
/**
 * Commit the current SModel back to the model source.
 *
 * The SModel (AKA internal model) contains a lot of dirty/transitional state, such
 * as intermediate move postions or handles. When a user interaction that spans multiple
 * commands finishes, it fires a CommitModelAction to write the final changes back to
 * the model source.
 */
export declare class CommitModelAction implements Action {
    readonly kind = "commitModel";
}
export declare class CommitModelCommand extends SystemCommand {
    protected readonly action: CommitModelAction;
    static readonly KIND = "commitModel";
    modelSource: ModelSource;
    originalModel: SModelRootSchema;
    newModel: SModelRootSchema;
    constructor(action: CommitModelAction);
    execute(context: CommandExecutionContext): CommandReturn;
    protected doCommit(model: SModelRootSchema, result: SModelRoot, doSetOriginal: boolean): CommandReturn;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
}
//# sourceMappingURL=commit-model.d.ts.map