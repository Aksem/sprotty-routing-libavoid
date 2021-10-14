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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { inject, injectable } from "inversify";
import { AvoidLib } from "libavoid-js";
import { SRoutingHandle, EdgeRouting, LinearEdgeRouter, centerOfLine, euclideanDistance, isBoundsAware, SParentElement, AnchorComputerRegistry, } from "sprotty";
export function containsEdgeRoutes(args) {
    return args !== undefined && "edgeRoutes" in args;
}
var LibavoidRouter = /** @class */ (function (_super) {
    __extends(LibavoidRouter, _super);
    function LibavoidRouter() {
        var _this = _super.call(this) || this;
        _this.renderedTimes = 0;
        var Avoid = AvoidLib.getInstance();
        _this.avoidRouter = new Avoid.Router(Avoid.OrthogonalRouting | Avoid.PolyLineRouting);
        _this.avoidRoutes = {};
        console.log("router", _this.avoidRouter);
        return _this;
    }
    LibavoidRouter_1 = LibavoidRouter;
    Object.defineProperty(LibavoidRouter.prototype, "kind", {
        get: function () {
            return LibavoidRouter_1.KIND;
        },
        enumerable: false,
        configurable: true
    });
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
    LibavoidRouter.prototype.avoidRoutesToEdgeRoutes = function (avoidRoutes) {
        var routes = new EdgeRouting();
        for (var _i = 0, avoidRoutes_1 = avoidRoutes; _i < avoidRoutes_1.length; _i++) {
            var connection = avoidRoutes_1[_i];
            var sprottyRoute = [];
            var route = connection.connRef.displayRoute();
            for (var i = 0; i < route.size(); i++) {
                var kind = "linear";
                if (i === 0) {
                    kind = "source";
                }
                else if (i === route.size() - 1) {
                    kind = "target";
                }
                sprottyRoute.push({
                    x: route.get_ps(i).x,
                    y: route.get_ps(i).y,
                    kind: kind,
                    pointIndex: 1,
                });
            }
            routes.set(connection.child.id, sprottyRoute);
            this.avoidRoutes[connection.child.id] = __assign(__assign({}, this.avoidRoutes[connection.child.id]), { routes: sprottyRoute });
        }
        return routes;
    };
    LibavoidRouter.prototype.routeAll = function (edges, parent) {
        // TODO: avoid recalculating of the same elements
        var connections = [];
        var Avoid = AvoidLib.getInstance();
        this.avoidRouter = new Avoid.Router(Avoid.OrthogonalRouting | Avoid.PolyLineRouting);
        for (var _i = 0, edges_1 = edges; _i < edges_1.length; _i++) {
            var child = edges_1[_i];
            var sourceConnectionEnd = this.getCenterPoint(child.source);
            var targetConnectionEnd = this.getCenterPoint(child.target);
            var connRef = new Avoid.ConnRef(this.avoidRouter, new Avoid.ConnEnd(new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)), new Avoid.ConnEnd(new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)));
            var routingType = Avoid.PolyLineRouting;
            if (child.routerKind === "manhattan") {
                routingType = Avoid.OrthogonalRouting;
            }
            connRef.setRoutingType(routingType);
            connections.push({ child: child, connRef: connRef, routes: [] });
            this.avoidRoutes[child.id] = { connRef: connRef, child: child, routes: [] };
        }
        var connectables = this.getAllBoundsAwareChildren(parent);
        console.log("connectables count: ", connectables.length);
        for (var _a = 0, _b = connectables; _a < _b.length; _a++) {
            var child = _b[_a];
            var centerPoint = this.getCenterPoint(child);
            var rectangle = new Avoid.Rectangle(new Avoid.Point(centerPoint.x, centerPoint.y), child.bounds.width, child.bounds.height);
            new Avoid.ShapeRef(this.avoidRouter, rectangle);
        }
        this.avoidRouter.processTransaction();
        var edgeRoutes = this.avoidRoutesToEdgeRoutes(connections);
        for (var _c = 0, connections_1 = connections; _c < connections_1.length; _c++) {
            var connection = connections_1[_c];
            this.avoidRouter.deleteConnector(connection.connRef);
        }
        Avoid.destroy(this.avoidRouter);
        this.renderedTimes += 1;
        console.log(connections);
        return edgeRoutes;
    };
    LibavoidRouter.prototype.route = function (edge, args) {
        console.log("get", edge, args, this.avoidRoutes);
        return this.routeAll([edge], edge).get(edge.id) || [];
    };
    LibavoidRouter.prototype.calculateSegment = function (edge, t) {
        if (t < 0 || t > 1)
            return undefined;
        var routedPoints = this.avoidRoutes[edge.id].routes;
        console.log("points", routedPoints.length);
        if (routedPoints.length < 2)
            return undefined;
        var segmentLengths = [];
        var totalLength = 0;
        for (var i = 0; i < routedPoints.length - 1; ++i) {
            segmentLengths[i] = euclideanDistance(routedPoints[i], routedPoints[i + 1]);
            totalLength += segmentLengths[i];
        }
        var currentLenght = 0;
        var tAsLenght = t * totalLength;
        for (var i = 0; i < routedPoints.length - 1; ++i) {
            var newLength = currentLenght + segmentLengths[i];
            // avoid division by (almost) zero
            if (segmentLengths[i] > 1e-8) {
                if (newLength >= tAsLenght) {
                    var lambda = Math.max(0, tAsLenght - currentLenght) / segmentLengths[i];
                    return {
                        segmentStart: routedPoints[i],
                        segmentEnd: routedPoints[i + 1],
                        lambda: lambda,
                    };
                }
            }
            currentLenght = newLength;
        }
        return {
            segmentEnd: routedPoints.pop(),
            segmentStart: routedPoints.pop(),
            lambda: 1,
        };
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
            removeAngleThreshold: 0.1,
            standardDistance: 20,
            selfEdgeOffset: 0.25,
        };
    };
    var LibavoidRouter_1;
    LibavoidRouter.KIND = "libavoid";
    __decorate([
        inject(AnchorComputerRegistry),
        __metadata("design:type", AnchorComputerRegistry)
    ], LibavoidRouter.prototype, "anchorRegistry", void 0);
    LibavoidRouter = LibavoidRouter_1 = __decorate([
        injectable(),
        __metadata("design:paramtypes", [])
    ], LibavoidRouter);
    return LibavoidRouter;
}(LinearEdgeRouter));
export { LibavoidRouter };
//# sourceMappingURL=libavoid-router.js.map