/********************************************************************************
 * Copyright (c) 2020 TypeFox and others.
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
import { VNode } from 'snabbdom/vnode';
import { Point } from '../../utils/geometry';
import { IView, RenderingContext } from '../../base/views/view';
import { SRoutableElement } from './model';
export declare abstract class RoutableView implements IView {
    /**
     * Check whether the given model element is in the current viewport. Use this method
     * in your `render` implementation to skip rendering in case the element is not visible.
     * This can greatly enhance performance for large models.
     */
    isVisible(model: Readonly<SRoutableElement>, route: Point[], context: RenderingContext): boolean;
    abstract render(model: Readonly<SRoutableElement>, context: RenderingContext, args?: object): VNode | undefined;
}
//# sourceMappingURL=views.d.ts.map