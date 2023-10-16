import { SEdge } from 'sprotty';
import { Directions, RouteType, libavoidRouterKind } from './libavoid-router-options';

export interface LibavoidRouteOptions {
  // default: routing type of router (polyline if unchanged)
  routeType?: RouteType;
  // default: all
  sourceVisibleDirections?: Directions;
  // default: all
  targetVisibleDirections?: Directions;
  // default: false
  hateCrossings?: boolean;
}

export class LibavoidEdge extends SEdge implements LibavoidRouteOptions {
  override routerKind: string = libavoidRouterKind;
  routeType = 0;
  sourceVisibleDirections = undefined;
  targetVisibleDirections = undefined;
  hateCrossings = false;
}
