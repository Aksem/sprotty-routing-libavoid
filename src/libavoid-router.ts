// import { injectable } from "../../sprotty/node_modules/inversify";
import { Avoid as AvoidInterface } from "../../Hnatiuj.Adaptagrams/"; // AvoidLib
import {
  // IMultipleEdgesRouter,
  SRoutableElement,
  SRoutingHandle,
  RoutedPoint,
  ResolvedHandleMove,
  // EdgeSnapshot,
  Point,
  // SConnectableElement,
  EdgeRouting,
  // isBoundsAware,
  // SParentElement,
  // SChildElement,
  // euclideanDistance,
  // linear,
  // centerOfLine,
  LinearEdgeRouter,
  LinearRouteOptions,
  almostEquals,
  center,
  DefaultAnchors,
  includes,
  linear,
  manhattanDistance,
  ManhattanRouterOptions,
  RoutingHandleKind,
  Side,
  translatePoint,
} from "../../sprotty";

export type AvoidRouteEdge = {
  child: SRoutableElement;
  connRef: AvoidInterface["ConnRef"];
  routes: RoutedPoint[];
};
export type AvoidRoutes = { [key: string]: AvoidRouteEdge };
export interface EdgeRoutesContainer {
  edgeRoutes: EdgeRouting;
}

export function containsEdgeRoutes(
  args?: Record<string, unknown>
): args is Record<string, unknown> & EdgeRoutesContainer {
  return args !== undefined && "edgeRoutes" in args;
}

export interface LibavoidRouteOptions extends LinearRouteOptions {
  /** The angle in radians below which a routing handle is removed. */
  // TODO
  removeAngleThreshold: number;
}

// @injectable()
// export class LibavoidRouter
//   extends LinearEdgeRouter
//   implements IMultipleEdgesRouter
// {
//   avoidRouter: AvoidInterface["Router"];
//   avoidRoutes: AvoidRoutes;
//   renderedTimes = 0;
//   static readonly KIND = "libavoid";

//   constructor() {
//     super();
//     const Avoid: AvoidInterface =
//       AvoidLib.getInstance() as unknown as AvoidInterface;
//     this.avoidRouter = new Avoid.Router(
//       Avoid.OrthogonalRouting | Avoid.PolyLineRouting
//     );
//     this.avoidRoutes = {};
//     console.log("router", this.avoidRouter);
//   }

//   get kind() {
//     return LibavoidRouter.KIND;
//   }

//   getAllBoundsAwareChildren(parent: Readonly<SParentElement>): SChildElement[] {
//     const result = [];

//     for (const child of parent.children) {
//       if (isBoundsAware(child)) {
//         result.push(child);
//       }

//       if (child instanceof SParentElement) {
//         result.push(...this.getAllBoundsAwareChildren(child));
//       }
//     }

//     return result;
//   }

//   getCenterPoint(element: SConnectableElement): { x: number; y: number } {
//     let x = element.bounds.width / 2,
//       y = element.bounds.height / 2;
//     let currentElement = element;
//     while (currentElement) {
//       if (currentElement.position) {
//         x += currentElement.position.x;
//         y += currentElement.position.y;
//       }

//       if (!(currentElement.parent && currentElement.parent.id === "graph")) {
//         currentElement = currentElement.parent as SConnectableElement;
//       } else {
//         break;
//       }
//     }
//     return { x, y };
//   }

//   avoidRoutesToEdgeRoutes(avoidRoutes: AvoidRouteEdge[]): EdgeRouting {
//     const routes = new EdgeRouting();
//     for (const connection of avoidRoutes) {
//       const sprottyRoute = [];
//       const route = connection.connRef.displayRoute();
//       for (let i = 0; i < route.size(); i++) {
//         let kind: "source" | "linear" | "target" = "linear";
//         if (i === 0) {
//           kind = "source";
//         } else if (i === route.size() - 1) {
//           kind = "target";
//         }
//         sprottyRoute.push({
//           x: route.get_ps(i).x,
//           y: route.get_ps(i).y,
//           kind,
//           pointIndex: 1,
//         });
//       }
//       routes.set(connection.child.id, sprottyRoute);
//       this.avoidRoutes[connection.child.id] = {
//         ...this.avoidRoutes[connection.child.id],
//         routes: sprottyRoute,
//       };
//     }

//     return routes;
//   }

//   routeAll(edges: SRoutableElement[], parent: SParentElement): EdgeRouting {
//     // TODO: avoid recalculating of the same elements
//     const connections = [];
//     const Avoid: AvoidInterface =
//       AvoidLib.getInstance() as unknown as AvoidInterface;

//     this.avoidRouter = new Avoid.Router(
//       Avoid.OrthogonalRouting | Avoid.PolyLineRouting
//     );

