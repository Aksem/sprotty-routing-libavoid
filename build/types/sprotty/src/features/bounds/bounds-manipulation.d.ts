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
import { Action, RequestAction, ResponseAction } from "../../base/actions/action";
import { CommandExecutionContext, CommandResult, CommandReturn, HiddenCommand, SystemCommand } from "../../base/commands/command";
import { SModelElement, SModelRootSchema } from "../../base/model/smodel";
import { Bounds, Dimension, Point } from "../../utils/geometry";
import { Alignable, BoundsAware } from './model';
/**
 * Sent from the model source (e.g. a DiagramServer) to the client to update the bounds of some
 * (or all) model elements.
 */
export declare class SetBoundsAction implements Action {
    readonly bounds: ElementAndBounds[];
    static readonly KIND: string;
    readonly kind: string;
    constructor(bounds: ElementAndBounds[]);
}
/**
 * Sent from the model source to the client to request bounds for the given model. The model is
 * rendered invisibly so the bounds can derived from the DOM. The response is a ComputedBoundsAction.
 * This hidden rendering round-trip is necessary if the client is responsible for parts of the layout
 * (see `needsClientLayout` viewer option).
 */
export declare class RequestBoundsAction implements RequestAction<ComputedBoundsAction> {
    readonly newRoot: SModelRootSchema;
    readonly requestId: string;
    static readonly KIND: string;
    readonly kind: string;
    constructor(newRoot: SModelRootSchema, requestId?: string);
    /** Factory function to dispatch a request with the `IActionDispatcher` */
    static create(newRoot: SModelRootSchema): RequestAction<ComputedBoundsAction>;
}
/**
 * Sent from the client to the model source (e.g. a DiagramServer) to transmit the result of bounds
 * computation as a response to a RequestBoundsAction. If the server is responsible for parts of
 * the layout (see `needsServerLayout` viewer option), it can do so after applying the computed bounds
 * received with this action. Otherwise there is no need to send the computed bounds to the server,
 * so they can be processed locally by the client.
 */
export declare class ComputedBoundsAction implements ResponseAction {
    readonly bounds: ElementAndBounds[];
    readonly revision?: number | undefined;
    readonly alignments?: ElementAndAlignment[] | undefined;
    readonly responseId: string;
    static readonly KIND = "computedBounds";
    readonly kind = "computedBounds";
    constructor(bounds: ElementAndBounds[], revision?: number | undefined, alignments?: ElementAndAlignment[] | undefined, responseId?: string);
}
/**
 * Associates new bounds with a model element, which is referenced via its id.
 */
export interface ElementAndBounds {
    elementId: string;
    newPosition?: Point;
    newSize: Dimension;
}
/**
 * Associates a new alignment with a model element, which is referenced via its id.
 */
export interface ElementAndAlignment {
    elementId: string;
    newAlignment: Point;
}
/**
 * Request a layout of the diagram or the selected elements only.
 */
export declare class LayoutAction implements Action {
    static readonly KIND = "layout";
    readonly kind = "layout";
    layoutType: string;
    elementIds: string[];
}
export interface ResolvedElementAndBounds {
    element: SModelElement & BoundsAware;
    oldBounds: Bounds;
    newPosition?: Point;
    newSize: Dimension;
}
export interface ResolvedElementAndAlignment {
    element: SModelElement & Alignable;
    oldAlignment: Point;
    newAlignment: Point;
}
export declare class SetBoundsCommand extends SystemCommand {
    protected readonly action: SetBoundsAction;
    static readonly KIND: string;
    protected bounds: ResolvedElementAndBounds[];
    constructor(action: SetBoundsAction);
    execute(context: CommandExecutionContext): CommandReturn;
    undo(context: CommandExecutionContext): CommandReturn;
    redo(context: CommandExecutionContext): CommandReturn;
}
export declare class RequestBoundsCommand extends HiddenCommand {
    protected action: RequestBoundsAction;
    static readonly KIND: string;
    constructor(action: RequestBoundsAction);
    execute(context: CommandExecutionContext): CommandResult;
    get blockUntil(): (action: Action) => boolean;
}
//# sourceMappingURL=bounds-manipulation.d.ts.map