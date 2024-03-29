import { Avoid as AvoidInterface, AvoidLib } from "libavoid-js";
import {
  SRoutableElement,
  SRoutingHandle,
  RoutedPoint,
  ResolvedHandleMove,
  EdgeRouting,
  AbstractEdgeRouter,
  LinearRouteOptions,
  IMultipleEdgesRouter,
  isBoundsAware,
  SChildElement,
  SConnectableElement,
  SParentElement,
  SLabel,
  SCompartment,
  SPort,
  SEdge,
  SButton,
} from "sprotty";
import { Point, Bounds, centerOfLine } from "sprotty-protocol";

export type AvoidConnRefsByEdgeId = {
  [key: string]: AvoidInterface["ConnRef"];
};

type AvoidShapes = {
  [key: string]: { ref: AvoidInterface["ShapeRef"]; bounds: Bounds };
};

export interface EdgeRoutesContainer {
  edgeRoutes: EdgeRouting;
}

export function containsEdgeRoutes(
  args?: Record<string, unknown>
): args is Record<string, unknown> & EdgeRoutesContainer {
  return args !== undefined && "edgeRoutes" in args;
}

export enum RouteType {
  PolyLine = 1,
  Orthogonal = 2,
}

// equal to ConnDirFlag in libavoid
export enum Directions {
  None = 0,
  Up = 1,
  Down = 2,
  Left = 4,
  Right = 8,
  All = 15,
}

export interface LibavoidRouterOptions {
  routingType?: RouteType; // default: polyline

  // penalties
  //! @brief  This penalty is applied for each segment in the connector
  //!         path beyond the first.  This should always normally be set
  //!         when doing orthogonal routing to prevent step-like connector
  //!         paths.
  //!
  //! Defaults to 10.
  //!
  //! @note   This penalty must be set (i.e., be greater than zero) in
  //!         order for orthogonal connector nudging to be performed, since
  //!         this requires reasonable initial routes.
  segmentPenalty?: number;

  //! @brief  This penalty is applied in its full amount to tight acute
  //!         bends in the connector path.  A smaller portion of the penalty
  //!         is applied for slight bends, i.e., where the bend is close to
  //!         180 degrees.  This is useful for polyline routing where there
  //!         is some evidence that tighter corners are worse for
  //!         readability, but that slight bends might not be so bad,
  //!         especially when smoothed by curves.
  //!
  //! Defaults to 0.
  //!
  anglePenalty?: number;

  //! @brief  This penalty is applied whenever a connector path crosses
  //!         another connector path.  It takes shared paths into
  //!         consideration and the penalty is only applied if there
  //!         is an actual crossing.
  //!
  //! Defaults to 0.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  crossingPenalty?: number;

  //! @brief  This penalty is applied whenever a connector path crosses
  //!         a cluster boundary.
  //!
  //! Defaults to 4000.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  //! @note   This penalty is very slow.  You can override the method
  //!         Router::shouldContinueTransactionWithProgress() to check
  //!         progress and possibly cancel overly slow transactions.
  clusterCrossingPenalty?: number;

  //! @brief  This penalty is applied whenever a connector path shares
  //!         some segments with an immovable portion of an existing
  //!         connector route (such as the first or last segment of a
  //!         connector).
  //!
  //! Defaults to 0.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  fixedSharedPathPenalty?: number;

  //! @brief  This penalty is applied to port selection choice when the
  //!         other end of the connector being routed does not appear in
  //!         any of the 90 degree visibility cones centered on the
  //!         visibility directions for the port.
  //!
  //! Defaults to 0.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  //! @note   This penalty is very slow.  You can override the method
  //!         Router::shouldContinueTransactionWithProgress() to check
  //!         progress and possibly cancel overly slow transactions.
  portDirectionPenalty?: number;

  //! @brief This parameter defines the spacing distance that will be added
  //!        to the sides of each shape when determining obstacle sizes for
  //!        routing.  This controls how closely connectors pass shapes, and
  //!        can be used to prevent connectors overlapping with shape
  //!        boundaries.
  //!
  //! Defaults to 0.
  //!
  shapeBufferDistance?: number;