//     for (const child of edges) {
//       const sourceConnectionEnd = this.getCenterPoint(
//         child.source as SConnectableElement
//       );
//       const targetConnectionEnd = this.getCenterPoint(
//         child.target as SConnectableElement
//       );
//       const connRef = new Avoid.ConnRef(
//         this.avoidRouter,
//         new Avoid.ConnEnd(
//           new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)
//         ),
//         new Avoid.ConnEnd(
//           new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)
//         )
//       );

//       let routingType = Avoid.PolyLineRouting;
//       if (child.routerKind === "manhattan") {
//         routingType = Avoid.OrthogonalRouting;
//       }
//       connRef.setRoutingType(routingType);
//       connections.push({ child, connRef, routes: [] });
//       this.avoidRoutes[child.id] = { connRef, child, routes: [] };
//     }

//     const connectables = this.getAllBoundsAwareChildren(parent);
//     console.log("connectables count: ", connectables.length);
//     for (const child of connectables as SConnectableElement[]) {
//       const centerPoint = this.getCenterPoint(child);
//       const rectangle = new Avoid.Rectangle(
//         new Avoid.Point(centerPoint.x, centerPoint.y),
//         child.bounds.width,
//         child.bounds.height
//       );
//       new Avoid.ShapeRef(this.avoidRouter, rectangle);
//     }

//     this.avoidRouter.processTransaction();
//     const edgeRoutes = this.avoidRoutesToEdgeRoutes(connections);

//     for (const connection of connections) {
//       this.avoidRouter.deleteConnector(connection.connRef);
//     }
//     Avoid.destroy(this.avoidRouter);
//     this.renderedTimes += 1;
//     console.log(connections);
//     return edgeRoutes;
//   }

//   route(
//     edge: Readonly<SRoutableElement>,
//     args?: Record<string, unknown>
//   ): RoutedPoint[] {
//     console.log("get", edge, args, this.avoidRoutes);
//     return this.routeAll([edge], edge).get(edge.id) || [];
//   }

//   // pointAt(edge: SRoutableElement, t: number): Point | undefined {
//   //   console.log("pointAt", edge, t);

//   //   const segments = this.calculateSegment(edge, t);
//   //   console.log("segments", segments);
//   //   if (!segments) return undefined;
//   //   const { segmentStart, segmentEnd, lambda } = segments;
//   //   return linear(segmentStart, segmentEnd, lambda);
//   // }

//   protected calculateSegment(
//     edge: SRoutableElement,
//     t: number
//   ): { segmentStart: Point; segmentEnd: Point; lambda: number } | undefined {
//     if (t < 0 || t > 1) return undefined;
//     const routedPoints = this.avoidRoutes[edge.id].routes;
//     console.log("points", routedPoints.length);
//     if (routedPoints.length < 2) return undefined;
//     const segmentLengths: number[] = [];
//     let totalLength = 0;
//     for (let i = 0; i < routedPoints.length - 1; ++i) {
//       segmentLengths[i] = euclideanDistance(
//         routedPoints[i],
//         routedPoints[i + 1]
//       );
//       totalLength += segmentLengths[i];
//     }
//     let currentLenght = 0;
//     const tAsLenght = t * totalLength;
//     for (let i = 0; i < routedPoints.length - 1; ++i) {
//       const newLength = currentLenght + segmentLengths[i];
//       // avoid division by (almost) zero
//       if (segmentLengths[i] > 1e-8) {
//         if (newLength >= tAsLenght) {
//           const lambda =
//             Math.max(0, tAsLenght - currentLenght) / segmentLengths[i];
//           return {
//             segmentStart: routedPoints[i],
//             segmentEnd: routedPoints[i + 1],
//             lambda,
//           };
//         }
//       }
//       currentLenght = newLength;
//     }
//     return {
//       segmentEnd: routedPoints.pop() as Point,
//       segmentStart: routedPoints.pop() as Point,
//       lambda: 1,
//     };
//   }

//   createRoutingHandles(edge: SRoutableElement): void {
//     const rpCount = edge.routingPoints.length;
//     this.addHandle(edge, "source", "routing-point", -2);
//     this.addHandle(edge, "line", "volatile-routing-point", -1);
//     for (let i = 0; i < rpCount; i++) {
//       this.addHandle(edge, "junction", "routing-point", i);
//       this.addHandle(edge, "line", "volatile-routing-point", i);
//     }
//     this.addHandle(edge, "target", "routing-point", rpCount);
//   }

