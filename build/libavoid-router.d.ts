import { Avoid as AvoidInterface } from "libavoid-js";
import { SRoutableElement, SRoutingHandle, RoutedPoint, ResolvedHandleMove, Point, EdgeRouting, AbstractEdgeRouter, LinearRouteOptions, IMultipleEdgesRouter, SChildElement, SConnectableElement, SParentElement, AnchorComputerRegistry } from "sprotty";
export declare type AvoidRouteEdge = {
    child: SRoutableElement;
    connRef: AvoidInterface["ConnRef"];
    routes: RoutedPoint[];
};
export declare type AvoidRoutes = {
    [key: string]: AvoidRouteEdge;
};
export interface EdgeRoutesContainer {
    edgeRoutes: EdgeRouting;
}
export declare function containsEdgeRoutes(args?: Record<string, unknown>): args is Record<string, unknown> & EdgeRoutesContainer;
export interface LibavoidRouteOptions extends LinearRouteOptions {
    /** The angle in radians below which a routing handle is removed. */
    removeAngleThreshold: number;
}
export declare class LibavoidRouter extends AbstractEdgeRouter implements IMultipleEdgesRouter {
    anchorRegistry: AnchorComputerRegistry;
    avoidRouter: AvoidInterface["Router"];
    avoidRoutes: AvoidRoutes;
    renderedTimes: number;
    static readonly KIND = "libavoid";
    constructor();
    get kind(): string;
    getAllBoundsAwareChildren(parent: Readonly<SParentElement>): SChildElement[];
    getCenterPoint(element: SConnectableElement): {
        x: number;
        y: number;
    };
    avoidRoutesToEdgeRoutes(avoidRoutes: AvoidRouteEdge[]): EdgeRouting;
    routeAll(edges: SRoutableElement[], parent: SParentElement): EdgeRouting;
    route(edge: Readonly<SRoutableElement>, args?: Record<string, unknown>): RoutedPoint[];
    protected calculateSegment(edge: SRoutableElement, t: number): {
        segmentStart: Point;
        segmentEnd: Point;
        lambda: number;
    } | undefined;
    createRoutingHandles(edge: SRoutableElement): void;
    applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    getInnerHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    protected getOptions(edge: SRoutableElement): LibavoidRouteOptions;
}
//# sourceMappingURL=libavoid-router.d.ts.map