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
/**
 * An action describes a change to the model declaratively.
 * It is a plain data structure, and as such transferable between server and client. An action must never contain actual
 * SModelElement instances, but either refer to them via their ids or contain serializable schema for model elements.
 */
export interface Action {
    readonly kind: string;
}
export declare function isAction(object?: any): object is Action;
/**
 * A request action is tied to the expectation of receiving a corresponding response action.
 * The `requestId` property is used to match the received response with the original request.
 */
export interface RequestAction<Res extends ResponseAction> extends Action {
    readonly requestId: string;
}
export declare function isRequestAction(object?: any): object is RequestAction<ResponseAction>;
/**
 * Generate a unique `requestId` for a request action.
 */
export declare function generateRequestId(): string;
/**
 * A response action is sent to respond to a request action. The `responseId` must match
 * the `requestId` of the preceding request. In case the `responseId` is empty or undefined,
 * the action is handled as standalone, i.e. it was fired without a preceding request.
 */
export interface ResponseAction extends Action {
    readonly responseId: string;
}
export declare function isResponseAction(object?: any): object is ResponseAction;
/**
 * A reject action is fired to indicate that a request must be rejected.
 */
export declare class RejectAction implements ResponseAction {
    readonly message: string;
    readonly responseId: string;
    readonly detail?: string | number | boolean | import("../../utils/json").JsonMap | import("../../utils/json").JsonArray | null | undefined;
    static readonly KIND = "rejectRequest";
    readonly kind = "rejectRequest";
    constructor(message: string, responseId: string, detail?: string | number | boolean | import("../../utils/json").JsonMap | import("../../utils/json").JsonArray | null | undefined);
}
/**
 * A list of actions with a label.
 * Labeled actions are used to denote a group of actions in a user-interface context, e.g.,
 * to define an entry in the command palette or in the context menu.
 */
export declare class LabeledAction {
    readonly label: string;
    readonly actions: Action[];
    readonly icon?: string | undefined;
    constructor(label: string, actions: Action[], icon?: string | undefined);
}
export declare function isLabeledAction(element: any): element is LabeledAction;
//# sourceMappingURL=action.d.ts.map