//   applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]) {
//     moves.forEach((move) => {
//       const handle = move.handle;
//       const points = edge.routingPoints;
//       let index = handle.pointIndex;
//       if (handle.kind === "line") {
//         // Upgrade to a proper routing point
//         handle.kind = "junction";
//         handle.type = "routing-point";
//         points.splice(
//           index + 1,
//           0,
//           move.fromPosition || points[Math.max(index, 0)]
//         );
//         edge.children.forEach((child) => {
//           if (
//             child instanceof SRoutingHandle &&
//             (child === handle || child.pointIndex > index)
//           )
//             child.pointIndex++;
//         });
//         this.addHandle(edge, "line", "volatile-routing-point", index);
//         this.addHandle(edge, "line", "volatile-routing-point", index + 1);
//         index++;
//       }
//       if (index >= 0 && index < points.length) {
//         points[index] = move.toPosition;
//       }
//     });
//   }

//   getInnerHandlePosition(
//     edge: SRoutableElement,
//     route: RoutedPoint[],
//     handle: SRoutingHandle
//   ) {
//     if (handle.kind === "line") {
//       const { start, end } = this.findRouteSegment(
//         edge,
//         route,
//         handle.pointIndex
//       );
//       if (start !== undefined && end !== undefined)
//         return centerOfLine(start, end);
//     }
//     return undefined;
//   }

//   protected getOptions(edge: SRoutableElement): LibavoidRouteOptions {
//     return {
//       minimalPointDistance: 2,
//       removeAngleThreshold: 0.1,
//       standardDistance: 20,
//       selfEdgeOffset: 0.25,
//     };
//   }

//   // derivativeAt(edge: SRoutableElement, t: number): Point | undefined {
//   //   console.log("derivativeAt", edge, t);
//   //   const segments = this.calculateSegment(edge, t);
//   //   if (!segments) return undefined;
//   //   const { segmentStart, segmentEnd } = segments;
//   //   return {
//   //     x: segmentEnd.x - segmentStart.x,
//   //     y: segmentEnd.y - segmentStart.y,
//   //   };
//   // }

//   // getHandlePosition(
//   //   edge: SRoutableElement,
//   //   route: RoutedPoint[],
//   //   handle: SRoutingHandle
//   // ): Point | undefined {
//   //   return undefined; // TODO
//   // }

//   // createRoutingHandles(edge: SRoutableElement) {}

//   // applyHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]): void {}

//   // applyReconnect(
//   //   edge: SRoutableElement,
//   //   newSourceId?: string,
//   //   newTargetId?: string
//   // ) {}

//   // cleanupRoutingPoints(
//   //   edge: SRoutableElement,
//   //   routingPoints: Point[],
//   //   updateHandles: boolean,
//   //   addRoutingPoints: boolean
//   // ) {}

//   // takeSnapshot(edge: SRoutableElement): EdgeSnapshot {
//   //   return {
//   //     routingPoints: edge.routingPoints.slice(),
//   //     routingHandles: edge.children
//   //       .filter((child) => child instanceof SRoutingHandle)
//   //       .map((child) => child as SRoutingHandle),
//   //     routedPoints: this.route(edge),
//   //     router: this,
//   //     source: edge.source,
//   //     target: edge.target,
//   //   };
//   // }

//   // applySnapshot(edge: SRoutableElement, snapshot: EdgeSnapshot): void {}
// }

export class LibavoidRouter extends LinearEdgeRouter {
  static readonly KIND = "libavoid";

  get kind() {
    return LibavoidRouter.KIND;
  }

  protected getOptions(edge: SRoutableElement): ManhattanRouterOptions {
    return {
      standardDistance: 20,
      minimalPointDistance: 3,
      selfEdgeOffset: 0.25,
    };
  }

  route(edge: SRoutableElement): RoutedPoint[] {
    if (!edge.source || !edge.target) return [];
    const routedCorners = this.createRoutedCorners(edge);
    const sourceRefPoint =
      routedCorners[0] ||
      translatePoint(
        center(edge.target.bounds),
        edge.target.parent,
        edge.parent
      );
    const sourceAnchor = this.getTranslatedAnchor(
      edge.source,
      sourceRefPoint,
      edge.parent,
      edge,
      edge.sourceAnchorCorrection
    );
    const targetRefPoint =
      routedCorners[routedCorners.length - 1] ||
      translatePoint(
        center(edge.source.bounds),
        edge.source.parent,
        edge.parent
      );
    const targetAnchor = this.getTranslatedAnchor(
      edge.target,
      targetRefPoint,
      edge.parent,
      edge,
      edge.targetAnchorCorrection
    );
    if (!sourceAnchor || !targetAnchor) return [];
    const routedPoints: RoutedPoint[] = [];
    routedPoints.push({ kind: "source", ...sourceAnchor });
    routedCorners.forEach((corner) => routedPoints.push(corner));
    routedPoints.push({ kind: "target", ...targetAnchor });
    return routedPoints;
  }

