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
export declare function setAttr(vnode: VNode, name: string, value: any): void;
export declare function setClass(vnode: VNode, name: string, value: boolean): void;
export declare function setNamespace(node: VNode, ns: string): void;
export declare function copyClassesFromVNode(source: VNode, target: VNode): void;
export declare function copyClassesFromElement(element: HTMLElement, target: VNode): void;
export declare function mergeStyle(vnode: VNode, style: any): void;
export declare function on(vnode: VNode, event: string, listener: (model: SModelElement, event: Event) => void, element: SModelElement): void;
export declare function getAttrs(vnode: VNode): Record<string, string | number | boolean>;
//# sourceMappingURL=vnode-utils.d.ts.map