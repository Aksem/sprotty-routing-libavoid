import { SEdge } from 'sprotty';
import { Directions, RouteType } from './libavoid-router-options';
export interface LibavoidRouteOptions {
    routeType?: RouteType;
    sourceVisibleDirections?: Directions;
    targetVisibleDirections?: Directions;
    hateCrossings?: boolean;
}
export declare class LibavoidEdge extends SEdge implements LibavoidRouteOptions {
    routerKind: string;
    routeType: number;
    sourceVisibleDirections: undefined;
    targetVisibleDirections: undefined;
    hateCrossings: boolean;
}
//# sourceMappingURL=libavoid-edge.d.ts.map