  protected createRoutedCorners(edge: SRoutableElement): RoutedPoint[] {
    const sourceAnchors = new DefaultAnchors(
      edge.source!,
      edge.parent,
      "source"
    );
    const targetAnchors = new DefaultAnchors(
      edge.target!,
      edge.parent,
      "target"
    );
    if (edge.routingPoints.length > 0) {
      const routingPointsCopy = edge.routingPoints.slice();
      this.cleanupRoutingPoints(edge, routingPointsCopy, false, true);
      if (routingPointsCopy.length > 0)
        return routingPointsCopy.map((routingPoint, index) => {
          return <RoutedPoint>{
            kind: "linear",
            pointIndex: index,
            ...routingPoint,
          };
        });
    }
    const options = this.getOptions(edge);
    const corners = this.calculateDefaultCorners(
      edge,
      sourceAnchors,
      targetAnchors,
      options
    );
    return corners.map((corner) => {
      return <RoutedPoint>{ kind: "linear", ...corner };
    });
  }

  createRoutingHandles(edge: SRoutableElement) {
    const routedPoints = this.route(edge);
    this.commitRoute(edge, routedPoints);
    if (routedPoints.length > 0) {
      this.addHandle(edge, "source", "routing-point", -2);
      for (let i = 0; i < routedPoints.length - 1; ++i)
        this.addHandle(edge, "manhattan-50%", "volatile-routing-point", i - 1);
      this.addHandle(edge, "target", "routing-point", routedPoints.length - 2);
    }
  }

  protected getInnerHandlePosition(
    edge: SRoutableElement,
    route: RoutedPoint[],
    handle: SRoutingHandle
  ) {
    const fraction = this.getFraction(handle.kind);
    if (fraction !== undefined) {
      const { start, end } = this.findRouteSegment(
        edge,
        route,
        handle.pointIndex
      );
      if (start !== undefined && end !== undefined)
        return linear(start, end, fraction);
    }
    return undefined;
  }

  protected getFraction(kind: RoutingHandleKind): number | undefined {
    switch (kind) {
      case "manhattan-50%":
        return 0.5;
      default:
        return undefined;
    }
  }

  protected commitRoute(edge: SRoutableElement, routedPoints: RoutedPoint[]) {
    const newRoutingPoints: Point[] = [];
    for (let i = 1; i < routedPoints.length - 1; ++i)
      newRoutingPoints.push({ x: routedPoints[i].x, y: routedPoints[i].y });
    edge.routingPoints = newRoutingPoints;
  }

  protected applyInnerHandleMoves(
    edge: SRoutableElement,
    moves: ResolvedHandleMove[]
  ) {
    const route = this.route(edge);
    const routingPoints = edge.routingPoints;
    const minimalPointDistance = this.getOptions(edge).minimalPointDistance;
    moves.forEach((move) => {
      const handle = move.handle;
      const index = handle.pointIndex;
      const correctedX = this.correctX(
        routingPoints,
        index,
        move.toPosition.x,
        minimalPointDistance
      );
      const correctedY = this.correctY(
        routingPoints,
        index,
        move.toPosition.y,
        minimalPointDistance
      );
      switch (handle.kind) {
        case "manhattan-50%":
          if (index < 0) {
            if (almostEquals(route[0].x, route[1].x))
              this.alignX(routingPoints, 0, correctedX);
            else this.alignY(routingPoints, 0, correctedY);
          } else if (index < routingPoints.length - 1) {
            if (
              almostEquals(routingPoints[index].x, routingPoints[index + 1].x)
            ) {
              this.alignX(routingPoints, index, correctedX);
              this.alignX(routingPoints, index + 1, correctedX);
            } else {
              this.alignY(routingPoints, index, correctedY);
              this.alignY(routingPoints, index + 1, correctedY);
            }
          } else {
            if (
              almostEquals(route[route.length - 2].x, route[route.length - 1].x)
            )
              this.alignX(routingPoints, routingPoints.length - 1, correctedX);
            else
              this.alignY(routingPoints, routingPoints.length - 1, correctedY);
          }
          break;
      }
    });
  }

  protected correctX(
    routingPoints: Point[],
    index: number,
    x: number,
    minimalPointDistance: number
  ) {
    if (
      index > 0 &&
      Math.abs(x - routingPoints[index - 1].x) < minimalPointDistance
    )
      return routingPoints[index - 1].x;
    else if (
      index < routingPoints.length - 2 &&
      Math.abs(x - routingPoints[index + 2].x) < minimalPointDistance
    )
      return routingPoints[index + 2].x;
    else return x;
  }

  protected alignX(routingPoints: Point[], index: number, x: number) {
    if (index >= 0 && index < routingPoints.length)
      routingPoints[index] = {
        x,
        y: routingPoints[index].y,
      };
  }

