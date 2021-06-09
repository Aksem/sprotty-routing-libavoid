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
import { SModelRoot, SChildElement, SModelElement } from '../../base/model/smodel';
import { Action } from "../../base/actions/action";
import { Command, CommandExecutionContext } from "../../base/commands/command";
/**
 * Action to render the selected elements in front of others by manipulating the z-order.
 */
export declare class BringToFrontAction implements Action {
    readonly elementIDs: string[];
    static readonly KIND = "bringToFront";
    kind: string;
    constructor(elementIDs: string[]);
}
export declare type ZOrderElement = {
    element: SChildElement;
    index: number;
};
export declare class BringToFrontCommand extends Command {
    action: BringToFrontAction;
    static readonly KIND = "bringToFront";
    protected selected: ZOrderElement[];
    constructor(action: BringToFrontAction);
    execute(context: CommandExecutionContext): SModelRoot;
    protected includeConnectedEdges(element?: SModelElement): void;
    protected addToSelection(element: SChildElement): void;
    undo(context: CommandExecutionContext): SModelRoot;
    redo(context: CommandExecutionContext): SModelRoot;
    protected bringToFront(selection: ZOrderElement): void;
}
//# sourceMappingURL=zorder.d.ts.map