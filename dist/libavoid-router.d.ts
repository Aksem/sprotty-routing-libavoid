import { Avoid as AvoidInterface } from "libavoid-js";
import { SRoutableElementImpl, SRoutingHandleImpl, RoutedPoint, ResolvedHandleMove, EdgeRouting, AbstractEdgeRouter, LinearRouteOptions, IMultipleEdgesRouter, SChildElementImpl, SConnectableElementImpl, SParentElementImpl } from "sprotty";
import { Point } from "sprotty-protocol";
import { LibavoidRouterOptions, RouteType, Directions } from "./libavoid-router-options";
import { LibavoidEdge, LibavoidRouteOptions } from "./libavoid-edge";
import { ShapeInfo } from "./connection-pins-utils";
export { LibavoidRouterOptions, RouteType, Directions, LibavoidEdge, LibavoidRouteOptions };
export type AvoidConnRefsByEdgeId = {
    [key: string]: AvoidInterface["ConnRef"];
};
type AvoidShapes = {
    [key: string]: ShapeInfo;
};
export interface EdgeRoutesContainer {
    edgeRoutes: EdgeRouting;
}
export declare function containsEdgeRoutes(args?: Record<string, unknown>): args is Record<string, unknown> & EdgeRoutesContainer;
export declare class LibavoidRouter extends AbstractEdgeRouter implements IMultipleEdgesRouter {
    avoidRouter: AvoidInterface["Router"];
    avoidConnRefsByEdgeId: AvoidConnRefsByEdgeId;
    avoidShapes: AvoidShapes;
    options: LibavoidRouterOptions;
    renderedTimes: number;
    edgeRouting: EdgeRouting;
    changedEdgeIds: string[];
    static readonly KIND = "libavoid";
    constructor();
    get kind(): string;
    setOptions(options: LibavoidRouterOptions): void;
    getAllBoundsAwareChildren(parent: Readonly<SParentElementImpl>): SChildElementImpl[];
    getFixedTranslatedAnchor(connectable: SConnectableElementImpl, sourcePoint: Point, refPoint: Point, refContainer: SParentElementImpl, edge: SRoutableElementImpl, anchorCorrection?: number): Point;
    updateConnRefInEdgeRouting(connRef: AvoidInterface["ConnRef"], edge: LibavoidEdge): void;
    routeAll(edges: LibavoidEdge[], parent: SParentElementImpl): EdgeRouting;
    private handleModifiedShape;
    private handleNewShape;
    destroy(): void;
    route(edge: Readonly<LibavoidEdge>, args?: Record<string, unknown>): RoutedPoint[];
    createRoutingHandles(edge: SRoutableElementImpl): void;
    applyInnerHandleMoves(edge: SRoutableElementImpl, moves: ResolvedHandleMove[]): void;
    getInnerHandlePosition(edge: SRoutableElementImpl, route: RoutedPoint[], handle: SRoutingHandleImpl): Point | undefined;
    protected getOptions(edge: LibavoidEdge): LinearRouteOptions;
    /**
     * Calculation is similar as in original method, but `minimalSegmentLengthForChildPosition`
     * parameter is introduced(see LibavoidRouterOptions.minimalSegmentLengthForChildPosition for
     * more details) to avoid getting very small segments, that has negative impact for example on
     * placing edge children such as labels.
     */
    protected calculateSegment(edge: LibavoidEdge, t: number): {
        segmentStart: Point;
        segmentEnd: Point;
        lambda: number;
    } | undefined;
}
//# sourceMappingURL=libavoid-router.d.ts.map