  protected correctY(
    routingPoints: Point[],
    index: number,
    y: number,
    minimalPointDistance: number
  ) {
    if (
      index > 0 &&
      Math.abs(y - routingPoints[index - 1].y) < minimalPointDistance
    )
      return routingPoints[index - 1].y;
    else if (
      index < routingPoints.length - 2 &&
      Math.abs(y - routingPoints[index + 2].y) < minimalPointDistance
    )
      return routingPoints[index + 2].y;
    else return y;
  }

  protected alignY(routingPoints: Point[], index: number, y: number) {
    if (index >= 0 && index < routingPoints.length)
      routingPoints[index] = {
        x: routingPoints[index].x,
        y,
      };
  }

  cleanupRoutingPoints(
    edge: SRoutableElement,
    routingPoints: Point[],
    updateHandles: boolean,
    addRoutingPoints: boolean
  ) {
    const sourceAnchors = new DefaultAnchors(
      edge.source!,
      edge.parent,
      "source"
    );
    const targetAnchors = new DefaultAnchors(
      edge.target!,
      edge.parent,
      "target"
    );
    if (
      this.resetRoutingPointsOnReconnect(
        edge,
        routingPoints,
        updateHandles,
        sourceAnchors,
        targetAnchors
      )
    )
      return;
    // delete leading RPs inside the bounds of the source
    for (let i = 0; i < routingPoints.length; ++i)
      if (includes(sourceAnchors.bounds, routingPoints[i])) {
        routingPoints.splice(0, 1);
        if (updateHandles) {
          this.removeHandle(edge, -1);
        }
      } else {
        break;
      }
    // delete trailing RPs inside the bounds of the target
    for (let i = routingPoints.length - 1; i >= 0; --i)
      if (includes(targetAnchors.bounds, routingPoints[i])) {
        routingPoints.splice(i, 1);
        if (updateHandles) {
          this.removeHandle(edge, i);
        }
      } else {
        break;
      }
    if (routingPoints.length >= 2) {
      const options = this.getOptions(edge);
      for (let i = routingPoints.length - 2; i >= 0; --i) {
        if (
          manhattanDistance(routingPoints[i], routingPoints[i + 1]) <
          options.minimalPointDistance
        ) {
          routingPoints.splice(i, 2);
          --i;
          if (updateHandles) {
            this.removeHandle(edge, i - 1);
            this.removeHandle(edge, i);
          }
        }
      }
    }
    if (addRoutingPoints) {
      this.addAdditionalCorner(
        edge,
        routingPoints,
        sourceAnchors,
        targetAnchors,
        updateHandles
      );
      this.addAdditionalCorner(
        edge,
        routingPoints,
        targetAnchors,
        sourceAnchors,
        updateHandles
      );
      this.manhattanify(edge, routingPoints);
    }
  }

  protected removeHandle(edge: SRoutableElement, pointIndex: number) {
    const toBeRemoved: SRoutingHandle[] = [];
    edge.children.forEach((child) => {
      if (child instanceof SRoutingHandle) {
        if (child.pointIndex > pointIndex) --child.pointIndex;
        else if (child.pointIndex === pointIndex) toBeRemoved.push(child);
      }
    });
    toBeRemoved.forEach((child) => edge.remove(child));
  }

  protected addAdditionalCorner(
    edge: SRoutableElement,
    routingPoints: Point[],
    currentAnchors: DefaultAnchors,
    otherAnchors: DefaultAnchors,
    updateHandles: boolean
  ) {
    if (routingPoints.length === 0) return;
    const refPoint =
      currentAnchors.kind === "source"
        ? routingPoints[0]
        : routingPoints[routingPoints.length - 1];
    const index = currentAnchors.kind === "source" ? 0 : routingPoints.length;
    const shiftIndex = index - (currentAnchors.kind === "source" ? 1 : 0);
    let isHorizontal: boolean;
    if (routingPoints.length > 1) {
      isHorizontal =
        index === 0
          ? almostEquals(routingPoints[0].x, routingPoints[1].x)
          : almostEquals(
              routingPoints[routingPoints.length - 1].x,
              routingPoints[routingPoints.length - 2].x
            );
    } else {
      const nearestSide = otherAnchors.getNearestSide(refPoint);
      isHorizontal = nearestSide === Side.TOP || nearestSide === Side.BOTTOM;
    }
    if (isHorizontal) {
      if (
        refPoint.y < currentAnchors.get(Side.TOP).y ||
        refPoint.y > currentAnchors.get(Side.BOTTOM).y
      ) {
        const newPoint = { x: currentAnchors.get(Side.TOP).x, y: refPoint.y };
        routingPoints.splice(index, 0, newPoint);
        if (updateHandles) {
          edge.children.forEach((child) => {
            if (
              child instanceof SRoutingHandle &&
              child.pointIndex >= shiftIndex
            )
              ++child.pointIndex;
          });
          this.addHandle(
            edge,
            "manhattan-50%",
            "volatile-routing-point",
            shiftIndex
          );
        }
      }
    } else {
      if (
        refPoint.x < currentAnchors.get(Side.LEFT).x ||
        refPoint.x > currentAnchors.get(Side.RIGHT).x
      ) {
        const newPoint = { x: refPoint.x, y: currentAnchors.get(Side.LEFT).y };
        routingPoints.splice(index, 0, newPoint);
        if (updateHandles) {
          edge.children.forEach((child) => {
            if (
              child instanceof SRoutingHandle &&
              child.pointIndex >= shiftIndex
            )
              ++child.pointIndex;
          });
          this.addHandle(
            edge,
            "manhattan-50%",
            "volatile-routing-point",
            shiftIndex
          );
        }
      }
    }
  }

