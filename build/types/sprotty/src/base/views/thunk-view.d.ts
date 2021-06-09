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
import { VNode } from "snabbdom/vnode";
import { SModelElement } from "../model/smodel";
import { RenderingContext, IView } from "./view";
/**
 * An view that avoids calculation and patching of VNodes unless some model properties have changed.
 * Based on snabbdom's thunks.
 */
export declare abstract class ThunkView implements IView {
    /**
     * Returns the array of values that are watched for changes.
     * If they haven't change since the last rendering, the VNode is neither recalculated nor patched.
     */
    abstract watchedArgs(model: SModelElement): any[];
    /**
     * Returns the selector of the VNode root, i.e. it's element type.
     */
    abstract selector(model: SModelElement): string;
    /**
     * Calculate the VNode from the input data. Only called if the watched properties change.
     */
    abstract doRender(model: SModelElement, context: RenderingContext): VNode;
    render(model: SModelElement, context: RenderingContext): VNode;
    protected renderAndDecorate(model: SModelElement, context: RenderingContext): VNode;
    protected copyToThunk(vnode: VNode, thunk: VNode): void;
    protected init(thunk: VNode): void;
    protected prepatch(oldVnode: VNode, thunk: VNode): void;
    protected equals(oldArg: any, newArg: any): boolean;
}
export interface ThunkVNode extends VNode {
    thunk: boolean;
}
export declare function isThunk(vnode: VNode): vnode is ThunkVNode;
//# sourceMappingURL=thunk-view.d.ts.map