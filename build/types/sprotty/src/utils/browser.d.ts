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
import { Point } from "./geometry";
/**
 * Returns whether the mouse or keyboard event includes the CMD key
 * on Mac or CTRL key on Linux / others.
 */
export declare function isCtrlOrCmd(event: KeyboardEvent | MouseEvent): boolean;
export declare function isMac(): boolean;
export declare function isCrossSite(url: string): boolean;
/**
 * Returns the amount of scroll of the browser window as a point.
 */
export declare function getWindowScroll(): Point;
//# sourceMappingURL=browser.d.ts.map