var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { AvoidLib } from "libavoid-js";
import { SRoutableElement, SRoutingHandle, EdgeRouting, AbstractEdgeRouter, isBoundsAware, SParentElement, SLabel, SCompartment, SPort, SEdge, SButton, } from "sprotty";
import { centerOfLine } from "sprotty-protocol";
export function containsEdgeRoutes(args) {
    return args !== undefined && "edgeRoutes" in args;
}
export var RouteType;
(function (RouteType) {
    RouteType[RouteType["PolyLine"] = 1] = "PolyLine";
    RouteType[RouteType["Orthogonal"] = 2] = "Orthogonal";
})(RouteType || (RouteType = {}));
// equal to ConnDirFlag in libavoid
export var Directions;
(function (Directions) {
    Directions[Directions["None"] = 0] = "None";
    Directions[Directions["Up"] = 1] = "Up";
    Directions[Directions["Down"] = 2] = "Down";
    Directions[Directions["Left"] = 4] = "Left";
    Directions[Directions["Right"] = 8] = "Right";
    Directions[Directions["All"] = 15] = "All";
})(Directions || (Directions = {}));
// there are two types of configuration parameters in libavoid Router: parameter and option.
// For sprotty router they are unified as 'options', but their type in libavoid should be known
// to set them in router
var routerOptionType = {
    // routingType is a custom option, not inherited from libavoid
    routingType: undefined,
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
var sizeIsEqual = function (bounds1, bounds2) {
    return bounds1.width === bounds2.width && bounds1.height === bounds2.height;
};
var positionIsEqual = function (bounds1, bounds2) {
    return bounds1.x === bounds2.x && bounds1.y === bounds2.y;
};
var LibavoidEdge = /** @class */ (function (_super) {
    __extends(LibavoidEdge, _super);
    function LibavoidEdge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.routerKind = LibavoidRouter.KIND;
        _this.routeType = 0;
        _this.sourceVisibleDirections = undefined;
        _this.targetVisibleDirections = undefined;
        _this.hateCrossings = false;
        return _this;
    }
    return LibavoidEdge;
}(SEdge));
export { LibavoidEdge };
var LibavoidRouter = /** @class */ (function (_super) {
    __extends(LibavoidRouter, _super);
    function LibavoidRouter() {
        var _this = _super.call(this) || this;
        _this.renderedTimes = 0;
        _this.avoidConnRefsByEdgeId = {};
        _this.avoidShapes = {};
        _this.options = {};
        _this.edgeRouting = new EdgeRouting();
        _this.firstRender = true;
        _this.changedEdgeIds = [];
        var Avoid = AvoidLib.getInstance();
        _this.avoidRouter = new Avoid.Router(Avoid.PolyLineRouting);
        return _this;
    }
    Object.defineProperty(LibavoidRouter.prototype, "kind", {
        get: function () {
            return LibavoidRouter.KIND;
        },
        enumerable: false,
        configurable: true
    });
    LibavoidRouter.prototype.setOptions = function (options) {
        var _this = this;
        var Avoid = AvoidLib.getInstance();
        if ("routingType" in options && options.routingType) {
            // routingType can not be changed for router instance
            // reinstantiate router
            Avoid.destroy(this.avoidRouter);
            this.avoidRouter = new Avoid.Router(options.routingType);
        }
        this.options = __assign(__assign({}, this.options), options);
        Object.entries(this.options).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (routerOptionType[key] === "parameter") {
                _this.avoidRouter.setRoutingParameter(Avoid[key], value);
            }
            else if (routerOptionType[key] === "option") {
                _this.avoidRouter.setRoutingOption(Avoid[key], value);
            }
        });
    };
    LibavoidRouter.prototype.getAllBoundsAwareChildren = function (parent) {
        var result = [];
        for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (isBoundsAware(child)) {
                result.push(child);
            }
            if (child instanceof SParentElement) {
                result.push.apply(result, this.getAllBoundsAwareChildren(child));
            }
        }
        return result;
    };
    LibavoidRouter.prototype.getCenterPoint = function (element) {
        var x = element.bounds.width / 2, y = element.bounds.height / 2;
        var currentElement = element;
        while (currentElement) {
            if (currentElement.position) {
                x += currentElement.position.x;
                y += currentElement.position.y;
            }
            if (!(currentElement.parent && currentElement.parent.id === "graph")) {
                currentElement = currentElement.parent;
            }
            else {
                break;
            }
        }
        return { x: x, y: y };
    };
    LibavoidRouter.prototype.getFixedTranslatedAnchor = function (connectable, sourcePoint, refPoint, refContainer, edge, anchorCorrection) {
        if (anchorCorrection === void 0) { anchorCorrection = 0; }
        var anchor = this.getTranslatedAnchor(connectable, refPoint, refContainer, edge, anchorCorrection);
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
    };
    LibavoidRouter.prototype.updateConnRefInEdgeRouting = function (connRef, edge) {
        if (!edge.source || !edge.target) {
            return;
        }
        var sprottyRoute = [];
        var route = connRef.displayRoute();
        var avoidRoute = [];
        for (var i = 0; i < route.size(); i++) {
            avoidRoute.push({ x: route.get_ps(i).x, y: route.get_ps(i).y });
        }
        var sourcePointForSourceAnchor = {
            x: route.get_ps(0).x,
            y: route.get_ps(0).y,
        };
        var targetPointForSourceAnchor = {
            x: route.get_ps(1).x,
            y: route.get_ps(1).y,
        };
        var sourceAnchor = this.getFixedTranslatedAnchor(edge.source, sourcePointForSourceAnchor, targetPointForSourceAnchor, edge.parent, edge, edge.sourceAnchorCorrection);
        sprottyRoute.push(__assign({ kind: "source" }, sourceAnchor));
        for (var i = 0; i < route.size(); i++) {
            // source and target points are set below separately as anchors
            if (i === 0 || i === route.size() - 1) {
                continue;
            }
            var point = {
                x: route.get_ps(i).x,
                y: route.get_ps(i).y,
                kind: "linear",
                pointIndex: i,
            };
            sprottyRoute.push(point);
        }
        var sourcePointForTargetAnchor = {
            x: route.get_ps(route.size() - 1).x,
            y: route.get_ps(route.size() - 1).y,
        };
        var targetPointForTargetAnchor = {
            x: route.get_ps(route.size() - 2).x,
            y: route.get_ps(route.size() - 2).y,
        };
        var targetAnchor = this.getFixedTranslatedAnchor(edge.target, sourcePointForTargetAnchor, targetPointForTargetAnchor, edge.parent, edge, edge.targetAnchorCorrection);
        sprottyRoute.push(__assign({ kind: "target" }, targetAnchor));
        this.edgeRouting.set(edge.id, sprottyRoute);
    };
    LibavoidRouter.prototype.routeAll = function (edges, parent) {
        var _this = this;
        var Avoid = AvoidLib.getInstance();
        var routesChanged = false;
        if (this.firstRender) {
            this.firstRender = false;
            return this.edgeRouting;
        }
        // add shapes to libavoid router
        var connectables = this.getAllBoundsAwareChildren(parent);
        for (var _i = 0, _a = connectables; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child instanceof SRoutableElement ||
                child instanceof SLabel ||
                child instanceof SCompartment ||
                child instanceof SPort ||
                child instanceof SButton) {
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
                    this.avoidRouter.moveShape(this.avoidShapes[child.id].ref, child.bounds.x - this.avoidShapes[child.id].bounds.x, child.bounds.y - this.avoidShapes[child.id].bounds.y);
                    this.avoidShapes[child.id].bounds = __assign(__assign({}, this.avoidShapes[child.id].bounds), { x: child.bounds.x, y: child.bounds.y });
                    if (!routesChanged) {
                        routesChanged = true;
                    }
                }
                if (!sizeIsEqual(child.bounds, this.avoidShapes[child.id].bounds)) {
                    // shape size changed
                    var centerPoint = this.getCenterPoint(child);
                    var newRectangle = new Avoid.Rectangle(new Avoid.Point(centerPoint.x, centerPoint.y), child.bounds.width, child.bounds.height);
                    // moveShape can not only move element, but also resize it(it's only one
                    // correct way to resize)
                    this.avoidRouter.moveShape(this.avoidShapes[child.id].ref, newRectangle);
                    this.avoidShapes[child.id].bounds = __assign(__assign({}, this.avoidShapes[child.id].bounds), { width: child.bounds.width, height: child.bounds.height });
                    if (!routesChanged) {
                        routesChanged = true;
                    }
                }
            }
            else {
                // new shape
                var centerPoint = this.getCenterPoint(child);
                var rectangle = new Avoid.Rectangle(new Avoid.Point(centerPoint.x, centerPoint.y), child.bounds.width, child.bounds.height);
                var shapeRef = new Avoid.ShapeRef(this.avoidRouter, rectangle);
                var shapeCenterPin = new Avoid.ShapeConnectionPin(shapeRef, 1, 0.5, 0.5, true, 0, Directions.All);
                shapeCenterPin.setExclusive(false);
                this.avoidShapes[child.id] = {
                    ref: shapeRef,
                    bounds: __assign({}, child.bounds),
                };
                if (!routesChanged) {
                    routesChanged = true;
                }
            }
        }
        var connectableIds = connectables.map(function (c) { return c.id; });
        for (var _b = 0, _c = Object.keys(this.avoidShapes); _b < _c.length; _b++) {
            var shapeId = _c[_b];
            if (!connectableIds.includes(shapeId)) {
                // deleted shape
                this.avoidRouter.deleteShape(this.avoidShapes[shapeId].ref);
                delete this.avoidShapes[shapeId];
                if (!routesChanged) {
                    routesChanged = true;
                }
            }
        }
        var edgeById = {};
        var _loop_1 = function (edge) {
            edgeById[edge.id] = edge;
            // check also source and target?
            if (edge.id in this_1.avoidConnRefsByEdgeId) {
                return "continue";
            }
            // TODO: pins visible directions
            var sourceConnEnd = new Avoid.ConnEnd(this_1.avoidShapes[edge.sourceId].ref, 1);
            var targetConnEnd = new Avoid.ConnEnd(this_1.avoidShapes[edge.targetId].ref, 1);
            var connRef = new Avoid.ConnRef(this_1.avoidRouter, sourceConnEnd, targetConnEnd);
            connRef.setCallback(function () {
                // save only edge id, because edge object can be changed til callback call
                _this.changedEdgeIds.push(edge.id);
            }, connRef);
            // connection options
            if (edge.routeType) {
                connRef.setRoutingType(edge.routeType);
            }
            if (edge.hateCrossings) {
                connRef.setHateCrossings(edge.hateCrossings);
            }
            this_1.avoidConnRefsByEdgeId[edge.id] = connRef;
        };
        var this_1 = this;
        for (var _d = 0, edges_1 = edges; _d < edges_1.length; _d++) {
            var edge = edges_1[_d];
            _loop_1(edge);
        }
        // check for deleted edges
        var edgesIds = edges.map(function (e) { return e.id; });
        for (var _e = 0, _f = Object.keys(this.avoidConnRefsByEdgeId); _e < _f.length; _e++) {
            var oldEdgeId = _f[_e];
            if (!edgesIds.includes(oldEdgeId)) {
                this.avoidRouter.deleteConnector(this.avoidConnRefsByEdgeId[oldEdgeId]);
                delete this.avoidConnRefsByEdgeId[oldEdgeId];
            }
        }
        if (routesChanged) {
            this.avoidRouter.processTransaction();
        }
        // handle edge changes separately, not directly in callback, because edge
        // can be changed between callback creationg and edge change. Save only
        // edge id and handle change here with actual edge
        this.changedEdgeIds.forEach(function (edgeId) {
            _this.updateConnRefInEdgeRouting(_this.avoidConnRefsByEdgeId[edgeId], edgeById[edgeId]);
        });
        this.changedEdgeIds = [];
        return this.edgeRouting;
    };
    LibavoidRouter.prototype.destroy = function () {
        // TODO: explain need of calling destroy
        var Avoid = AvoidLib.getInstance();
        Avoid.destroy(this.avoidRouter);
    };
    LibavoidRouter.prototype.route = function (edge, args) {
        return this.edgeRouting.get(edge.id) || [];
    };
    LibavoidRouter.prototype.createRoutingHandles = function (edge) {
        var rpCount = edge.routingPoints.length;
        this.addHandle(edge, "source", "routing-point", -2);
        this.addHandle(edge, "line", "volatile-routing-point", -1);
        for (var i = 0; i < rpCount; i++) {
            this.addHandle(edge, "junction", "routing-point", i);
            this.addHandle(edge, "line", "volatile-routing-point", i);
        }
        this.addHandle(edge, "target", "routing-point", rpCount);
    };
    LibavoidRouter.prototype.applyInnerHandleMoves = function (edge, moves) {
        var _this = this;
        moves.forEach(function (move) {
            var handle = move.handle;
            var points = edge.routingPoints;
            var index = handle.pointIndex;
            if (handle.kind === "line") {
                // Upgrade to a proper routing point
                handle.kind = "junction";
                handle.type = "routing-point";
                points.splice(index + 1, 0, move.fromPosition || points[Math.max(index, 0)]);
                edge.children.forEach(function (child) {
                    if (child instanceof SRoutingHandle &&
                        (child === handle || child.pointIndex > index))
                        child.pointIndex++;
                });
                _this.addHandle(edge, "line", "volatile-routing-point", index);
                _this.addHandle(edge, "line", "volatile-routing-point", index + 1);
                index++;
            }
            if (index >= 0 && index < points.length) {
                points[index] = move.toPosition;
            }
        });
    };
    LibavoidRouter.prototype.getInnerHandlePosition = function (edge, route, handle) {
        if (handle.kind === "line") {
            var _a = this.findRouteSegment(edge, route, handle.pointIndex), start = _a.start, end = _a.end;
            if (start !== undefined && end !== undefined)
                return centerOfLine(start, end);
        }
        return undefined;
    };
    LibavoidRouter.prototype.getOptions = function (edge) {
        return {
            minimalPointDistance: 2,
            standardDistance: 20,
            selfEdgeOffset: 0.25,
        };
    };
    LibavoidRouter.KIND = "libavoid";
    return LibavoidRouter;
}(AbstractEdgeRouter));
export { LibavoidRouter };
//# sourceMappingURL=libavoid-router.js.map