  //! @brief This parameter defines the spacing distance that will be used
  //!        for nudging apart overlapping corners and line segments of
  //!        connectors.
  //!
  //! Defaults to 4.
  //!
  idealNudgingDistance?: number;

  //! @brief  This penalty is applied whenever a connector path travels
  //!         in the direction opposite of the destination from the source
  //!         endpoint.  By default this penalty is set to zero.  This
  //!         shouldn't be needed in most cases but can be useful if you
  //!         use penalties such as ::crossingPenalty which cause connectors
  //!         to loop around obstacles.
  //!
  //! Defaults to 0.
  //!
  reverseDirectionPenalty?: number;

  // other options
  //! This option causes the final segments of connectors, which are
  //! attached to shapes, to be nudged apart.  Usually these segments
  //! are fixed, since they are considered to be attached to ports.
  //!
  //! Defaults to false.
  //!
  //! This option also causes routes running through the same checkpoint
  //! to be nudged apart.
  //!
  //! This option has no effect if ::nudgeSharedPathsWithCommonEndPoint is
  //! set to false,
  //!
  //! @note   This will allow routes to be nudged up to the bounds of shapes.
  //!
  nudgeOrthogonalSegmentsConnectedToShapes?: boolean;

  //! This option causes hyperedge routes to be locally improved fixing
  //! obviously bad paths.  As part of this process libavoid will
  //! effectively move junctions, setting new ideal positions which can be
  //! accessed via JunctionRef::recommendedPosition() for each junction.
  //!
  //! Defaults to true.
  //!
  //! This will not add or remove junctions, so will keep the hyperedge
  //! topology the same.  Better routes can be achieved by enabling the
  //! ::improveHyperedgeRoutesMovingAddingAndDeletingJunctions option.
  //!
  //! If initial sensible positions for junctions in hyperedges are not
  //! known you can register those hyperedges with the HyperedgeRerouter
  //! class for complete rerouting.
  //!
  //! @sa   improveHyperedgeRoutesMovingAddingAndDeletingJunctions
  //! @sa   Router::hyperedgeRerouter()
  //!
  improveHyperedgeRoutesMovingJunctions?: boolean;

  //! This option penalises and attempts to reroute orthogonal shared
  //! connector paths terminating at a common junction or shape
  //! connection pin.  When multiple connector paths enter or leave
  //! the same side of a junction (or shape pin), the router will
  //! attempt to reroute these to different sides of the junction or
  //! different shape pins.
  //!
  //! Defaults to false.
  //!
  //! This option depends on the ::fixedSharedPathPenalty penalty having
  //! been set.
  //!
  //! @sa     fixedSharedPathPenalty
  //! @note   This option is still experimental!  It is not recommended
  //!         for normal use.
  //!
  penaliseOrthogonalSharedPathsAtConnEnds?: boolean;

  //! This option can be used to control whether collinear line
  //! segments that touch just at their ends will be nudged apart.
  //! The overlap will usually be resolved in the other dimension,
  //! so this is not usually required.
  //!
  //! Defaults to false.
  //!
  nudgeOrthogonalTouchingColinearSegments?: boolean;

  //! This option can be used to control whether the router performs
  //! a preprocessing step before orthogonal nudging where is tries
  //! to unify segments and centre them in free space.  This
  //! generally results in better quality ordering and nudging.
  //!
  //! Defaults to true.
  //!
  //! You may wish to turn this off for large examples where it
  //! can be very slow and will make little difference.
  //!
  performUnifyingNudgingPreprocessingStep?: boolean;

  //! This option causes hyperedge routes to be locally improved fixing
  //! obviously bad paths.
  //!
  //! It can cause junctions and connectors to be added or removed from
  //! hyperedges.  To get details of these changes for each connector you can
  //! call Router::newAndDeletedObjectListsFromHyperedgeImprovement().
  //!
  //! As part of this process libavoid will effectively move junctions by
  //! setting new ideal positions for each remaining or added junction,
  //! which can be read from JunctionRef::recommendedPosition() for each
  //! junction.
  //!
  //! Defaults to false.
  //!
  //! If set, this option overrides the ::improveHyperedgeRoutesMovingJunctions
  //! option.
  //!
  //! If initial sensible positions for junctions in hyperedges are not
  //! known you can register those hyperedges with the HyperedgeRerouter
  //! class for complete rerouting.
  //!
  //! @sa   improveHyperedgeRoutesMovingJunctions
  //! @sa   Router::hyperedgeRerouter()
  //!
  improveHyperedgeRoutesMovingAddingAndDeletingJunctions?: boolean;

