import { inject, injectable } from "inversify";
import { Avoid as AvoidInterface, AvoidLib } from "libavoid-js";
import {
  SRoutableElement,
  SRoutingHandle,
  RoutedPoint,
  ResolvedHandleMove,
  Point,
  EdgeRouting,
  AbstractEdgeRouter,
  LinearRouteOptions,
  centerOfLine,
  euclideanDistance,
  IMultipleEdgesRouter,
  isBoundsAware,
  SChildElement,
  SConnectableElement,
  SParentElement,
  AnchorComputerRegistry,
} from "sprotty";

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

@injectable()
export class LibavoidRouter
  extends AbstractEdgeRouter
  implements IMultipleEdgesRouter
{
  @inject(AnchorComputerRegistry) anchorRegistry: AnchorComputerRegistry;

  avoidRouter: AvoidInterface["Router"];
  avoidRoutes: AvoidRoutes;
  renderedTimes = 0;
  static readonly KIND = "libavoid";

  constructor() {
    super();
    const Avoid: AvoidInterface =
      AvoidLib.getInstance() as unknown as AvoidInterface;
    this.avoidRouter = new Avoid.Router(
      Avoid.OrthogonalRouting | Avoid.PolyLineRouting
    );
    this.avoidRoutes = {};
    console.log("router", this.avoidRouter);
  }

  get kind() {
    return LibavoidRouter.KIND;
  }

  getAllBoundsAwareChildren(parent: Readonly<SParentElement>): SChildElement[] {
    const result = [];

    for (const child of parent.children) {
      if (isBoundsAware(child)) {
        result.push(child);
      }

      if (child instanceof SParentElement) {
        result.push(...this.getAllBoundsAwareChildren(child));
      }
    }

    return result;
  }

  getCenterPoint(element: SConnectableElement): { x: number; y: number } {
    let x = element.bounds.width / 2,
      y = element.bounds.height / 2;
    let currentElement = element;
    while (currentElement) {
      if (currentElement.position) {
        x += currentElement.position.x;
        y += currentElement.position.y;
      }

      if (!(currentElement.parent && currentElement.parent.id === "graph")) {
        currentElement = currentElement.parent as SConnectableElement;
      } else {
        break;
      }
    }
    return { x, y };
  }

  avoidRoutesToEdgeRoutes(avoidRoutes: AvoidRouteEdge[]): EdgeRouting {
    const routes = new EdgeRouting();
    for (const connection of avoidRoutes) {
      const sprottyRoute = [];
      const route = connection.connRef.displayRoute();
      for (let i = 0; i < route.size(); i++) {
        let kind: "source" | "linear" | "target" = "linear";
        if (i === 0) {
          kind = "source";
        } else if (i === route.size() - 1) {
          kind = "target";
        }
        sprottyRoute.push({
          x: route.get_ps(i).x,
          y: route.get_ps(i).y,
          kind,
          pointIndex: 1,
        });
      }
      routes.set(connection.child.id, sprottyRoute);
      this.avoidRoutes[connection.child.id] = {
        ...this.avoidRoutes[connection.child.id],
        routes: sprottyRoute,
      };
    }

    return routes;
  }

  routeAll(edges: SRoutableElement[], parent: SParentElement): EdgeRouting {
    // TODO: avoid recalculating of the same elements
    const connections = [];
    const Avoid: AvoidInterface =
      AvoidLib.getInstance() as unknown as AvoidInterface;

    this.avoidRouter = new Avoid.Router(
      Avoid.OrthogonalRouting | Avoid.PolyLineRouting
    );

    for (const child of edges) {
      const sourceConnectionEnd = this.getCenterPoint(
        child.source as SConnectableElement
      );
      const targetConnectionEnd = this.getCenterPoint(
        child.target as SConnectableElement
      );
      const connRef = new Avoid.ConnRef(
        this.avoidRouter,
        new Avoid.ConnEnd(
          new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)
        ),
        new Avoid.ConnEnd(
          new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)
        )
      );

      let routingType = Avoid.PolyLineRouting;
      if (child.routerKind === "manhattan") {
        routingType = Avoid.OrthogonalRouting;
      }
      connRef.setRoutingType(routingType);
      connections.push({ child, connRef, routes: [] });
      this.avoidRoutes[child.id] = { connRef, child, routes: [] };
    }

    const connectables = this.getAllBoundsAwareChildren(parent);
    console.log("connectables count: ", connectables.length);
    for (const child of connectables as SConnectableElement[]) {
      const centerPoint = this.getCenterPoint(child);
      const rectangle = new Avoid.Rectangle(
        new Avoid.Point(centerPoint.x, centerPoint.y),
        child.bounds.width,
        child.bounds.height
      );
      new Avoid.ShapeRef(this.avoidRouter, rectangle);
    }

    this.avoidRouter.processTransaction();
    const edgeRoutes = this.avoidRoutesToEdgeRoutes(connections);

    for (const connection of connections) {
      this.avoidRouter.deleteConnector(connection.connRef);
    }
    Avoid.destroy(this.avoidRouter);
    this.renderedTimes += 1;
    console.log(connections);
    return edgeRoutes;
  }

  route(
    edge: Readonly<SRoutableElement>,
    args?: Record<string, unknown>
  ): RoutedPoint[] {
    console.log("get", edge, args, this.avoidRoutes);
    return this.routeAll([edge], edge).get(edge.id) || [];
  }

  protected calculateSegment(
    edge: SRoutableElement,
    t: number
  ): { segmentStart: Point; segmentEnd: Point; lambda: number } | undefined {
    if (t < 0 || t > 1) return undefined;
    const routedPoints = this.avoidRoutes[edge.id].routes;
    console.log("points", routedPoints.length);
    if (routedPoints.length < 2) return undefined;
    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < routedPoints.length - 1; ++i) {
      segmentLengths[i] = euclideanDistance(
        routedPoints[i],
        routedPoints[i + 1]
      );
      totalLength += segmentLengths[i];
    }
    let currentLenght = 0;
    const tAsLenght = t * totalLength;
    for (let i = 0; i < routedPoints.length - 1; ++i) {
      const newLength = currentLenght + segmentLengths[i];
      // avoid division by (almost) zero
      if (segmentLengths[i] > 1e-8) {
        if (newLength >= tAsLenght) {
          const lambda =
            Math.max(0, tAsLenght - currentLenght) / segmentLengths[i];
          return {
            segmentStart: routedPoints[i],
            segmentEnd: routedPoints[i + 1],
            lambda,
          };
        }
      }
      currentLenght = newLength;
    }
    return {
      segmentEnd: routedPoints.pop() as Point,
      segmentStart: routedPoints.pop() as Point,
      lambda: 1,
    };
  }

  createRoutingHandles(edge: SRoutableElement): void {
    const rpCount = edge.routingPoints.length;
    this.addHandle(edge, "source", "routing-point", -2);
    this.addHandle(edge, "line", "volatile-routing-point", -1);
    for (let i = 0; i < rpCount; i++) {
      this.addHandle(edge, "junction", "routing-point", i);
      this.addHandle(edge, "line", "volatile-routing-point", i);
    }
    this.addHandle(edge, "target", "routing-point", rpCount);
  }

  applyInnerHandleMoves(edge: SRoutableElement, moves: ResolvedHandleMove[]) {
    moves.forEach((move) => {
      const handle = move.handle;
      const points = edge.routingPoints;
      let index = handle.pointIndex;
      if (handle.kind === "line") {
        // Upgrade to a proper routing point
        handle.kind = "junction";
        handle.type = "routing-point";
        points.splice(
          index + 1,
          0,
          move.fromPosition || points[Math.max(index, 0)]
        );
        edge.children.forEach((child) => {
          if (
            child instanceof SRoutingHandle &&
            (child === handle || child.pointIndex > index)
          )
            child.pointIndex++;
        });
        this.addHandle(edge, "line", "volatile-routing-point", index);
        this.addHandle(edge, "line", "volatile-routing-point", index + 1);
        index++;
      }
      if (index >= 0 && index < points.length) {
        points[index] = move.toPosition;
      }
    });
  }

  getInnerHandlePosition(
    edge: SRoutableElement,
    route: RoutedPoint[],
    handle: SRoutingHandle
  ) {
    if (handle.kind === "line") {
      const { start, end } = this.findRouteSegment(
        edge,
        route,
        handle.pointIndex
      );
      if (start !== undefined && end !== undefined)
        return centerOfLine(start, end);
    }
    return undefined;
  }

  protected getOptions(edge: SRoutableElement): LibavoidRouteOptions {
    return {
      minimalPointDistance: 2,
      removeAngleThreshold: 0.1,
      standardDistance: 20,
      selfEdgeOffset: 0.25,
    };
  }
}
