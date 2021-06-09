/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
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
import { SChildElement, SModelElement } from '../../base/model/smodel';
import { SModelExtension } from '../../base/model/smodel-extension';
import { SEdge } from '../../graph/sgraph';
import { Point, Bounds } from '../../utils/geometry';
import { FluentIterable } from '../../utils/iterable';
import { SShapeElement } from '../bounds/model';
import { Selectable } from '../select/model';
import { Hoverable } from '../hover/model';
export declare abstract class SRoutableElement extends SChildElement {
    routerKind?: string;
    routingPoints: Point[];
    sourceId: string;
    targetId: string;
    sourceAnchorCorrection?: number;
    targetAnchorCorrection?: number;
    get source(): SConnectableElement | undefined;
    get target(): SConnectableElement | undefined;
    get bounds(): Bounds;
}
export declare const connectableFeature: unique symbol;
export interface Connectable extends SModelExtension {
    canConnect(routable: SRoutableElement, role: 'source' | 'target'): boolean;
}
export declare function isConnectable<T extends SModelElement>(element: T): element is Connectable & T;
export declare function getAbsoluteRouteBounds(model: Readonly<SRoutableElement>, route?: Point[]): Bounds;
export declare function getRouteBounds(route: Point[]): Bounds;
/**
 * A connectable element is one that can have outgoing and incoming edges, i.e. it can be the source
 * or target element of an edge. There are two kinds of connectable elements: nodes (`SNode`) and
 * ports (`SPort`). A node represents a main entity, while a port is a connection point inside a node.
 */
export declare abstract class SConnectableElement extends SShapeElement implements Connectable {
    anchorKind?: string;
    strokeWidth: number;
    /**
     * The incoming edges of this connectable element. They are resolved by the index, which must
     * be an `SGraphIndex`.
     */
    get incomingEdges(): FluentIterable<SEdge>;
    /**
     * The outgoing edges of this connectable element. They are resolved by the index, which must
     * be an `SGraphIndex`.
     */
    get outgoingEdges(): FluentIterable<SEdge>;
    canConnect(routable: SRoutableElement, role: 'source' | 'target'): boolean;
}
export declare type RoutingHandleKind = 'junction' | 'line' | 'source' | 'target' | 'manhattan-50%';
export declare class SRoutingHandle extends SChildElement implements Selectable, Hoverable {
    static readonly DEFAULT_FEATURES: symbol[];
    /**
     * 'junction' is a point where two line segments meet,
     * 'line' is a volatile handle placed on a line segment,
     * 'source' and 'target' are the respective anchors.
     */
    kind: RoutingHandleKind;
    /** The actual routing point index (junction) or the previous point index (line). */
    pointIndex: number;
    /** Whether the routing point is being dragged. */
    editMode: boolean;
    hoverFeedback: boolean;
    selected: boolean;
    danglingAnchor?: SDanglingAnchor;
    /**
     * SRoutingHandles are created using the constructor, so we hard-wire the
     * default features
     */
    hasFeature(feature: symbol): boolean;
}
export declare class SDanglingAnchor extends SConnectableElement {
    static readonly DEFAULT_FEATURES: symbol[];
    original?: SModelElement;
    type: string;
    constructor();
}
export declare const edgeInProgressID = "edge-in-progress";
export declare const edgeInProgressTargetHandleID: string;
//# sourceMappingURL=model.d.ts.map