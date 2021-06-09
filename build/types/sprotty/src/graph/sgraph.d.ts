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
import { SChildElement, SModelElement, SModelElementSchema, SModelIndex, SModelRootSchema } from '../base/model/smodel';
import { Alignable, BoundsAware, ModelLayoutOptions, SShapeElement, SShapeElementSchema } from '../features/bounds/model';
import { EdgePlacement } from '../features/edge-layout/model';
import { Fadeable } from '../features/fade/model';
import { Hoverable } from '../features/hover/model';
import { SConnectableElement, SRoutableElement } from '../features/routing/model';
import { Selectable } from '../features/select/model';
import { ViewportRootElement } from '../features/viewport/viewport-root';
import { Bounds, Point } from '../utils/geometry';
import { FluentIterable } from '../utils/iterable';
/**
 * Serializable schema for graph-like models.
 */
export interface SGraphSchema extends SModelRootSchema {
    children: SModelElementSchema[];
    bounds?: Bounds;
    scroll?: Point;
    zoom?: number;
    layoutOptions?: ModelLayoutOptions;
}
/**
 * Root element for graph-like models.
 */
export declare class SGraph extends ViewportRootElement {
    layoutOptions?: ModelLayoutOptions;
    constructor(index?: SGraphIndex);
}
/**
 * Serializable schema for SNode.
 */
export interface SNodeSchema extends SShapeElementSchema {
    layout?: string;
    selected?: boolean;
    hoverFeedback?: boolean;
    opacity?: number;
    anchorKind?: string;
}
/**
 * Model element class for nodes, which are the main entities in a graph. A node can be connected to
 * another node via an SEdge. Such a connection can be direct, i.e. the node is the source or target of
 * the edge, or indirect through a port, i.e. it contains an SPort which is the source or target of the edge.
 */
export declare class SNode extends SConnectableElement implements Selectable, Fadeable, Hoverable {
    static readonly DEFAULT_FEATURES: symbol[];
    children: SChildElement[];
    layout?: string;
    selected: boolean;
    hoverFeedback: boolean;
    opacity: number;
    canConnect(routable: SRoutableElement, role: string): boolean;
}
/**
 * Serializable schema for SPort.
 */
export interface SPortSchema extends SShapeElementSchema {
    selected?: boolean;
    hoverFeedback?: boolean;
    opacity?: number;
    anchorKind?: string;
}
/**
 * A port is a connection point for edges. It should always be contained in an SNode.
 */
export declare class SPort extends SConnectableElement implements Selectable, Fadeable, Hoverable {
    static readonly DEFAULT_FEATURES: symbol[];
    selected: boolean;
    hoverFeedback: boolean;
    opacity: number;
}
/**
 * Serializable schema for SEdge.
 */
export interface SEdgeSchema extends SModelElementSchema {
    sourceId: string;
    targetId: string;
    routerKind?: string;
    routingPoints?: Point[];
    selected?: boolean;
    hoverFeedback?: boolean;
    opacity?: number;
}
/**
 * Model element class for edges, which are the connectors in a graph. An edge has a source and a target,
 * each of which can be either a node or a port. The source and target elements are referenced via their
 * ids and can be resolved with the index stored in the root element.
 */
export declare class SEdge extends SRoutableElement implements Fadeable, Selectable, Hoverable, BoundsAware {
    static readonly DEFAULT_FEATURES: symbol[];
    selected: boolean;
    hoverFeedback: boolean;
    opacity: number;
}
/**
 * Serializable schema for SLabel.
 */
export interface SLabelSchema extends SShapeElementSchema {
    text: string;
    selected?: boolean;
}
/**
 * A label can be attached to a node, edge, or port, and contains some text to be rendered in its view.
 */
export declare class SLabel extends SShapeElement implements Selectable, Alignable, Fadeable {
    static readonly DEFAULT_FEATURES: symbol[];
    text: string;
    selected: boolean;
    alignment: Point;
    opacity: number;
    edgePlacement?: EdgePlacement;
}
/**
 * Serializable schema for SCompartment.
 */
export interface SCompartmentSchema extends SShapeElementSchema {
    layout?: string;
}
/**
 * A compartment is used to group multiple child elements such as labels of a node. Usually a `vbox`
 * or `hbox` layout is used to arrange these children.
 */
export declare class SCompartment extends SShapeElement implements Fadeable {
    static readonly DEFAULT_FEATURES: symbol[];
    children: SChildElement[];
    layout?: string;
    layoutOptions?: {
        [key: string]: string | number | boolean;
    };
    opacity: number;
}
/**
 * A specialized model index that tracks outgoing and incoming edges.
 */
export declare class SGraphIndex extends SModelIndex<SModelElement> {
    private outgoing;
    private incoming;
    add(element: SModelElement): void;
    remove(element: SModelElement): void;
    getAttachedElements(element: SModelElement): FluentIterable<SModelElement>;
    getIncomingEdges(element: SConnectableElement): FluentIterable<SEdge>;
    getOutgoingEdges(element: SConnectableElement): FluentIterable<SEdge>;
}
//# sourceMappingURL=sgraph.d.ts.map