  //! This option determines whether intermediate segments of connectors that
  //! are attached to common endpoints will be nudged apart.  Usually these
  //! segments get nudged apart, but you may want to turn this off if you would
  //! prefer that entire shared paths terminating at a common end point should
  //! overlap.
  //!
  //! Defaults to true.
  //!
  nudgeSharedPathsWithCommonEndPoint?: boolean;

  //! ...
  //!
  //! Defaults to 20.
  //!
  minimalSegmentLengthForChildPosition?: number;
}

// there are two types of configuration parameters in libavoid Router: parameter and option.
// For sprotty router they are unified as 'options', but their type in libavoid should be known
// to set them in router
const routerOptionType: { [key: string]: string } = {
  // routingType is a custom option, not inherited from libavoid
  routingType: "custom",
  segmentPenalty: "parameter",
  anglePenalty: "parameter",
  crossingPenalty: "parameter",
  clusterCrossingPenalty: "parameter",
  fixedSharedPathPenalty: "parameter",
  portDirectionPenalty: "parameter",
  shapeBufferDistance: "parameter",
  idealNudgingDistance: "parameter",
  reverseDirectionPenalty: "parameter",

  nudgeOrthogonalSegmentsConnectedToShapes: "option",
  improveHyperedgeRoutesMovingJunctions: "option",
  penaliseOrthogonalSharedPathsAtConnEnds: "option",
  nudgeOrthogonalTouchingColinearSegments: "option",
  performUnifyingNudgingPreprocessingStep: "option",
  improveHyperedgeRoutesMovingAddingAndDeletingJunctions: "option",
  nudgeSharedPathsWithCommonEndPoint: "option",
};

const sizeIsEqual = (bounds1: Bounds, bounds2: Bounds) => {
  return bounds1.width === bounds2.width && bounds1.height === bounds2.height;
};

const positionIsEqual = (bounds1: Bounds, bounds2: Bounds) => {
  return bounds1.x === bounds2.x && bounds1.y === bounds2.y;
};

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
  override routerKind: string = LibavoidRouter.KIND;
  routeType = 0;
  sourceVisibleDirections = undefined;
  targetVisibleDirections = undefined;
  hateCrossings = false;
}

