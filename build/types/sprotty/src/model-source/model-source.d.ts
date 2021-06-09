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
import { Action } from "../base/actions/action";
import { IActionDispatcher } from "../base/actions/action-dispatcher";
import { ActionHandlerRegistry, IActionHandler, IActionHandlerInitializer } from "../base/actions/action-handler";
import { ICommand } from "../base/commands/command";
import { ViewerOptions } from "../base/views/viewer-options";
import { SModelRootSchema, SModelIndex, SModelElementSchema } from "../base/model/smodel";
import { ComputedBoundsAction } from "../features/bounds/bounds-manipulation";
import { Point, Dimension } from "../utils/geometry";
/**
 * A model source is serving the model to the event cycle. It represents
 * the entry point to the client for external sources, such as model
 * editors.
 *
 * As an IActionHandler it listens to actions in and reacts to them with
 * commands or actions if necessary. This way, you can implement action
 * protocols between the client and the outside world.
 *
 * There are two default implementations for a ModelSource:
 * <ul>
 * <li>the LocalModelSource handles the actions to calculate bounds and
 * set/update the model</li>
 * <li>the DiagramServer connects via websocket to a remote source. It
 * can be used to connect to a model editor that provides the model,
 * layouts diagrams, transfers selection and answers model queries from
 * the client.</li>
 */
export declare abstract class ModelSource implements IActionHandler, IActionHandlerInitializer {
    readonly actionDispatcher: IActionDispatcher;
    protected viewerOptions: ViewerOptions;
    initialize(registry: ActionHandlerRegistry): void;
    abstract handle(action: Action): ICommand | Action | void;
    /**
     * Commit changes from the internal SModel back to the currentModel.
     *
     * This method is meant to be called only by CommitModelCommand and other commands
     * that need to feed the current internal model back to the model source. It does
     * not have any side effects such as triggering layout or bounds computation, as the
     * internal model is already current. See `CommitModelAction` for details.
     *
     * @param newRoot the new model.
     * @return the previous model.
     */
    abstract commitModel(newRoot: SModelRootSchema): Promise<SModelRootSchema> | SModelRootSchema;
}
export declare class ComputedBoundsApplicator {
    apply(root: SModelRootSchema, action: ComputedBoundsAction): SModelIndex<SModelElementSchema>;
    protected applyAlignment(element: SModelElementSchema, newAlignment: Point): void;
    protected applyBounds(element: SModelElementSchema, newPosition: Point | undefined, newSize: Dimension): void;
}
//# sourceMappingURL=model-source.d.ts.map