/********************************************************************************
 * Copyright (c) 2019-2020 TypeFox and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
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
// import { translatePoint } from "../../base/model/smodel-utils";
import { AvoidLib } from 'libavoid-js';
import { almostEquals, includes, linear, manhattanDistance } from "sprotty/src/utils/geometry"; // center,
import { DefaultAnchors, LinearEdgeRouter, Side } from "./linear-edge-router";
import { SRoutingHandle } from "./model";
var ManhattanEdgeRouter = /** @class */ (function (_super) {
    __extends(ManhattanEdgeRouter, _super);
    function ManhattanEdgeRouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(ManhattanEdgeRouter.prototype, "kind", {
        get: function () {
            return ManhattanEdgeRouter.KIND;
        },
        enumerable: false,
        configurable: true
    });
    ManhattanEdgeRouter.prototype.getOptions = function (edge) {
        return {
            standardDistance: 20,
            minimalPointDistance: 3,
            selfEdgeOffset: 0.25
        };
    };
    ManhattanEdgeRouter.prototype.route = function (edge) {
        if (!edge.source || !edge.target)
            return [];
        // const routedCorners = this.createRoutedCorners(edge);
        // const sourceRefPoint = routedCorners[0]
        //     || translatePoint(center(edge.target.bounds), edge.target.parent, edge.parent);
        // const sourceAnchor = this.getTranslatedAnchor(edge.source, sourceRefPoint, edge.parent, edge, edge.sourceAnchorCorrection);
        // const targetRefPoint = routedCorners[routedCorners.length - 1]
        //     || translatePoint(center(edge.source.bounds), edge.source.parent, edge.parent);
        // const targetAnchor = this.getTranslatedAnchor(edge.target, targetRefPoint, edge.parent, edge, edge.targetAnchorCorrection);
        // if (!sourceAnchor || !targetAnchor)
        //     return [];
        // const routedPoints: RoutedPoint[] = [];
        // routedPoints.push({ kind: 'source', ...sourceAnchor});
        // routedCorners.forEach(corner => routedPoints.push(corner));
        // routedPoints.push({ kind: 'target', ...targetAnchor});
        var routedPoints = [];
        if (!this.avoidRoutes[edge.id]) {
            return [];
        }
        var route = this.avoidRoutes[edge.id].connRef.displayRoute();
        for (var i = 0; i < route.size(); i++) {
            var kind = 'linear';
            if (i === 0) {
                kind = 'source';
            }
            else if (i === route.size() - 1) {
                kind = 'target';
            }
            routedPoints.push({ x: route.get_ps(i).x, y: route.get_ps(i).y, kind: kind, pointIndex: 1 });
        }
        return routedPoints;
    };
    ManhattanEdgeRouter.prototype.createRoutedCorners = function (edge) {
        var sourceAnchors = new DefaultAnchors(edge.source, edge.parent, 'source');
        var targetAnchors = new DefaultAnchors(edge.target, edge.parent, 'target');
        if (edge.routingPoints.length > 0) {
            var routingPointsCopy = edge.routingPoints.slice();
            this.cleanupRoutingPoints(edge, routingPointsCopy, false, true);
            if (routingPointsCopy.length > 0)
                return routingPointsCopy.map(function (routingPoint, index) {
                    return __assign({ kind: 'linear', pointIndex: index }, routingPoint);
                });
        }
        var options = this.getOptions(edge);
        var corners = this.calculateDefaultCorners(edge, sourceAnchors, targetAnchors, options);
        return corners.map(function (corner) {
            return __assign({ kind: 'linear' }, corner);
        });
    };
    ManhattanEdgeRouter.prototype.createRoutingHandles = function (edge) {
        var routedPoints = this.route(edge);
        this.commitRoute(edge, routedPoints);
        if (routedPoints.length > 0) {
            this.addHandle(edge, 'source', 'routing-point', -2);
            for (var i = 0; i < routedPoints.length - 1; ++i)
                this.addHandle(edge, 'manhattan-50%', 'volatile-routing-point', i - 1);
            this.addHandle(edge, 'target', 'routing-point', routedPoints.length - 2);
        }
    };
    ManhattanEdgeRouter.prototype.getInnerHandlePosition = function (edge, route, handle) {
        var fraction = this.getFraction(handle.kind);
        if (fraction !== undefined) {
            var _a = this.findRouteSegment(edge, route, handle.pointIndex), start = _a.start, end = _a.end;
            if (start !== undefined && end !== undefined)
                return linear(start, end, fraction);
        }
        return undefined;
    };
    ManhattanEdgeRouter.prototype.getFraction = function (kind) {
        switch (kind) {
            case 'manhattan-50%': return 0.5;
            default: return undefined;
        }
    };
    ManhattanEdgeRouter.prototype.commitRoute = function (edge, routedPoints) {
        var newRoutingPoints = [];
        for (var i = 1; i < routedPoints.length - 1; ++i)
            newRoutingPoints.push({ x: routedPoints[i].x, y: routedPoints[i].y });
        edge.routingPoints = newRoutingPoints;
    };
    ManhattanEdgeRouter.prototype.applyInnerHandleMoves = function (edge, moves) {
        var _this = this;
        var route = this.route(edge);
        var routingPoints = edge.routingPoints;
        var minimalPointDistance = this.getOptions(edge).minimalPointDistance;
        moves.forEach(function (move) {
            var handle = move.handle;
            var index = handle.pointIndex;
            var correctedX = _this.correctX(routingPoints, index, move.toPosition.x, minimalPointDistance);
            var correctedY = _this.correctY(routingPoints, index, move.toPosition.y, minimalPointDistance);
            switch (handle.kind) {
                case 'manhattan-50%':
                    if (index < 0) {
                        if (almostEquals(route[0].x, route[1].x))
                            _this.alignX(routingPoints, 0, correctedX);
                        else
                            _this.alignY(routingPoints, 0, correctedY);
                    }
                    else if (index < routingPoints.length - 1) {
                        if (almostEquals(routingPoints[index].x, routingPoints[index + 1].x)) {
                            _this.alignX(routingPoints, index, correctedX);
                            _this.alignX(routingPoints, index + 1, correctedX);
                        }
                        else {
                            _this.alignY(routingPoints, index, correctedY);
                            _this.alignY(routingPoints, index + 1, correctedY);
                        }
                    }
                    else {
                        if (almostEquals(route[route.length - 2].x, route[route.length - 1].x))
                            _this.alignX(routingPoints, routingPoints.length - 1, correctedX);
                        else
                            _this.alignY(routingPoints, routingPoints.length - 1, correctedY);
                    }
                    break;
            }
        });
    };
    ManhattanEdgeRouter.prototype.correctX = function (routingPoints, index, x, minimalPointDistance) {
        if (index > 0 && Math.abs(x - routingPoints[index - 1].x) < minimalPointDistance)
            return routingPoints[index - 1].x;
        else if (index < routingPoints.length - 2 && Math.abs(x - routingPoints[index + 2].x) < minimalPointDistance)
            return routingPoints[index + 2].x;
        else
            return x;
    };
    ManhattanEdgeRouter.prototype.alignX = function (routingPoints, index, x) {
        if (index >= 0 && index < routingPoints.length)
            routingPoints[index] = {
                x: x,
                y: routingPoints[index].y
            };
    };
    ManhattanEdgeRouter.prototype.correctY = function (routingPoints, index, y, minimalPointDistance) {
        if (index > 0 && Math.abs(y - routingPoints[index - 1].y) < minimalPointDistance)
            return routingPoints[index - 1].y;
        else if (index < routingPoints.length - 2 && Math.abs(y - routingPoints[index + 2].y) < minimalPointDistance)
            return routingPoints[index + 2].y;
        else
            return y;
    };
    ManhattanEdgeRouter.prototype.alignY = function (routingPoints, index, y) {
        if (index >= 0 && index < routingPoints.length)
            routingPoints[index] = {
                x: routingPoints[index].x,
                y: y
            };
    };
    // is copy pasted from routing.ts, avoid duplicating
    ManhattanEdgeRouter.prototype.getCenterPoint = function (element) {
        var x = element.bounds.width / 2, y = element.bounds.height / 2;
        var currentElement = element;
        while (currentElement) {
            if (currentElement.position) {
                x += currentElement.position.x;
                y += currentElement.position.y;
            }
            if (!(currentElement.parent && currentElement.parent.id === 'graph')) {
                currentElement = currentElement.parent;
            }
            else {
                break;
            }
        }
        return { x: x, y: y };
    };
    ManhattanEdgeRouter.prototype.cleanupRoutingPoints = function (edge, routingPoints, updateHandles, addRoutingPoints) {
        var sourceAnchors = new DefaultAnchors(edge.source, edge.parent, "source");
        var targetAnchors = new DefaultAnchors(edge.target, edge.parent, "target");
        var sourceConnectionEnd = this.getCenterPoint(edge.source);
        var targetConnectionEnd = this.getCenterPoint(edge.target);
        var Avoid = AvoidLib.getInstance();
        this.avoidRoutes[edge.id].connRef.setSourceEndpoint(new Avoid.ConnEnd(new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)));
        this.avoidRoutes[edge.id].connRef.setDestEndpoint(new Avoid.ConnEnd(new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)));
        return;
        if (this.resetRoutingPointsOnReconnect(edge, routingPoints, updateHandles, sourceAnchors, targetAnchors))
            return;
        // delete leading RPs inside the bounds of the source
        for (var i = 0; i < routingPoints.length; ++i)
            if (includes(sourceAnchors.bounds, routingPoints[i])) {
                routingPoints.splice(0, 1);
                if (updateHandles) {
                    this.removeHandle(edge, -1);
                }
            }
            else {
                break;
            }
        // delete trailing RPs inside the bounds of the target
        for (var i = routingPoints.length - 1; i >= 0; --i)
            if (includes(targetAnchors.bounds, routingPoints[i])) {
                routingPoints.splice(i, 1);
                if (updateHandles) {
                    this.removeHandle(edge, i);
                }
            }
            else {
                break;
            }
        if (routingPoints.length >= 2) {
            var options = this.getOptions(edge);
            for (var i = routingPoints.length - 2; i >= 0; --i) {
                if (manhattanDistance(routingPoints[i], routingPoints[i + 1]) < options.minimalPointDistance) {
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
            this.addAdditionalCorner(edge, routingPoints, sourceAnchors, targetAnchors, updateHandles);
            this.addAdditionalCorner(edge, routingPoints, targetAnchors, sourceAnchors, updateHandles);
            this.manhattanify(edge, routingPoints);
        }
    };
    ManhattanEdgeRouter.prototype.removeHandle = function (edge, pointIndex) {
        var toBeRemoved = [];
        edge.children.forEach(function (child) {
            if (child instanceof SRoutingHandle) {
                if (child.pointIndex > pointIndex)
                    --child.pointIndex;
                else if (child.pointIndex === pointIndex)
                    toBeRemoved.push(child);
            }
        });
        toBeRemoved.forEach(function (child) { return edge.remove(child); });
    };
    ManhattanEdgeRouter.prototype.addAdditionalCorner = function (edge, routingPoints, currentAnchors, otherAnchors, updateHandles) {
        if (routingPoints.length === 0)
            return;
        var refPoint = currentAnchors.kind === 'source' ? routingPoints[0] : routingPoints[routingPoints.length - 1];
        var index = currentAnchors.kind === 'source' ? 0 : routingPoints.length;
        var shiftIndex = index - (currentAnchors.kind === 'source' ? 1 : 0);
        var isHorizontal;
        if (routingPoints.length > 1) {
            isHorizontal = index === 0
                ? almostEquals(routingPoints[0].x, routingPoints[1].x)
                : almostEquals(routingPoints[routingPoints.length - 1].x, routingPoints[routingPoints.length - 2].x);
        }
        else {
            var nearestSide = otherAnchors.getNearestSide(refPoint);
            isHorizontal = nearestSide === Side.TOP || nearestSide === Side.BOTTOM;
        }
        if (isHorizontal) {
            if (refPoint.y < currentAnchors.get(Side.TOP).y || refPoint.y > currentAnchors.get(Side.BOTTOM).y) {
                var newPoint = { x: currentAnchors.get(Side.TOP).x, y: refPoint.y };
                routingPoints.splice(index, 0, newPoint);
                if (updateHandles) {
                    edge.children.forEach(function (child) {
                        if (child instanceof SRoutingHandle && child.pointIndex >= shiftIndex)
                            ++child.pointIndex;
                    });
                    this.addHandle(edge, 'manhattan-50%', 'volatile-routing-point', shiftIndex);
                }
            }
        }
        else {
            if (refPoint.x < currentAnchors.get(Side.LEFT).x || refPoint.x > currentAnchors.get(Side.RIGHT).x) {
                var newPoint = { x: refPoint.x, y: currentAnchors.get(Side.LEFT).y };
                routingPoints.splice(index, 0, newPoint);
                if (updateHandles) {
                    edge.children.forEach(function (child) {
                        if (child instanceof SRoutingHandle && child.pointIndex >= shiftIndex)
                            ++child.pointIndex;
                    });
                    this.addHandle(edge, 'manhattan-50%', 'volatile-routing-point', shiftIndex);
                }
            }
        }
    };
    /**
     * Add artificial routing points to keep all angles rectilinear.
     *
     * This makes edge morphing look a lot smoother, where RP positions are interpolated
     * linearly probably resulting in non-rectilinear angles. We don't add handles for
     * these additional RPs.
     */
    ManhattanEdgeRouter.prototype.manhattanify = function (edge, routingPoints) {
        for (var i = 1; i < routingPoints.length; ++i) {
            var isVertical = Math.abs(routingPoints[i - 1].x - routingPoints[i].x) < 1;
            var isHorizontal = Math.abs(routingPoints[i - 1].y - routingPoints[i].y) < 1;
            if (!isVertical && !isHorizontal) {
                routingPoints.splice(i, 0, {
                    x: routingPoints[i - 1].x,
                    y: routingPoints[i].y
                });
                ++i;
            }
        }
    };
    ManhattanEdgeRouter.prototype.calculateDefaultCorners = function (edge, sourceAnchors, targetAnchors, options) {
        var selfEdge = _super.prototype.calculateDefaultCorners.call(this, edge, sourceAnchors, targetAnchors, options);
        if (selfEdge.length > 0)
            return selfEdge;
        var bestAnchors = this.getBestConnectionAnchors(edge, sourceAnchors, targetAnchors, options);
        var sourceSide = bestAnchors.source;
        var targetSide = bestAnchors.target;
        var corners = [];
        var startPoint = sourceAnchors.get(sourceSide);
        var endPoint = targetAnchors.get(targetSide);
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
                        corners.push({ x: Math.max(startPoint.x, endPoint.x) + 1.5 * options.standardDistance, y: startPoint.y });
                        corners.push({ x: Math.max(startPoint.x, endPoint.x) + 1.5 * options.standardDistance, y: endPoint.y });
                        break;
                    case Side.LEFT:
                        if (endPoint.y !== startPoint.y) {
                            corners.push({ x: (startPoint.x + endPoint.x) / 2, y: startPoint.y });
                            corners.push({ x: (startPoint.x + endPoint.x) / 2, y: endPoint.y });
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
                            corners.push({ x: (startPoint.x + endPoint.x) / 2, y: startPoint.y });
                            corners.push({ x: (startPoint.x + endPoint.x) / 2, y: endPoint.y });
                        }
                        break;
                }
                break;
            case Side.TOP:
                switch (targetSide) {
                    case Side.RIGHT:
                        if ((endPoint.x - startPoint.x) > 0) {
                            corners.push({ x: startPoint.x, y: startPoint.y - options.standardDistance });
                            corners.push({ x: endPoint.x + 1.5 * options.standardDistance, y: startPoint.y - options.standardDistance });
                            corners.push({ x: endPoint.x + 1.5 * options.standardDistance, y: endPoint.y });
                        }
                        else {
                            corners.push({ x: startPoint.x, y: endPoint.y });
                        }
                        break;
                    case Side.LEFT:
                        if ((endPoint.x - startPoint.x) < 0) {
                            corners.push({ x: startPoint.x, y: startPoint.y - options.standardDistance });
                            corners.push({ x: endPoint.x - 1.5 * options.standardDistance, y: startPoint.y - options.standardDistance });
                            corners.push({ x: endPoint.x - 1.5 * options.standardDistance, y: endPoint.y });
                        }
                        else {
                            corners.push({ x: startPoint.x, y: endPoint.y });
                        }
                        break;
                    case Side.TOP:
                        corners.push({ x: startPoint.x, y: Math.min(startPoint.y, endPoint.y) - 1.5 * options.standardDistance });
                        corners.push({ x: endPoint.x, y: Math.min(startPoint.y, endPoint.y) - 1.5 * options.standardDistance });
                        break;
                    case Side.BOTTOM:
                        if (endPoint.x !== startPoint.x) {
                            corners.push({ x: startPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                            corners.push({ x: endPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                        }
                        break;
                }
                break;
            case Side.BOTTOM:
                switch (targetSide) {
                    case Side.RIGHT:
                        if ((endPoint.x - startPoint.x) > 0) {
                            corners.push({ x: startPoint.x, y: startPoint.y + options.standardDistance });
                            corners.push({ x: endPoint.x + 1.5 * options.standardDistance, y: startPoint.y + options.standardDistance });
                            corners.push({ x: endPoint.x + 1.5 * options.standardDistance, y: endPoint.y });
                        }
                        else {
                            corners.push({ x: startPoint.x, y: endPoint.y });
                        }
                        break;
                    case Side.LEFT:
                        if ((endPoint.x - startPoint.x) < 0) {
                            corners.push({ x: startPoint.x, y: startPoint.y + options.standardDistance });
                            corners.push({ x: endPoint.x - 1.5 * options.standardDistance, y: startPoint.y + options.standardDistance });
                            corners.push({ x: endPoint.x - 1.5 * options.standardDistance, y: endPoint.y });
                        }
                        else {
                            corners.push({ x: startPoint.x, y: endPoint.y });
                        }
                        break;
                    default:
                        endPoint = targetAnchors.get(Side.TOP);
                        if (endPoint.x !== startPoint.x) {
                            corners.push({ x: startPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                            corners.push({ x: endPoint.x, y: (startPoint.y + endPoint.y) / 2 });
                        }
                        break;
                }
                break;
        }
        return corners;
    };
    ManhattanEdgeRouter.prototype.getBestConnectionAnchors = function (edge, sourceAnchors, targetAnchors, options) {
        // distance is enough
        var sourcePoint = sourceAnchors.get(Side.RIGHT);
        var targetPoint = targetAnchors.get(Side.LEFT);
        if ((targetPoint.x - sourcePoint.x) > options.standardDistance)
            return { source: Side.RIGHT, target: Side.LEFT };
        sourcePoint = sourceAnchors.get(Side.LEFT);
        targetPoint = targetAnchors.get(Side.RIGHT);
        if ((sourcePoint.x - targetPoint.x) > options.standardDistance)
            return { source: Side.LEFT, target: Side.RIGHT };
        sourcePoint = sourceAnchors.get(Side.TOP);
        targetPoint = targetAnchors.get(Side.BOTTOM);
        if ((sourcePoint.y - targetPoint.y) > options.standardDistance)
            return { source: Side.TOP, target: Side.BOTTOM };
        sourcePoint = sourceAnchors.get(Side.BOTTOM);
        targetPoint = targetAnchors.get(Side.TOP);
        if ((targetPoint.y - sourcePoint.y) > options.standardDistance)
            return { source: Side.BOTTOM, target: Side.TOP };
        // One additional point
        sourcePoint = sourceAnchors.get(Side.RIGHT);
        targetPoint = targetAnchors.get(Side.TOP);
        if (((targetPoint.x - sourcePoint.x) > 0.5 * options.standardDistance) && ((targetPoint.y - sourcePoint.y) > options.standardDistance))
            return { source: Side.RIGHT, target: Side.TOP };
        targetPoint = targetAnchors.get(Side.BOTTOM);
        if (((targetPoint.x - sourcePoint.x) > 0.5 * options.standardDistance) && ((sourcePoint.y - targetPoint.y) > options.standardDistance))
            return { source: Side.RIGHT, target: Side.BOTTOM };
        sourcePoint = sourceAnchors.get(Side.LEFT);
        targetPoint = targetAnchors.get(Side.BOTTOM);
        if (((sourcePoint.x - targetPoint.x) > 0.5 * options.standardDistance) && ((sourcePoint.y - targetPoint.y) > options.standardDistance))
            return { source: Side.LEFT, target: Side.BOTTOM };
        targetPoint = targetAnchors.get(Side.TOP);
        if (((sourcePoint.x - targetPoint.x) > 0.5 * options.standardDistance) && ((targetPoint.y - sourcePoint.y) > options.standardDistance))
            return { source: Side.LEFT, target: Side.TOP };
        sourcePoint = sourceAnchors.get(Side.TOP);
        targetPoint = targetAnchors.get(Side.RIGHT);
        if (((sourcePoint.y - targetPoint.y) > 0.5 * options.standardDistance) && ((sourcePoint.x - targetPoint.x) > options.standardDistance))
            return { source: Side.TOP, target: Side.RIGHT };
        targetPoint = targetAnchors.get(Side.LEFT);
        if (((sourcePoint.y - targetPoint.y) > 0.5 * options.standardDistance) && ((targetPoint.x - sourcePoint.x) > options.standardDistance))
            return { source: Side.TOP, target: Side.LEFT };
        sourcePoint = sourceAnchors.get(Side.BOTTOM);
        targetPoint = targetAnchors.get(Side.RIGHT);
        if (((targetPoint.y - sourcePoint.y) > 0.5 * options.standardDistance) && ((sourcePoint.x - targetPoint.x) > options.standardDistance))
            return { source: Side.BOTTOM, target: Side.RIGHT };
        targetPoint = targetAnchors.get(Side.LEFT);
        if (((targetPoint.y - sourcePoint.y) > 0.5 * options.standardDistance) && ((targetPoint.x - sourcePoint.x) > options.standardDistance))
            return { source: Side.BOTTOM, target: Side.LEFT };
        // Two points
        // priority NN >> EE >> NE >> NW >> SE >> SW
        sourcePoint = sourceAnchors.get(Side.TOP);
        targetPoint = targetAnchors.get(Side.TOP);
        if (!includes(targetAnchors.bounds, sourcePoint) && !includes(sourceAnchors.bounds, targetPoint)) {
            if ((sourcePoint.y - targetPoint.y) < 0) {
                if (Math.abs(sourcePoint.x - targetPoint.x) > ((sourceAnchors.bounds.width + options.standardDistance) / 2))
                    return { source: Side.TOP, target: Side.TOP };
            }
            else {
                if (Math.abs(sourcePoint.x - targetPoint.x) > (targetAnchors.bounds.width / 2))
                    return { source: Side.TOP, target: Side.TOP };
            }
        }
        sourcePoint = sourceAnchors.get(Side.RIGHT);
        targetPoint = targetAnchors.get(Side.RIGHT);
        if (!includes(targetAnchors.bounds, sourcePoint) && !includes(sourceAnchors.bounds, targetPoint)) {
            if ((sourcePoint.x - targetPoint.x) > 0) {
                if (Math.abs(sourcePoint.y - targetPoint.y) > ((sourceAnchors.bounds.height + options.standardDistance) / 2))
                    return { source: Side.RIGHT, target: Side.RIGHT };
            }
            else if (Math.abs(sourcePoint.y - targetPoint.y) > (targetAnchors.bounds.height / 2))
                return { source: Side.RIGHT, target: Side.RIGHT };
        }
        // Secondly, judge NE NW is available
        sourcePoint = sourceAnchors.get(Side.TOP);
        targetPoint = targetAnchors.get(Side.RIGHT);
        if (!includes(targetAnchors.bounds, sourcePoint) && !includes(sourceAnchors.bounds, targetPoint))
            return { source: Side.TOP, target: Side.RIGHT };
        targetPoint = targetAnchors.get(Side.LEFT);
        if (!includes(targetAnchors.bounds, sourcePoint) && !includes(sourceAnchors.bounds, targetPoint))
            return { source: Side.TOP, target: Side.LEFT };
        // Finally, judge SE SW is available
        sourcePoint = sourceAnchors.get(Side.BOTTOM);
        targetPoint = targetAnchors.get(Side.RIGHT);
        if (!includes(targetAnchors.bounds, sourcePoint) && !includes(sourceAnchors.bounds, targetPoint))
            return { source: Side.BOTTOM, target: Side.RIGHT };
        targetPoint = targetAnchors.get(Side.LEFT);
        if (!includes(targetAnchors.bounds, sourcePoint) && !includes(sourceAnchors.bounds, targetPoint))
            return { source: Side.BOTTOM, target: Side.LEFT };
        // Only to return to the
        return { source: Side.RIGHT, target: Side.BOTTOM };
    };
    ManhattanEdgeRouter.KIND = 'manhattan';
    return ManhattanEdgeRouter;
}(LinearEdgeRouter));
export { ManhattanEdgeRouter };
//# sourceMappingURL=manhattan-edge-router.js.map