export class LibavoidRouter
  extends AbstractEdgeRouter
  implements IMultipleEdgesRouter
{
  avoidRouter: AvoidInterface["Router"];
  avoidConnRefsByEdgeId: AvoidConnRefsByEdgeId;
  avoidShapes: AvoidShapes;
  options: LibavoidRouterOptions;
  renderedTimes = 0;
  edgeRouting: EdgeRouting;
  changedEdgeIds: string[];
  static readonly KIND = "libavoid";

  constructor() {
    super();
    this.avoidConnRefsByEdgeId = {};
    this.avoidShapes = {};
    this.options = {};
    this.edgeRouting = new EdgeRouting();
    this.changedEdgeIds = [];

    const Avoid: AvoidInterface =
      AvoidLib.getInstance() as unknown as AvoidInterface;

    this.avoidRouter = new Avoid.Router(Avoid.PolyLineRouting);
  }

  get kind() {
    return LibavoidRouter.KIND;
  }

  setOptions(options: LibavoidRouterOptions) {
    const Avoid: AvoidInterface =
      AvoidLib.getInstance() as unknown as AvoidInterface;
    if ("routingType" in options && options.routingType) {
      // routingType can not be changed for router instance
      // reinstantiate router
      Avoid.destroy(this.avoidRouter);
      this.avoidRouter = new Avoid.Router(options.routingType);
    }
    this.options = {
      ...this.options,
      ...options,
    };

    Object.entries(this.options).forEach(([key, value]) => {
      if (routerOptionType[key] === "parameter") {
        this.avoidRouter.setRoutingParameter(Avoid[key], value);
      } else if (routerOptionType[key] === "option") {
        this.avoidRouter.setRoutingOption(Avoid[key], value);
      }
    });
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

  getFixedTranslatedAnchor(
    connectable: SConnectableElement,
    sourcePoint: Point,
    refPoint: Point,
    refContainer: SParentElement,
    edge: SRoutableElement,
    anchorCorrection = 0
  ): Point {
    let anchor = this.getTranslatedAnchor(
      connectable,
      refPoint,
      refContainer,
      edge,
      anchorCorrection
    );
    // AnchorComputer calculates anchor for edge independent from
    // other edges. If router nudges the edge, it cannot take it into account
    // because only target point is passed, no source point.
    //
    // To fix this, changes in sprotty API are needed.
    // Temporary fix until sprotty API is changed: check whether edge is nudged
    // and fix appropriate coordinate of anchor manually.
    //
    // NOTE: This fix works only for anchor computer that calculates anchor from source
    // node center for orthogonal edge.
    if (sourcePoint.x === refPoint.x) {
      // first edge line is vertical, use x coordinate from router
      anchor = {
        x: sourcePoint.x,
        y: anchor.y,
      };
    } else if (sourcePoint.y === refPoint.y) {
      // first edge line is horizontal, use y coordinate from router
      anchor = {
        x: anchor.x,
        y: sourcePoint.y,
      };
    }

    return anchor;
  }

  updateConnRefInEdgeRouting(
    connRef: AvoidInterface["ConnRef"],
    edge: LibavoidEdge
  ) {
    if (!edge.source || !edge.target) {
      return;
    }

    const sprottyRoute: RoutedPoint[] = [];
    const route = connRef.displayRoute();

    const avoidRoute = [];
    for (let i = 0; i < route.size(); i++) {
      avoidRoute.push({ x: route.get_ps(i).x, y: route.get_ps(i).y });
    }

    const sourcePointForSourceAnchor = {
      x: route.get_ps(0).x,
      y: route.get_ps(0).y,
    };
    const targetPointForSourceAnchor = {
      x: route.get_ps(1).x,
      y: route.get_ps(1).y,
    };
    const sourceAnchor = this.getFixedTranslatedAnchor(
      edge.source,
      sourcePointForSourceAnchor,
      targetPointForSourceAnchor,
      edge.parent,
      edge,
      edge.sourceAnchorCorrection
    );
    sprottyRoute.push({ kind: "source", ...sourceAnchor });

    for (let i = 0; i < route.size(); i++) {
      // source and target points are set below separately as anchors
      if (i === 0 || i === route.size() - 1) {
        continue;
      }
      const point: RoutedPoint = {
        x: route.get_ps(i).x,
        y: route.get_ps(i).y,
        kind: "linear",
        pointIndex: i,
      };
      sprottyRoute.push(point);
    }

    const sourcePointForTargetAnchor = {
      x: route.get_ps(route.size() - 1).x,
      y: route.get_ps(route.size() - 1).y,
    };
    const targetPointForTargetAnchor = {
      x: route.get_ps(route.size() - 2).x,
      y: route.get_ps(route.size() - 2).y,
    };
    const targetAnchor = this.getFixedTranslatedAnchor(
      edge.target,
      sourcePointForTargetAnchor,
      targetPointForTargetAnchor,
      edge.parent,
      edge,
      edge.targetAnchorCorrection
    );
    sprottyRoute.push({ kind: "target", ...targetAnchor });
    this.edgeRouting.set(edge.id, sprottyRoute);
  }

  routeAll(edges: LibavoidEdge[], parent: SParentElement): EdgeRouting {
    const Avoid: AvoidInterface =
      AvoidLib.getInstance() as unknown as AvoidInterface;
    let routesChanged = false;

    // add shapes to libavoid router
    const connectables = this.getAllBoundsAwareChildren(parent);
    for (const child of connectables as SConnectableElement[]) {
      if (
        child instanceof SRoutableElement ||
        child instanceof SLabel ||
        child instanceof SCompartment ||
        child instanceof SPort ||
        child instanceof SButton
      ) {
        // skip edges and labels
        continue;
      }
      if (child.bounds.width === -1) {
        // pre-rendering phase, skip
        return this.edgeRouting;
      }
      if (child.id in this.avoidShapes) {
        // shape is modified or unchanged
        // if modified: size or/and position
        if (!positionIsEqual(child.bounds, this.avoidShapes[child.id].bounds)) {
          this.avoidRouter.moveShape(
            this.avoidShapes[child.id].ref,
            child.bounds.x - this.avoidShapes[child.id].bounds.x,
            child.bounds.y - this.avoidShapes[child.id].bounds.y
          );
          this.avoidShapes[child.id].bounds = {
            ...this.avoidShapes[child.id].bounds,
            x: child.bounds.x,
            y: child.bounds.y,
          };
          if (!routesChanged) {
            routesChanged = true;
          }
        }
        if (!sizeIsEqual(child.bounds, this.avoidShapes[child.id].bounds)) {
          // shape size changed
          const centerPoint = this.getCenterPoint(child);
          const newRectangle = new Avoid.Rectangle(
            new Avoid.Point(centerPoint.x, centerPoint.y),
            child.bounds.width,
            child.bounds.height
          );
          // moveShape can not only move element, but also resize it(it's only one
          // correct way to resize)
          this.avoidRouter.moveShape(
            this.avoidShapes[child.id].ref,
            newRectangle
          );
          this.avoidShapes[child.id].bounds = {
            ...this.avoidShapes[child.id].bounds,
            width: child.bounds.width,
            height: child.bounds.height,
          };
          if (!routesChanged) {
            routesChanged = true;
          }
        }
      } else {
        // new shape
        const centerPoint = this.getCenterPoint(child);
        const rectangle = new Avoid.Rectangle(
          new Avoid.Point(centerPoint.x, centerPoint.y),
          child.bounds.width,
          child.bounds.height
        );
        const shapeRef = new Avoid.ShapeRef(this.avoidRouter, rectangle);
        const shapeCenterPin = new Avoid.ShapeConnectionPin(
          shapeRef,
          1,
          0.5,
          0.5,
          true,
          0,
          Directions.All
        );
        shapeCenterPin.setExclusive(false);
        this.avoidShapes[child.id] = {
          ref: shapeRef as AvoidInterface["ShapeRef"],
          bounds: { ...child.bounds },
        };

        if (!routesChanged) {
          routesChanged = true;
        }
      }
    }

    const connectableIds = connectables.map((c) => c.id);
    for (const shapeId of Object.keys(this.avoidShapes)) {
      if (!connectableIds.includes(shapeId)) {
        // deleted shape
        this.avoidRouter.deleteShape(this.avoidShapes[shapeId].ref);
        delete this.avoidShapes[shapeId];

        if (!routesChanged) {
          routesChanged = true;
        }
      }
    }

    const edgeById: { [key: string]: LibavoidEdge } = {};
    for (const edge of edges) {
      edgeById[edge.id] = edge;
      // check also source and target?
      if (edge.id in this.avoidConnRefsByEdgeId) {
        continue;
      }

      // TODO: pins visible directions
      const sourceConnEnd = new Avoid.ConnEnd(
        this.avoidShapes[edge.sourceId].ref,
        1
      );
      const targetConnEnd = new Avoid.ConnEnd(
        this.avoidShapes[edge.targetId].ref,
        1
      );
      const connRef = new Avoid.ConnRef(
        this.avoidRouter,
        sourceConnEnd as AvoidInterface["ConnEnd"],
        targetConnEnd as AvoidInterface["ConnEnd"]
      );
      connRef.setCallback(() => {
        // save only edge id, because edge object can be changed til callback call
        this.changedEdgeIds.push(edge.id);
      }, connRef);

      // connection options
      if (edge.routeType) {
        connRef.setRoutingType(edge.routeType);
      }
      if (edge.hateCrossings) {
        connRef.setHateCrossings(edge.hateCrossings);
      }

      this.avoidConnRefsByEdgeId[edge.id] = connRef;

      if (!routesChanged) {
        routesChanged = true;
      }
    }

    // check for deleted edges
    const edgesIds = edges.map((e) => e.id);
    for (const oldEdgeId of Object.keys(this.avoidConnRefsByEdgeId)) {
      if (!edgesIds.includes(oldEdgeId)) {
        this.avoidRouter.deleteConnector(this.avoidConnRefsByEdgeId[oldEdgeId]);
        delete this.avoidConnRefsByEdgeId[oldEdgeId];

        if (!routesChanged) {
          routesChanged = true;
        }
      }
    }

    if (routesChanged) {
      this.avoidRouter.processTransaction();
    }

    // handle edge changes separately, not directly in callback, because edge
    // can be changed between callback creationg and edge change. Save only
    // edge id and handle change here with actual edge
    this.changedEdgeIds.forEach((edgeId) => {
      this.updateConnRefInEdgeRouting(
        this.avoidConnRefsByEdgeId[edgeId],
        edgeById[edgeId]
      );
    });
    this.changedEdgeIds = [];
    return this.edgeRouting;
  }

  destroy() {
    // TODO: explain need of calling destroy
    const Avoid: AvoidInterface =
      AvoidLib.getInstance() as unknown as AvoidInterface;
    Avoid.destroy(this.avoidRouter);
  }

  route(
    edge: Readonly<LibavoidEdge>,
    args?: Record<string, unknown>
  ): RoutedPoint[] {
    let route = this.edgeRouting.get(edge.id);
    if (route === undefined) {
      // edge cannot be routed yet(e.g. pre-rendering phase), but glsp server requires at least
      // two points in route, connect source and target temporarily directly, it will be replaced
      // on next iteration. See https://github.com/eclipse-glsp/glsp-server/blob/master/plugins/org.eclipse.glsp.server/src/org/eclipse/glsp/server/utils/LayoutUtil.java#L116
      route = [
        {
          x: edge.source?.position.x || 0,
          y: edge.source?.position.y || 0,
          kind: "source",
        },
        {
          x: edge.target?.position.x || 0,
          y: edge.target?.position.y || 0,
          kind: "target",
        },
      ];
    }
    return route;
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

  protected getOptions(edge: LibavoidEdge): LinearRouteOptions {
    return {
      minimalPointDistance: 2,
      standardDistance: 20,
      selfEdgeOffset: 0.25,
    };
  }

  /**
   * Calculation is similar as in original method, but `minimalSegmentLengthForChildPosition`
   * parameter is introduced(see LibavoidRouterOptions.minimalSegmentLengthForChildPosition for
   * more details) to avoid getting very small segments, that has negative impact for example on
   * placing edge children such as labels.
   */
  protected override calculateSegment(
    edge: LibavoidEdge,
    t: number
  ): { segmentStart: Point; segmentEnd: Point; lambda: number } | undefined {
    const segments = super.calculateSegment(edge, t);

    if (!segments) return undefined;
    let { segmentStart, segmentEnd, lambda } = segments;
    const segmentLength = Point.euclideanDistance(segmentStart, segmentEnd);
    // avoid placing labels on very small segments
    const minSegmentSize =
      this.options.minimalSegmentLengthForChildPosition === undefined
        ? 20
        : this.options.minimalSegmentLengthForChildPosition;
    if (segmentLength < minSegmentSize) {
      const routedPoints = this.route(edge);
      if (routedPoints.length < 2) return undefined;

      // try to find longer segment before segmentStart
      let found = false;
      const segmentStartIndex = routedPoints.findIndex((point) =>
        Point.equals(point, segmentStart)
      );
      for (let i = segmentStartIndex - 1; i >= 0; i--) {
        const currentSegmentLength = Point.euclideanDistance(
          routedPoints[i],
          routedPoints[i + 1]
        );
        if (currentSegmentLength > minSegmentSize) {
          segmentStart = routedPoints[i];
          segmentEnd = routedPoints[i + 1];
          lambda = 0.8;
          found = true;
          break;
        }
      }

      if (!found) {
        const segmentEndIndex = segmentStartIndex + 1;
        if (segmentEndIndex < routedPoints.length - 1) {
          // no long enough segment before segmentStart, try to find one after segmentEnd
          for (let i = segmentEndIndex; i < routedPoints.length - 1; i++) {
            const currentSegmentLength = Point.euclideanDistance(
              routedPoints[i],
              routedPoints[i + 1]
            );
            if (currentSegmentLength > minSegmentSize) {
              segmentStart = routedPoints[i];
              segmentEnd = routedPoints[i + 1];
              lambda = 0.2;
              found = true;
              break;
            }
          }
        }
      }
    }

    return { segmentStart, segmentEnd, lambda };
  }
}
