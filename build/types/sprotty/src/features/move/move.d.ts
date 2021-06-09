/********************************************************************************
 * Copyright (c) 2017-2020 TypeFox and others.
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
import { VNode } from "snabbdom/vnode";
import { Action } from "../../base/actions/action";
import { Animation } from "../../base/animations/animation";
import { CommandExecutionContext, ICommand, MergeableCommand, CommandReturn } from "../../base/commands/command";
import { SModelElement, SModelRoot } from '../../base/model/smodel';
import { MouseListener } from "../../base/views/mouse-tool";
import { IVNodePostprocessor } from "../../base/views/vnode-postprocessor";
import { Point } from '../../utils/geometry';
import { SRoutableElement, SRoutingHandle } from "../routing/model";
import { EdgeMemento, EdgeRouterRegistry, RoutedPoint } from "../routing/routing";
import { Locateable } from './model';
import { ISnapper } from "./snap";
export declare class MoveAction implements Action {
    readonly moves: ElementMove[];
    readonly animate: boolean;
    readonly finished: boolean;
    kind: string;
    constructor(moves: ElementMove[], animate?: boolean, finished?: boolean);
}
export interface ElementMove {
    elementId: string;
    fromPosition?: Point;
    toPosition: Point;
}
export interface ResolvedElementMove {
    element: SModelElement & Locateable;
    fromPosition: Point;
    toPosition: Point;
}
export interface ResolvedHandleMove {
    handle: SRoutingHandle;
    fromPosition: Point;
    toPosition: Point;
}
export declare class MoveCommand extends MergeableCommand {
    protected readonly action: MoveAction;
    static readonly KIND = "move";
    edgeRouterRegistry?: EdgeRouterRegistry;
    protected resolvedMoves: Map<string, ResolvedElementMove>;
    protected edgeMementi: EdgeMemento[];
    constructor(action: MoveAction);
    execute(context: CommandExecutionContext): CommandReturn;
    protected resolveHandleMove(handle: SRoutingHandle, edge: SRoutableElement, move: ElementMove): ResolvedHandleMove | undefined;
    protected resolveElementMove(element: SModelElement & Locateable, move: ElementMove): ResolvedElementMove | undefined;
    protected doMove(edge2move: Map<SRoutableElement, ResolvedHandleMove[]>, attachedEdgeShifts: Map<SRoutableElement, Point>): void;
    protected undoMove(): void;
    undo(context: CommandExecutionContext): Promise<SModelRoot>;
    redo(context: CommandExecutionContext): Promise<SModelRoot>;
    merge(other: ICommand, context: CommandExecutionContext): boolean;
}
export declare class MoveAnimation extends Animation {
    protected model: SModelRoot;
    elementMoves: Map<string, ResolvedElementMove>;
    protected reverse: boolean;
    constructor(model: SModelRoot, elementMoves: Map<string, ResolvedElementMove>, context: CommandExecutionContext, reverse?: boolean);
    tween(t: number): SModelRoot;
}
interface ExpandedEdgeMorph {
    startExpandedRoute: Point[];
    endExpandedRoute: Point[];
    memento: EdgeMemento;
}
export declare class MorphEdgesAnimation extends Animation {
    protected model: SModelRoot;
    protected reverse: boolean;
    protected expanded: ExpandedEdgeMorph[];
    constructor(model: SModelRoot, originalMementi: EdgeMemento[], context: CommandExecutionContext, reverse?: boolean);
    protected midPoint(edgeMemento: EdgeMemento): Point;
    start(): Promise<SModelRoot>;
    tween(t: number): SModelRoot;
    protected growToSize(route: RoutedPoint[], targetSize: number): Point[];
}
export declare class MoveMouseListener extends MouseListener {
    edgeRouterRegistry?: EdgeRouterRegistry;
    snapper?: ISnapper;
    hasDragged: boolean;
    startDragPosition: Point | undefined;
    elementId2startPos: Map<string, Point>;
    mouseDown(target: SModelElement, event: MouseEvent): Action[];
    mouseMove(target: SModelElement, event: MouseEvent): Action[];
    protected collectStartPositions(root: SModelRoot): void;
    protected isChildOfSelected(selectedElements: Set<SModelElement>, element: SModelElement): boolean;
    protected getElementMoves(target: SModelElement, event: MouseEvent, isFinished: boolean): MoveAction | undefined;
    protected snap(position: Point, element: SModelElement, isSnap: boolean): Point;
    protected getHandlePosition(handle: SRoutingHandle): Point | undefined;
    mouseEnter(target: SModelElement, event: MouseEvent): Action[];
    mouseUp(target: SModelElement, event: MouseEvent): Action[];
    decorate(vnode: VNode, element: SModelElement): VNode;
}
export declare class LocationPostprocessor implements IVNodePostprocessor {
    decorate(vnode: VNode, element: SModelElement): VNode;
    postUpdate(): void;
}
export {};
//# sourceMappingURL=move.d.ts.map