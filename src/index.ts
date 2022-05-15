import { AvoidLib } from "libavoid-js";
import {
  LibavoidRouter,
  LibavoidRouterOptions,
  LibavoidRouteOptions,
  LibavoidEdge,
  RouteType,
  Directions,
} from "./libavoid-router";
import { LibavoidEllipseAnchor, LibavoidDiamondAnchor, LibavoidRectangleAnchor } from "./libavoid-router-anchors";

export async function load() {
  await AvoidLib.load();
}

export {
  LibavoidRouter,
  LibavoidRouterOptions,
  LibavoidRouteOptions,
  LibavoidEdge,
  RouteType,
  Directions,
  LibavoidEllipseAnchor,
  LibavoidDiamondAnchor,
  LibavoidRectangleAnchor
};
