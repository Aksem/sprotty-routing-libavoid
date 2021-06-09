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
import { SModelElement } from '../../base/model/smodel';
import { SRoutableElement } from '../routing/model';
import { SModelExtension } from '../../base/model/smodel-extension';
import { Point, Dimension } from '../../utils/geometry';
export declare const editFeature: unique symbol;
export declare function canEditRouting(element: SModelElement): element is SRoutableElement;
export declare const editLabelFeature: unique symbol;
export interface EditableLabel extends SModelExtension {
    text: string;
    readonly isMultiLine?: boolean;
    readonly editControlDimension?: Dimension;
    readonly editControlPositionCorrection?: Point;
}
export declare function isEditableLabel<T extends SModelElement>(element: T): element is T & EditableLabel;
export declare const withEditLabelFeature: unique symbol;
export interface WithEditableLabel extends SModelExtension {
    readonly editableLabel?: EditableLabel & SModelElement;
}
export declare function isWithEditableLabel<T extends SModelElement>(element: T): element is T & WithEditableLabel;
//# sourceMappingURL=model.d.ts.map