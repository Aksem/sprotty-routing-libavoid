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
import { ViewerOptions } from '../../base/views/viewer-options';
import { ResponseAction, RequestAction } from '../../base/actions/action';
import { ActionDispatcher } from '../../base/actions/action-dispatcher';
import { SModelRoot } from '../../base/model/smodel';
import { Bounds } from '../../utils/geometry';
import { ILogger } from '../../utils/logging';
export declare class ExportSvgAction implements ResponseAction {
    readonly svg: string;
    readonly responseId: string;
    static KIND: string;
    kind: string;
    constructor(svg: string, responseId?: string);
}
export declare class SvgExporter {
    protected options: ViewerOptions;
    protected actionDispatcher: ActionDispatcher;
    protected log: ILogger;
    export(root: SModelRoot, request?: RequestAction<ExportSvgAction>): void;
    protected createSvg(svgElementOrig: SVGSVGElement, root: SModelRoot): string;
    protected copyStyles(source: Element, target: Element, skipedProperties: string[]): void;
    protected getBounds(root: SModelRoot): Bounds;
}
//# sourceMappingURL=svg-exporter.d.ts.map