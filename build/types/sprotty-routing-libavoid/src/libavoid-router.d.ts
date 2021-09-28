import { Avoid as AvoidInterface } from "../../Hnatiuj.Adaptagrams/";
import { SRoutableElement, SRoutingHandle, RoutedPoint, ResolvedHandleMove, Point, EdgeRouting, LinearEdgeRouter, LinearRouteOptions, DefaultAnchors, ManhattanRouterOptions, RoutingHandleKind, Side } from "../../sprotty";
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
export declare class LibavoidRouter extends LinearEdgeRouter {
    static readonly KIND = "libavoid";
    get kind(): string;
    protected getOptions(edge: SRoutableElement): ManhattanRouterOptions;
    route(edge: SRoutableElement): RoutedPoint[];
    protected createRoutedCorners(edge: SRoutableElement): RoutedPoint[];
    createRoutingHandles(edge: SRoutableElement): void;
    protected getInnerHandlePosition(edge: SRoutableElement, route: RoutedPoint[], handle: SRoutingHandle): Point | undefined;
    protected getFraction(kind: RoutingHandleKind): number | undefined;
    protected commitRoute(edge: SRoutableElement, routedPoints: RoutedPoint[]): void;
    protected applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void;
    protected correctX(routingPoints: Point[], index: number, x: number, minimalPointDistance: number): number;
    protected alignX(routingPoints: Point[], index: number, x: number): void;
    protected correctY(routingPoints: Point[], index: number, y: number, minimalPointDistance: number): number;
    protected alignY(routingPoints: Point[], index: number, y: number): void;
    cleanupRoutingPoints(edge: SRoutableElement, routingPoints: Point[], updateHandles: boolean, addRoutingPoints: boolean): void;
    protected removeHandle(edge: SRoutableElement, pointIndex: number): void;
    protected addAdditionalCorner(edge: SRoutableElement, routingPoints: Point[], currentAnchors: DefaultAnchors, otherAnchors: DefaultAnchors, updateHandles: boolean): void;
    /**
     * Add artificial routing points to keep all angles rectilinear.
     *
     * This makes edge morphing look a lot smoother, where RP positions are interpolated
     * linearly probably resulting in non-rectilinear angles. We don't add handles for
     * these additional RPs.
     */
    protected manhattanify(edge: SRoutableElement, routingPoints: Point[]): void;
    protected calculateDefaultCorners(edge: SRoutableElement, sourceAnchors: DefaultAnchors, targetAnchors: DefaultAnchors, options: ManhattanRouterOptions): Point[];
    protected getBestConnectionAnchors(edge: SRoutableElement, sourceAnchors: DefaultAnchors, targetAnchors: DefaultAnchors, options: ManhattanRouterOptions): {
        source: Side;
        target: Side;
    };
}
//# sourceMappingURL=libavoid-router.d.ts.map