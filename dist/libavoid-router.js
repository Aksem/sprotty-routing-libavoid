import { AvoidLib } from "libavoid-js";
import { SRoutingHandleImpl, EdgeRouting, AbstractEdgeRouter, isBoundsAware, SConnectableElementImpl, SParentElementImpl, connectableFeature } from "sprotty";
import { Point, centerOfLine } from "sprotty-protocol";
import { RouteType, Directions, libavoidRouterKind, } from "./libavoid-router-options";
import { LibavoidEdge } from "./libavoid-edge";
import { addConnectionPinsToShape, getCenterPoint, updateConnPinsOnShapeResize, } from "./connection-pins-utils";
export { RouteType, Directions, LibavoidEdge };
export function containsEdgeRoutes(args) {
    return args !== undefined && "edgeRoutes" in args;
}
// there are two types of configuration parameters in libavoid Router: parameter and option.
// For sprotty router they are unified as 'options', but their type in libavoid should be known
// to set them in router
const routerOptionType = {
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
const sizeIsEqual = (bounds1, bounds2) => {
    return bounds1.width === bounds2.width && bounds1.height === bounds2.height;
};
const positionIsEqual = (bounds1, bounds2) => {
    return bounds1.x === bounds2.x && bounds1.y === bounds2.y;
};
export class LibavoidRouter extends AbstractEdgeRouter {
    constructor() {
        super();
        this.renderedTimes = 0;
        this.avoidConnRefsByEdgeId = {};
        this.avoidShapes = {};
        this.options = {};
        this.edgeRouting = new EdgeRouting();
        this.changedEdgeIds = [];
        const Avoid = AvoidLib.getInstance();
        this.avoidRouter = new Avoid.Router(Avoid.PolyLineRouting);
    }
    get kind() {
        return LibavoidRouter.KIND;
    }
    setOptions(options) {
        const Avoid = AvoidLib.getInstance();
        if ("routingType" in options && options.routingType) {
            // routingType can not be changed for router instance
            // reinstantiate router
            Avoid.destroy(this.avoidRouter);
            this.avoidRouter = new Avoid.Router(options.routingType);
        }
        this.options = Object.assign(Object.assign({}, this.options), options);
        Object.entries(this.options).forEach(([key, value]) => {
            if (routerOptionType[key] === "parameter") {
                this.avoidRouter.setRoutingParameter(Avoid[key], value);
            }
            else if (routerOptionType[key] === "option") {
                this.avoidRouter.setRoutingOption(Avoid[key], value);
            }
        });
    }
    getAllBoundsAwareChildren(parent) {
        const result = [];
        for (const child of parent.children) {
            if (isBoundsAware(child)) {
                result.push(child);
            }
            if (child instanceof SParentElementImpl) {
                result.push(...this.getAllBoundsAwareChildren(child));
            }
        }
        return result;
    }
    getFixedTranslatedAnchor(connectable, sourcePoint, refPoint, refContainer, edge, anchorCorrection = 0) {
        let anchor = this.getTranslatedAnchor(connectable, refPoint, refContainer, edge, anchorCorrection);
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
        }
        else if (sourcePoint.y === refPoint.y) {
            // first edge line is horizontal, use y coordinate from router
            anchor = {
                x: anchor.x,
                y: sourcePoint.y,
            };
        }
        return anchor;
    }
    updateConnRefInEdgeRouting(connRef, edge) {
        if (!edge.source || !edge.target) {
            return;
        }
        const sprottyRoute = [];
        const route = connRef.displayRoute();
        const avoidRoute = [];
        for (let i = 0; i < route.size(); i++) {
            avoidRoute.push({ x: route.get_ps(i).x, y: route.get_ps(i).y });
        }
        let sourceAnchor;
        if (edge.routeType == RouteType.PolyLine) {
            const sourcePointForSourceAnchor = {
                x: avoidRoute[0].x,
                y: avoidRoute[0].y,
            };
            const targetPointForSourceAnchor = {
                x: avoidRoute[1].x,
                y: avoidRoute[1].y,
            };
            sourceAnchor = this.getFixedTranslatedAnchor(edge.source, sourcePointForSourceAnchor, targetPointForSourceAnchor, edge.parent, edge, edge.sourceAnchorCorrection);
        }
        else {
            sourceAnchor = {
                x: avoidRoute[0].x,
                y: avoidRoute[0].y,
            };
        }
        sprottyRoute.push(Object.assign({ kind: "source" }, sourceAnchor));
        for (let i = 0; i < avoidRoute.length; i++) {
            // source and target points are set below separately as anchors
            if (i === 0 || i === avoidRoute.length - 1) {
                continue;
            }
            const point = {
                x: avoidRoute[i].x,
                y: avoidRoute[i].y,
                kind: "linear",
                pointIndex: i,
            };
            sprottyRoute.push(point);
        }
        let targetAnchor;
        if (edge.routeType == RouteType.PolyLine) {
            const sourcePointForTargetAnchor = {
                x: avoidRoute[avoidRoute.length - 1].x,
                y: avoidRoute[avoidRoute.length - 1].y,
            };
            const targetPointForTargetAnchor = {
                x: avoidRoute[avoidRoute.length - 2].x,
                y: avoidRoute[avoidRoute.length - 2].y,
            };
            targetAnchor = this.getFixedTranslatedAnchor(edge.target, sourcePointForTargetAnchor, targetPointForTargetAnchor, edge.parent, edge, edge.targetAnchorCorrection);
        }
        else {
            targetAnchor = {
                x: avoidRoute[avoidRoute.length - 1].x,
                y: avoidRoute[avoidRoute.length - 1].y,
            };
        }
        sprottyRoute.push(Object.assign({ kind: "target" }, targetAnchor));
        this.edgeRouting.set(edge.id, sprottyRoute);
    }
    routeAll(edges, parent) {
        const Avoid = AvoidLib.getInstance();
        let routesChanged = false;
        // add shapes to libavoid router
        const connectables = this.getAllBoundsAwareChildren(parent);
        for (const child of connectables) {
            if (!(child instanceof SConnectableElementImpl) || !child.hasFeature(connectableFeature)) {
                continue;
            }
            if (child.bounds.width === -1) {
                // pre-rendering phase, skip
                return this.edgeRouting;
            }
            if (child.id in this.avoidShapes) {
                // shape is modified or unchanged
                // if modified: size or/and position
                routesChanged = routesChanged || this.handleModifiedShape(child, Avoid);
            }
            else {
                // new shape
                this.handleNewShape(child, Avoid);
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
        const edgeById = {};
        for (const edge of edges) {
            edgeById[edge.id] = edge;
            // check also source and target?
            if (edge.id in this.avoidConnRefsByEdgeId) {
                continue;
            }
            let classId = 1;
            if (edge.routeType == RouteType.PolyLine) {
                classId = 2;
            }
            const sourceShape = this.avoidShapes[edge.sourceId];
            if (!sourceShape) {
                continue;
            }
            const sourceConnEnd = new Avoid.ConnEnd(sourceShape.ref, classId);
            const targetShape = this.avoidShapes[edge.targetId];
            if (!targetShape) {
                continue;
            }
            const targetConnEnd = new Avoid.ConnEnd(targetShape.ref, classId);
            const connRef = new Avoid.ConnRef(this.avoidRouter, sourceConnEnd, targetConnEnd);
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
            this.updateConnRefInEdgeRouting(this.avoidConnRefsByEdgeId[edgeId], edgeById[edgeId]);
        });
        this.changedEdgeIds = [];
        return this.edgeRouting;
    }
    handleModifiedShape(child, Avoid) {
        let routesChanged = false;
        if (!positionIsEqual(child.bounds, this.avoidShapes[child.id].bounds)) {
            this.avoidRouter.moveShape(this.avoidShapes[child.id].ref, child.bounds.x - this.avoidShapes[child.id].bounds.x, child.bounds.y - this.avoidShapes[child.id].bounds.y);
            this.avoidShapes[child.id].bounds = Object.assign(Object.assign({}, this.avoidShapes[child.id].bounds), { x: child.bounds.x, y: child.bounds.y });
            if (!routesChanged) {
                routesChanged = true;
            }
        }
        if (!sizeIsEqual(child.bounds, this.avoidShapes[child.id].bounds)) {
            // shape size changed
            const centerPoint = getCenterPoint(child);
            const newRectangle = new Avoid.Rectangle(new Avoid.Point(centerPoint.x, centerPoint.y), child.bounds.width, child.bounds.height);
            // moveShape can not only move element, but also resize it(it's only one
            // correct way to resize)
            this.avoidRouter.moveShape(this.avoidShapes[child.id].ref, newRectangle);
            this.avoidShapes[child.id].bounds = Object.assign(Object.assign({}, this.avoidShapes[child.id].bounds), { width: child.bounds.width, height: child.bounds.height });
            updateConnPinsOnShapeResize(child, this.avoidShapes[child.id], this.getAnchorComputer(child), Avoid);
            if (!routesChanged) {
                routesChanged = true;
            }
        }
        return routesChanged;
    }
    handleNewShape(child, Avoid) {
        // new shape
        const centerPoint = getCenterPoint(child);
        const rectangle = new Avoid.Rectangle(new Avoid.Point(centerPoint.x, centerPoint.y), child.bounds.width, child.bounds.height);
        const shapeRef = new Avoid.ShapeRef(this.avoidRouter, rectangle);
        const connPins = addConnectionPinsToShape(shapeRef, child, centerPoint, this.getAnchorComputer(child), Avoid);
        this.avoidShapes[child.id] = {
            ref: shapeRef,
            bounds: Object.assign({}, child.bounds),
            connPins,
        };
    }
    destroy() {
        // TODO: explain need of calling destroy
        const Avoid = AvoidLib.getInstance();
        Avoid.destroy(this.avoidRouter);
    }
    route(edge, args) {
        var _a, _b, _c, _d;
        let route = this.edgeRouting.get(edge.id);
        if (route === undefined) {
            // edge cannot be routed yet(e.g. pre-rendering phase), but glsp server requires at least
            // two points in route, connect source and target temporarily directly, it will be replaced
            // on next iteration. See https://github.com/eclipse-glsp/glsp-server/blob/master/plugins/org.eclipse.glsp.server/src/org/eclipse/glsp/server/utils/LayoutUtil.java#L116
            route = [
                {
                    x: ((_a = edge.source) === null || _a === void 0 ? void 0 : _a.position.x) || 0,
                    y: ((_b = edge.source) === null || _b === void 0 ? void 0 : _b.position.y) || 0,
                    kind: "source",
                },
                {
                    x: ((_c = edge.target) === null || _c === void 0 ? void 0 : _c.position.x) || 0,
                    y: ((_d = edge.target) === null || _d === void 0 ? void 0 : _d.position.y) || 0,
                    kind: "target",
                },
            ];
        }
        return route;
    }
    createRoutingHandles(edge) {
        const rpCount = edge.routingPoints.length;
        this.addHandle(edge, "source", "routing-point", -2);
        this.addHandle(edge, "line", "volatile-routing-point", -1);
        for (let i = 0; i < rpCount; i++) {
            this.addHandle(edge, "junction", "routing-point", i);
            this.addHandle(edge, "line", "volatile-routing-point", i);
        }
        this.addHandle(edge, "target", "routing-point", rpCount);
    }
    applyInnerHandleMoves(edge, moves) {
        moves.forEach((move) => {
            const handle = move.handle;
            const points = edge.routingPoints;
            let index = handle.pointIndex;
            if (handle.kind === "line") {
                // Upgrade to a proper routing point
                handle.kind = "junction";
                handle.type = "routing-point";
                points.splice(index + 1, 0, move.fromPosition || points[Math.max(index, 0)]);
                edge.children.forEach((child) => {
                    if (child instanceof SRoutingHandleImpl &&
                        (child === handle || child.pointIndex > index))
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
    getInnerHandlePosition(edge, route, handle) {
        if (handle.kind === "line") {
            const { start, end } = this.findRouteSegment(edge, route, handle.pointIndex);
            if (start !== undefined && end !== undefined)
                return centerOfLine(start, end);
        }
        return undefined;
    }
    getOptions(edge) {
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
    calculateSegment(edge, t) {
        const segments = super.calculateSegment(edge, t);
        if (!segments)
            return undefined;
        let { segmentStart, segmentEnd, lambda } = segments;
        const segmentLength = Point.euclideanDistance(segmentStart, segmentEnd);
        // avoid placing labels on very small segments
        const minSegmentSize = this.options.minimalSegmentLengthForChildPosition === undefined
            ? 20
            : this.options.minimalSegmentLengthForChildPosition;
        if (segmentLength < minSegmentSize) {
            const routedPoints = this.route(edge);
            if (routedPoints.length < 2)
                return undefined;
            // try to find longer segment before segmentStart
            let found = false;
            const segmentStartIndex = routedPoints.findIndex((point) => Point.equals(point, segmentStart));
            for (let i = segmentStartIndex - 1; i >= 0; i--) {
                const currentSegmentLength = Point.euclideanDistance(routedPoints[i], routedPoints[i + 1]);
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
                        const currentSegmentLength = Point.euclideanDistance(routedPoints[i], routedPoints[i + 1]);
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
LibavoidRouter.KIND = libavoidRouterKind;
//# sourceMappingURL=libavoid-router.js.map