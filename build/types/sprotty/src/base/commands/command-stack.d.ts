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
import { IModelFactory } from "../model/smodel-factory";
import { SModelRoot } from "../model/smodel";
import { Action } from "../actions/action";
import { AnimationFrameSyncer } from "../animations/animation-frame-syncer";
import { IViewer, IViewerProvider } from "../views/viewer";
import { CommandStackOptions } from './command-stack-options';
import { ICommand, CommandExecutionContext, CommandReturn, CommandResult } from './command';
/**
 * The component that holds the current model and applies the commands
 * to change it.
 *
 * The command stack is called by the ActionDispatcher and forwards the
 * changed model to the Viewer that renders it.
 */
export interface ICommandStack {
    /**
     * Executes the given command on the current model and returns a
     * Promise for the new result.
     *
     * Unless it is a special command, it is pushed to the undo stack
     * such that it can be rolled back later and the redo stack is
     * cleared.
     */
    execute(command: ICommand): Promise<SModelRoot>;
    /**
     * Executes all of the given commands. As opposed to calling
     * execute() multiple times, the Viewer is only updated once after
     * the last command has been executed.
     */
    executeAll(commands: ICommand[]): Promise<SModelRoot>;
    /**
     * Takes the topmost command from the undo stack, undoes its
     * changes and pushes it ot the redo stack. Returns a Promise for
     * the changed model.
     */
    undo(): Promise<SModelRoot>;
    /**
     * Takes the topmost command from the redo stack, redoes its
     * changes and pushes it ot the undo stack. Returns a Promise for
     * the changed model.
     */
    redo(): Promise<SModelRoot>;
}
/**
 * As part of the event cylce, the ICommandStack should be injected
 * using a provider to avoid cyclic injection dependencies.
 */
export declare type CommandStackProvider = () => Promise<ICommandStack>;
/**
 * The implementation of the ICommandStack. Clients should not use this
 * class directly.
 *
 * The command stack holds the current model as the result of the current
 * promise. When a new command is executed/undone/redone, its execution is
 * chained using <code>Promise#then()</code> to the current Promise. This
 * way we can handle long running commands without blocking the current
 * thread.
 *
 * The command stack also does the special handling for special commands:
 *
 * System commands should be transparent to the user and as such be
 * automatically undone/redone with the next plain command. Additional care
 * must be taken that system commands that are executed after undo don't
 * break the correspondence between the topmost commands on the undo and
 * redo stacks.
 *
 * Hidden commands only tell the viewer to render a hidden model such that
 * its bounds can be extracted from the DOM and forwarded as separate actions.
 * Hidden commands should not leave any trace on the undo/redo/off stacks.
 *
 * Mergeable commands should be merged with their predecessor if possible,
 * such that e.g. multiple subsequent moves of the smae element can be undone
 * in one single step.
 */
export declare class CommandStack implements ICommandStack {
    protected modelFactory: IModelFactory;
    protected viewerProvider: IViewerProvider;
    protected logger: ILogger;
    protected syncer: AnimationFrameSyncer;
    protected options: CommandStackOptions;
    protected currentPromise: Promise<CommandStackState>;
    protected modelViewer?: IViewer;
    protected hiddenModelViewer?: IViewer;
    protected popupModelViewer?: IViewer;
    protected undoStack: ICommand[];
    protected redoStack: ICommand[];
    /**
     * System commands should be transparent to the user in undo/redo
     * operations. When a system command is executed when the redo
     * stack is not empty, it is pushed to offStack instead.
     *
     * On redo, all commands form this stack are undone such that the
     * redo operation gets the exact same model as when it was executed
     * first.
     *
     * On undo, all commands form this stack are undone as well as
     * system ommands should be transparent to the user.
     */
    protected offStack: ICommand[];
    protected initialize(): void;
    protected get currentModel(): Promise<SModelRoot>;
    executeAll(commands: ICommand[]): Promise<SModelRoot>;
    execute(command: ICommand): Promise<SModelRoot>;
    undo(): Promise<SModelRoot>;
    redo(): Promise<SModelRoot>;
    /**
     * Chains the current promise with another Promise that performs the
     * given operation on the given command.
     *
     * @param beforeResolve a function that is called directly before
     *      resolving the Promise to return the new model. Usually puts the
     *      command on the appropriate stack.
     */
    protected handleCommand(command: ICommand, operation: (context: CommandExecutionContext) => CommandReturn, beforeResolve: (command: ICommand, context: CommandExecutionContext) => void): void;
    protected pushToUndoStack(command: ICommand): void;
    /**
     * Notifies the Viewer to render the new model and/or the new hidden model
     * and returns a Promise for the new model.
     */
    protected thenUpdate(): Promise<SModelRoot>;
    /**
     * Notify the `ModelViewer` that the model has changed.
     */
    update(model: SModelRoot, cause?: Action): void;
    /**
     * Notify the `HiddenModelViewer` that the hidden model has changed.
     */
    updateHidden(model: SModelRoot, cause?: Action): void;
    /**
     * Notify the `PopupModelViewer` that the popup model has changed.
     */
    updatePopup(model: SModelRoot, cause?: Action): void;
    /**
     * Handling of commands after their execution.
     *
     * Hidden commands are not pushed to any stack.
     *
     * System commands are pushed to the <code>offStack</code> when the redo
     * stack is not empty, allowing to undo the before a redo to keep the chain
     * of commands consistent.
     *
     * Mergable commands are merged if possible.
     */
    protected mergeOrPush(command: ICommand, context: CommandExecutionContext): void;
    /**
     * Reverts all system commands on the offStack.
     */
    protected undoOffStackSystemCommands(): void;
    /**
     * System commands should be transparent to the user, so this method
     * is called from <code>undo()</code> to revert all system commands
     * at the top of the undoStack.
     */
    protected undoPreceedingSystemCommands(): void;
    /**
     * System commands should be transparent to the user, so this method
     * is called from <code>redo()</code> to re-execute all system commands
     * at the top of the redoStack.
     */
    protected redoFollowingSystemCommands(): void;
    /**
     * Assembles the context object that is passed to the commands execution method.
     */
    protected createContext(currentModel: SModelRoot): CommandExecutionContext;
    protected isPushToOffStack(command: ICommand): boolean;
    protected isPushToUndoStack(command: ICommand): boolean;
    protected isBlockUndo(command: ICommand): boolean;
}
/**
 * Internal type to pass the results between the promises in the `CommandStack`.
 */
export interface CommandStackState {
    main: CommandResult;
    hidden: CommandResult;
    popup: CommandResult;
}
//# sourceMappingURL=command-stack.d.ts.map