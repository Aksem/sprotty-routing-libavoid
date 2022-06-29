import { Avoid as AvoidInterface } from "libavoid-js";
import { SRoutableElement, SRoutingHandle, RoutedPoint, ResolvedHandleMove, EdgeRouting, AbstractEdgeRouter, LinearRouteOptions, IMultipleEdgesRouter, SChildElement, SConnectableElement, SParentElement, SEdge } from "sprotty";
import { Point, Bounds } from "sprotty-protocol";
export declare type AvoidConnRefsByEdgeId = {
    [key: string]: AvoidInterface["ConnRef"];
};
declare type AvoidShapes = {
    [key: string]: {
        ref: AvoidInterface["ShapeRef"];
        bounds: Bounds;
    };
};
export interface EdgeRoutesContainer {
    edgeRoutes: EdgeRouting;
}
export declare function containsEdgeRoutes(args?: Record<string, unknown>): args is Record<string, unknown> & EdgeRoutesContainer;
export declare enum RouteType {
    PolyLine = 1,
    Orthogonal = 2
}
export declare enum Directions {
    None = 0,
    Up = 1,
    Down = 2,
    Left = 4,
    Right = 8,
    All = 15
}
export interface LibavoidRouterOptions {
    routingType?: RouteType;
    segmentPenalty?: number;
    anglePenalty?: number;
    crossingPenalty?: number;
    clusterCrossingPenalty?: number;
    fixedSharedPathPenalty?: number;
    portDirectionPenalty?: number;
    shapeBufferDistance?: number;
    idealNudgingDistance?: number;
    reverseDirectionPenalty?: number;
    nudgeOrthogonalSegmentsConnectedToShapes?: boolean;
    improveHyperedgeRoutesMovingJunctions?: boolean;
    penaliseOrthogonalSharedPathsAtConnEnds?: boolean;
    nudgeOrthogonalTouchingColinearSegments?: boolean;
    performUnifyingNudgingPreprocessingStep?: boolean;
    improveHyperedgeRoutesMovingAddingAndDeletingJunctions?: boolean;
    nudgeSharedPathsWithCommonEndPoint?: boolean;
}
export interface LibavoidRouteOptions {
    routeType?: RouteType;
    sourceVisibleDirections?: Directions;
    targetVisibleDirections?: Directions;
    hateCrossings?: boolean;
}
export declare class LibavoidEdge extends SEdge implements LibavoidRouteOptions {
    readonly routerKind = "libavoid";
    routeType: number;
    sourceVisibleDirections: undefined;
    targetVisibleDirections: undefined;
    hateCrossings: boolean;
}
export declare class LibavoidRouter extends AbstractEdgeRouter implements IMultipleEdgesRouter {
    avoidRouter: AvoidInterface["Router"];
    avoidConnRefsByEdgeId: AvoidConnRefsByEdgeId;
    avoidShapes: AvoidShapes;
    options: LibavoidRouterOptions;
    renderedTimes: number;
    firstRender: boolean;
    edgeRouting: EdgeRouting;
    changedEdgeIds: string[];
    static readonly KIND = "libavoid";
    constructor();
    get kind(): string;
    setOptions(options: LibavoidRouterOptions): void;
    getAllBoundsAwareChildren(parent: Readonly<SParentElement>): SChildElement[];
    getCenterPoint(element: SConnectableElement): {
        x: number;
        y: number;
    };
    getFixedTranslatedAnchor(connectable: SConnectableElement, sourcePoint: Point, refPoint: Point, refContainer: SParentElement, edge: SRoutableElement, anchorCorrection?: number): Point;
    updateConnRefInEdgeRouting(connRef: AvoidInterface["ConnRef"], edge: LibavoidEdge): void;
    routeAll(edges: LibavoidEdge[], parent: SParentElement): EdgeRouting;
    destroy(): void;
    route(edge: Readonly<LibavoidEdge>, args?: Record<string, unknown>): RoutedPoint[];
    createRoutingHandles(edge: SRoutableElement): void;
    applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    getInnerHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    protected getOptions(edge: LibavoidEdge): LinearRouteOptions;
}
export {};
//# sourceMappingURL=libavoid-router.d.ts.map