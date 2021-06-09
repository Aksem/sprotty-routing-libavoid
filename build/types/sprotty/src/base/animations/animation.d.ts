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
import { CommandExecutionContext } from "../commands/command";
import { SModelRoot } from "../model/smodel";
/**
 * An animation uses the rendering loop of the browser to smoothly
 * calculate a transition between two states of a model element.
 */
export declare abstract class Animation {
    protected context: CommandExecutionContext;
    protected ease: (x: number) => number;
    constructor(context: CommandExecutionContext, ease?: (x: number) => number);
    start(): Promise<SModelRoot>;
    /**
     * This method called by the animation at each rendering pass until
     * the duration is reached. Implement it to interpolate the state.
     *
     * @param t varies between 0 (start of animation) and 1 (end of animation)
     * @param context
     */
    abstract tween(t: number, context: CommandExecutionContext): SModelRoot;
}
export declare class CompoundAnimation extends Animation {
    protected model: SModelRoot;
    protected context: CommandExecutionContext;
    components: Animation[];
    protected ease: (x: number) => number;
    constructor(model: SModelRoot, context: CommandExecutionContext, components?: Animation[], ease?: (x: number) => number);
    include(animation: Animation): this;
    tween(t: number, context: CommandExecutionContext): SModelRoot;
}
//# sourceMappingURL=animation.d.ts.map