  /**
   * Add artificial routing points to keep all angles rectilinear.
   *
   * This makes edge morphing look a lot smoother, where RP positions are interpolated
   * linearly probably resulting in non-rectilinear angles. We don't add handles for
   * these additional RPs.
   */
  protected manhattanify(edge: SRoutableElement, routingPoints: Point[]) {
    for (let i = 1; i < routingPoints.length; ++i) {
      const isVertical =
        Math.abs(routingPoints[i - 1].x - routingPoints[i].x) < 1;
      const isHorizontal =
        Math.abs(routingPoints[i - 1].y - routingPoints[i].y) < 1;
      if (!isVertical && !isHorizontal) {
        routingPoints.splice(i, 0, {
          x: routingPoints[i - 1].x,
          y: routingPoints[i].y,
        });
        ++i;
      }
    }
  }

  protected calculateDefaultCorners(
    edge: SRoutableElement,
    sourceAnchors: DefaultAnchors,
    targetAnchors: DefaultAnchors,
    options: ManhattanRouterOptions
  ): Point[] {
    const selfEdge = super.calculateDefaultCorners(
      edge,
      sourceAnchors,
      targetAnchors,
      options
    );
    if (selfEdge.length > 0) return selfEdge;
    const bestAnchors = this.getBestConnectionAnchors(
      edge,
      sourceAnchors,
      targetAnchors,
      options
    );
    const sourceSide = bestAnchors.source;
    const targetSide = bestAnchors.target;
    const corners: Point[] = [];
    const startPoint = sourceAnchors.get(sourceSide);
    let endPoint = targetAnchors.get(targetSide);
    switch (sourceSide) {
      case Side.RIGHT:
        switch (targetSide) {
          case Side.BOTTOM:
            corners.push({ x: endPoint.x, y: startPoint.y });
            break;
          case Side.TOP:
            corners.push({ x: endPoint.x, y: startPoint.y });
            break;
          case Side.RIGHT:
            corners.push({
              x:
                Math.max(startPoint.x, endPoint.x) +
                1.5 * options.standardDistance,
              y: startPoint.y,
            });
            corners.push({
              x:
                Math.max(startPoint.x, endPoint.x) +
                1.5 * options.standardDistance,
              y: endPoint.y,
            });
            break;
          case Side.LEFT:
            if (endPoint.y !== startPoint.y) {
              corners.push({
                x: (startPoint.x + endPoint.x) / 2,
                y: startPoint.y,
              });
              corners.push({
                x: (startPoint.x + endPoint.x) / 2,
                y: endPoint.y,
              });
            }
            break;
        }
        break;
      case Side.LEFT:
        switch (targetSide) {
          case Side.BOTTOM:
            corners.push({ x: endPoint.x, y: startPoint.y });
            break;
          case Side.TOP:
            corners.push({ x: endPoint.x, y: startPoint.y });
            break;
          default:
            endPoint = targetAnchors.get(Side.RIGHT);
            if (endPoint.y !== startPoint.y) {
              corners.push({
                x: (startPoint.x + endPoint.x) / 2,
                y: startPoint.y,
              });
              corners.push({
                x: (startPoint.x + endPoint.x) / 2,
                y: endPoint.y,
              });
            }
            break;
        }
        break;
      case Side.TOP:
        switch (targetSide) {
          case Side.RIGHT:
            if (endPoint.x - startPoint.x > 0) {
              corners.push({
                x: startPoint.x,
                y: startPoint.y - options.standardDistance,
              });
              corners.push({
                x: endPoint.x + 1.5 * options.standardDistance,
                y: startPoint.y - options.standardDistance,
              });
              corners.push({
                x: endPoint.x + 1.5 * options.standardDistance,
                y: endPoint.y,
              });
            } else {
              corners.push({ x: startPoint.x, y: endPoint.y });
            }
            break;
          case Side.LEFT:
            if (endPoint.x - startPoint.x < 0) {
              corners.push({
                x: startPoint.x,
                y: startPoint.y - options.standardDistance,
              });
              corners.push({
                x: endPoint.x - 1.5 * options.standardDistance,
                y: startPoint.y - options.standardDistance,
              });
              corners.push({
                x: endPoint.x - 1.5 * options.standardDistance,
                y: endPoint.y,
              });
            } else {
              corners.push({ x: startPoint.x, y: endPoint.y });
            }
            break;
          case Side.TOP:
            corners.push({
              x: startPoint.x,
              y:
                Math.min(startPoint.y, endPoint.y) -
                1.5 * options.standardDistance,
            });
            corners.push({
              x: endPoint.x,
              y:
                Math.min(startPoint.y, endPoint.y) -
                1.5 * options.standardDistance,
            });
            break;
          case Side.BOTTOM:
            if (endPoint.x !== startPoint.x) {
              corners.push({
                x: startPoint.x,
                y: (startPoint.y + endPoint.y) / 2,
              });
              corners.push({
                x: endPoint.x,
                y: (startPoint.y + endPoint.y) / 2,
              });
            }
            break;
        }
        break;
      case Side.BOTTOM:
        switch (targetSide) {
          case Side.RIGHT:
            if (endPoint.x - startPoint.x > 0) {
              corners.push({
                x: startPoint.x,
                y: startPoint.y + options.standardDistance,
              });
              corners.push({
                x: endPoint.x + 1.5 * options.standardDistance,
                y: startPoint.y + options.standardDistance,
              });
              corners.push({
                x: endPoint.x + 1.5 * options.standardDistance,
                y: endPoint.y,
              });
            } else {
              corners.push({ x: startPoint.x, y: endPoint.y });
            }
            break;
          case Side.LEFT:
            if (endPoint.x - startPoint.x < 0) {
              corners.push({
                x: startPoint.x,
                y: startPoint.y + options.standardDistance,
              });
              corners.push({
                x: endPoint.x - 1.5 * options.standardDistance,
                y: startPoint.y + options.standardDistance,
              });
              corners.push({
                x: endPoint.x - 1.5 * options.standardDistance,
                y: endPoint.y,
              });
            } else {
              corners.push({ x: startPoint.x, y: endPoint.y });
            }
            break;
          default:
            endPoint = targetAnchors.get(Side.TOP);
            if (endPoint.x !== startPoint.x) {
              corners.push({
                x: startPoint.x,
                y: (startPoint.y + endPoint.y) / 2,
              });
              corners.push({
                x: endPoint.x,
                y: (startPoint.y + endPoint.y) / 2,
              });
            }
            break;
        }
        break;
    }
    return corners;
  }

