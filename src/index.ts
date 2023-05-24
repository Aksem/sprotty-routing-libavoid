import { AvoidLib } from "libavoid-js";
import {
  Directions,
  LibavoidEdge,
  LibavoidRouteOptions,
  LibavoidRouter,
  LibavoidRouterOptions,
  RouteType,
} from "./libavoid-router";
import {
  LibavoidDiamondAnchor,
  LibavoidEllipseAnchor,
  LibavoidRectangleAnchor,
} from "./libavoid-router-anchors";

export async function load(filePath: string | undefined = undefined) {
  await AvoidLib.load(filePath);
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
  LibavoidRectangleAnchor,
};
