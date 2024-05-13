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
    minimalSegmentLengthForChildPosition?: number;
}
export declare const libavoidRouterKind = "libavoid";
//# sourceMappingURL=libavoid-router-options.d.ts.map