  protected getBestConnectionAnchors(
    edge: SRoutableElement,
    sourceAnchors: DefaultAnchors,
    targetAnchors: DefaultAnchors,
    options: ManhattanRouterOptions
  ): { source: Side; target: Side } {
    // distance is enough
    let sourcePoint = sourceAnchors.get(Side.RIGHT);
    let targetPoint = targetAnchors.get(Side.LEFT);
    if (targetPoint.x - sourcePoint.x > options.standardDistance)
      return { source: Side.RIGHT, target: Side.LEFT };

    sourcePoint = sourceAnchors.get(Side.LEFT);
    targetPoint = targetAnchors.get(Side.RIGHT);
    if (sourcePoint.x - targetPoint.x > options.standardDistance)
      return { source: Side.LEFT, target: Side.RIGHT };

    sourcePoint = sourceAnchors.get(Side.TOP);
    targetPoint = targetAnchors.get(Side.BOTTOM);
    if (sourcePoint.y - targetPoint.y > options.standardDistance)
      return { source: Side.TOP, target: Side.BOTTOM };

    sourcePoint = sourceAnchors.get(Side.BOTTOM);
    targetPoint = targetAnchors.get(Side.TOP);
    if (targetPoint.y - sourcePoint.y > options.standardDistance)
      return { source: Side.BOTTOM, target: Side.TOP };

    // One additional point
    sourcePoint = sourceAnchors.get(Side.RIGHT);
    targetPoint = targetAnchors.get(Side.TOP);
    if (
      targetPoint.x - sourcePoint.x > 0.5 * options.standardDistance &&
      targetPoint.y - sourcePoint.y > options.standardDistance
    )
      return { source: Side.RIGHT, target: Side.TOP };

    targetPoint = targetAnchors.get(Side.BOTTOM);
    if (
      targetPoint.x - sourcePoint.x > 0.5 * options.standardDistance &&
      sourcePoint.y - targetPoint.y > options.standardDistance
    )
      return { source: Side.RIGHT, target: Side.BOTTOM };

    sourcePoint = sourceAnchors.get(Side.LEFT);
    targetPoint = targetAnchors.get(Side.BOTTOM);
    if (
      sourcePoint.x - targetPoint.x > 0.5 * options.standardDistance &&
      sourcePoint.y - targetPoint.y > options.standardDistance
    )
      return { source: Side.LEFT, target: Side.BOTTOM };

    targetPoint = targetAnchors.get(Side.TOP);
    if (
      sourcePoint.x - targetPoint.x > 0.5 * options.standardDistance &&
      targetPoint.y - sourcePoint.y > options.standardDistance
    )
      return { source: Side.LEFT, target: Side.TOP };

    sourcePoint = sourceAnchors.get(Side.TOP);
    targetPoint = targetAnchors.get(Side.RIGHT);
    if (
      sourcePoint.y - targetPoint.y > 0.5 * options.standardDistance &&
      sourcePoint.x - targetPoint.x > options.standardDistance
    )
      return { source: Side.TOP, target: Side.RIGHT };

    targetPoint = targetAnchors.get(Side.LEFT);
    if (
      sourcePoint.y - targetPoint.y > 0.5 * options.standardDistance &&
      targetPoint.x - sourcePoint.x > options.standardDistance
    )
      return { source: Side.TOP, target: Side.LEFT };

    sourcePoint = sourceAnchors.get(Side.BOTTOM);
    targetPoint = targetAnchors.get(Side.RIGHT);
    if (
      targetPoint.y - sourcePoint.y > 0.5 * options.standardDistance &&
      sourcePoint.x - targetPoint.x > options.standardDistance
    )
      return { source: Side.BOTTOM, target: Side.RIGHT };

    targetPoint = targetAnchors.get(Side.LEFT);
    if (
      targetPoint.y - sourcePoint.y > 0.5 * options.standardDistance &&
      targetPoint.x - sourcePoint.x > options.standardDistance
    )
      return { source: Side.BOTTOM, target: Side.LEFT };

    // Two points
    // priority NN >> EE >> NE >> NW >> SE >> SW
    sourcePoint = sourceAnchors.get(Side.TOP);
    targetPoint = targetAnchors.get(Side.TOP);
    if (
      !includes(targetAnchors.bounds, sourcePoint) &&
      !includes(sourceAnchors.bounds, targetPoint)
    ) {
      if (sourcePoint.y - targetPoint.y < 0) {
        if (
          Math.abs(sourcePoint.x - targetPoint.x) >
          (sourceAnchors.bounds.width + options.standardDistance) / 2
        )
          return { source: Side.TOP, target: Side.TOP };
      } else {
        if (
          Math.abs(sourcePoint.x - targetPoint.x) >
          targetAnchors.bounds.width / 2
        )
          return { source: Side.TOP, target: Side.TOP };
      }
    }

    sourcePoint = sourceAnchors.get(Side.RIGHT);
    targetPoint = targetAnchors.get(Side.RIGHT);
    if (
      !includes(targetAnchors.bounds, sourcePoint) &&
      !includes(sourceAnchors.bounds, targetPoint)
    ) {
      if (sourcePoint.x - targetPoint.x > 0) {
        if (
          Math.abs(sourcePoint.y - targetPoint.y) >
          (sourceAnchors.bounds.height + options.standardDistance) / 2
        )
          return { source: Side.RIGHT, target: Side.RIGHT };
      } else if (
        Math.abs(sourcePoint.y - targetPoint.y) >
        targetAnchors.bounds.height / 2
      )
        return { source: Side.RIGHT, target: Side.RIGHT };
    }

    // Secondly, judge NE NW is available
    sourcePoint = sourceAnchors.get(Side.TOP);
    targetPoint = targetAnchors.get(Side.RIGHT);
    if (
      !includes(targetAnchors.bounds, sourcePoint) &&
      !includes(sourceAnchors.bounds, targetPoint)
    )
      return { source: Side.TOP, target: Side.RIGHT };

    targetPoint = targetAnchors.get(Side.LEFT);
    if (
      !includes(targetAnchors.bounds, sourcePoint) &&
      !includes(sourceAnchors.bounds, targetPoint)
    )
      return { source: Side.TOP, target: Side.LEFT };

    // Finally, judge SE SW is available
    sourcePoint = sourceAnchors.get(Side.BOTTOM);
    targetPoint = targetAnchors.get(Side.RIGHT);
    if (
      !includes(targetAnchors.bounds, sourcePoint) &&
      !includes(sourceAnchors.bounds, targetPoint)
    )
      return { source: Side.BOTTOM, target: Side.RIGHT };

    targetPoint = targetAnchors.get(Side.LEFT);
    if (
      !includes(targetAnchors.bounds, sourcePoint) &&
      !includes(sourceAnchors.bounds, targetPoint)
    )
      return { source: Side.BOTTOM, target: Side.LEFT };

    // Only to return to the
    return { source: Side.RIGHT, target: Side.BOTTOM };
  }
}
