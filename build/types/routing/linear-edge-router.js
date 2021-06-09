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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { inject, injectable } from "inversify";
import { AvoidLib } from 'libavoid-js';
import { translateBounds, translatePoint } from "sprotty/src/base/model/smodel-utils";
import { euclideanDistance, linear } from "sprotty/src/utils/geometry";
import { SDanglingAnchor, SRoutingHandle, edgeInProgressID, edgeInProgressTargetHandleID } from "../routing/model";
import { AnchorComputerRegistry } from "sprotty/src/features/routing/anchor";
import { SConnectableElement } from "./model";
export var Side;
(function (Side) {
    Side[Side["RIGHT"] = 0] = "RIGHT";
    Side[Side["LEFT"] = 1] = "LEFT";
    Side[Side["TOP"] = 2] = "TOP";
    Side[Side["BOTTOM"] = 3] = "BOTTOM";
})(Side || (Side = {}));
var DefaultAnchors = /** @class */ (function () {
    function DefaultAnchors(element, edgeParent, kind) {
        this.element = element;
        this.kind = kind;
        var bounds = element.bounds;
        this.bounds = translateBounds(bounds, element.parent, edgeParent);
        this.left = { x: this.bounds.x, y: this.bounds.y + 0.5 * this.bounds.height, kind: kind };
        this.right = { x: this.bounds.x + this.bounds.width, y: this.bounds.y + 0.5 * this.bounds.height, kind: kind };
        this.top = { x: this.bounds.x + 0.5 * this.bounds.width, y: this.bounds.y, kind: kind };
        this.bottom = { x: this.bounds.x + 0.5 * this.bounds.width, y: this.bounds.y + this.bounds.height, kind: kind };
    }
    DefaultAnchors.prototype.get = function (side) {
        return this[Side[side].toLowerCase()];
    };
    DefaultAnchors.prototype.getNearestSide = function (point) {
        var leftDistance = euclideanDistance(point, this.left);
        var rightDistance = euclideanDistance(point, this.right);
        var topDistance = euclideanDistance(point, this.top);
        var bottomDistance = euclideanDistance(point, this.bottom);
        var currentNearestSide = Side.LEFT;
        var currentMinDist = leftDistance;
        if (rightDistance < currentMinDist) {
            currentMinDist = rightDistance;
            currentNearestSide = Side.RIGHT;
        }
        if (topDistance < currentMinDist) {
            currentMinDist = topDistance;
            currentNearestSide = Side.TOP;
        }
        if (bottomDistance < currentMinDist) {
            currentMinDist = bottomDistance;
            currentNearestSide = Side.BOTTOM;
        }
        return currentNearestSide;
    };
    return DefaultAnchors;
}());
export { DefaultAnchors };
var LinearEdgeRouter = /** @class */ (function () {
    function LinearEdgeRouter() {
    }
    LinearEdgeRouter.prototype.pointAt = function (edge, t) {
        var segments = this.calculateSegment(edge, t);
        if (!segments)
            return undefined;
        var segmentStart = segments.segmentStart, segmentEnd = segments.segmentEnd, lambda = segments.lambda;
        return linear(segmentStart, segmentEnd, lambda);
    };
    LinearEdgeRouter.prototype.derivativeAt = function (edge, t) {
        var segments = this.calculateSegment(edge, t);
        if (!segments)
            return undefined;
        var segmentStart = segments.segmentStart, segmentEnd = segments.segmentEnd;
        return {
            x: segmentEnd.x - segmentStart.x,
            y: segmentEnd.y - segmentStart.y
        };
    };
    LinearEdgeRouter.prototype.calculateSegment = function (edge, t) {
        if (t < 0 || t > 1)
            return undefined;
        var routedPoints = this.route(edge);
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
            if (segmentLengths[i] > 1E-8) {
                if (newLength >= tAsLenght) {
                    var lambda = Math.max(0, (tAsLenght - currentLenght)) / segmentLengths[i];
                    return {
                        segmentStart: routedPoints[i],
                        segmentEnd: routedPoints[i + 1],
                        lambda: lambda
                    };
                }
            }
            currentLenght = newLength;
        }
        return {
            segmentEnd: routedPoints.pop(),
            segmentStart: routedPoints.pop(),
            lambda: 1
        };
    };
    LinearEdgeRouter.prototype.addHandle = function (edge, kind, type, routingPointIndex) {
        var handle = new SRoutingHandle();
        handle.kind = kind;
        handle.pointIndex = routingPointIndex;
        handle.type = type;
        if (kind === 'target' && edge.id === edgeInProgressID)
            handle.id = edgeInProgressTargetHandleID;
        edge.add(handle);
        return handle;
    };
    LinearEdgeRouter.prototype.getHandlePosition = function (edge, route, handle) {
        switch (handle.kind) {
            case 'source':
                if (edge.source instanceof SDanglingAnchor)
                    return edge.source.position;
                else
                    return route[0];
            case 'target':
                if (edge.target instanceof SDanglingAnchor)
                    return edge.target.position;
                else {
                    return route[route.length - 1];
                }
            default:
                var position = this.getInnerHandlePosition(edge, route, handle);
                if (position !== undefined)
                    return position;
                if (handle.pointIndex >= 0 && handle.pointIndex < edge.routingPoints.length)
                    return edge.routingPoints[handle.pointIndex];
        }
        return undefined;
    };
    LinearEdgeRouter.prototype.findRouteSegment = function (edge, route, handleIndex) {
        var getIndex = function (rp) {
            if (rp.pointIndex !== undefined)
                return rp.pointIndex;
            else if (rp.kind === 'target')
                return edge.routingPoints.length;
            else
                return -2;
        };
        var start, end;
        for (var _i = 0, route_1 = route; _i < route_1.length; _i++) {
            var rp = route_1[_i];
            var i = getIndex(rp);
            if (i <= handleIndex && (start === undefined || i > getIndex(start)))
                start = rp;
            if (i > handleIndex && (end === undefined || i < getIndex(end)))
                end = rp;
        }
        return { start: start, end: end };
    };
    LinearEdgeRouter.prototype.getTranslatedAnchor = function (connectable, refPoint, refContainer, edge, anchorCorrection) {
        if (anchorCorrection === void 0) { anchorCorrection = 0; }
        var translatedRefPoint = translatePoint(refPoint, refContainer, connectable.parent);
        var anchorComputer = this.getAnchorComputer(connectable);
        var strokeCorrection = 0.5 * connectable.strokeWidth;
        var anchor = anchorComputer.getAnchor(connectable, translatedRefPoint, anchorCorrection + strokeCorrection);
        return translatePoint(anchor, connectable.parent, edge.parent);
    };
    LinearEdgeRouter.prototype.getAnchorComputer = function (connectable) {
        return this.anchorRegistry.get(this.kind, connectable.anchorKind);
    };
    LinearEdgeRouter.prototype.applyHandleMoves = function (edge, moves) {
        console.log(1);
        var remainingMoves = moves.slice();
        moves.forEach(function (move) {
            var handle = move.handle;
            if (handle.kind === 'source' && !(edge.source instanceof SDanglingAnchor)) {
                // detach source
                var anchor = new SDanglingAnchor();
                anchor.id = edge.id + '_dangling-source';
                anchor.original = edge.source;
                anchor.position = move.toPosition;
                handle.root.add(anchor);
                handle.danglingAnchor = anchor;
                edge.sourceId = anchor.id;
            }
            else if (handle.kind === 'target' && !(edge.target instanceof SDanglingAnchor)) {
                // detach target
                var anchor = new SDanglingAnchor();
                anchor.id = edge.id + '_dangling-target';
                anchor.original = edge.target;
                anchor.position = move.toPosition;
                handle.root.add(anchor);
                handle.danglingAnchor = anchor;
                edge.targetId = anchor.id;
            }
            if (handle.danglingAnchor) {
                handle.danglingAnchor.position = move.toPosition;
                remainingMoves.splice(remainingMoves.indexOf(move), 1);
            }
        });
        if (remainingMoves.length > 0)
            this.applyInnerHandleMoves(edge, remainingMoves);
        this.cleanupRoutingPoints(edge, edge.routingPoints, true, true);
    };
    // is copy pasted from routing.ts, avoid duplicating
    LinearEdgeRouter.prototype.getCenterPoint = function (element) {
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
    LinearEdgeRouter.prototype.cleanupRoutingPoints = function (edge, routingPoints, updateHandles, addRoutingPoints) {
        // const sourceAnchors = new DefaultAnchors(edge.source!, edge.parent, "source");
        // const targetAnchors = new DefaultAnchors(edge.target!, edge.parent, "target");
        var sourceConnectionEnd = this.getCenterPoint(edge.source);
        var targetConnectionEnd = this.getCenterPoint(edge.target);
        var Avoid = AvoidLib.getInstance();
        this.avoidRoutes[edge.id].connRef.setSourceEndpoint(new Avoid.ConnEnd(new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)));
        this.avoidRoutes[edge.id].connRef.setDestEndpoint(new Avoid.ConnEnd(new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)));
        return;
        // this.resetRoutingPointsOnReconnect(edge, routingPoints, updateHandles, sourceAnchors, targetAnchors);
    };
    LinearEdgeRouter.prototype.resetRoutingPointsOnReconnect = function (edge, routingPoints, updateHandles, sourceAnchors, targetAnchors) {
        if (routingPoints.length === 0 || edge.source instanceof SDanglingAnchor || edge.target instanceof SDanglingAnchor) {
            var options = this.getOptions(edge);
            var corners = this.calculateDefaultCorners(edge, sourceAnchors, targetAnchors, options);
            routingPoints.splice.apply(routingPoints, __spreadArrays([0, routingPoints.length], corners));
            if (updateHandles) {
                var maxPointIndex_1 = -2;
                edge.children.forEach(function (child) {
                    if (child instanceof SRoutingHandle) {
                        if (child.kind === 'target')
                            child.pointIndex = routingPoints.length;
                        else if (child.kind === 'line' && child.pointIndex >= routingPoints.length)
                            edge.remove(child);
                        else
                            maxPointIndex_1 = Math.max(child.pointIndex, maxPointIndex_1);
                    }
                });
                for (var i = maxPointIndex_1; i < routingPoints.length - 1; ++i)
                    this.addHandle(edge, 'manhattan-50%', 'volatile-routing-point', i);
            }
            return true;
        }
        return false;
    };
    LinearEdgeRouter.prototype.applyReconnect = function (edge, newSourceId, newTargetId) {
        var hasChanged = false;
        if (newSourceId) {
            var newSource = edge.root.index.getById(newSourceId);
            if (newSource instanceof SConnectableElement) {
                edge.sourceId = newSource.id;
                hasChanged = true;
            }
        }
        if (newTargetId) {
            var newTarget = edge.root.index.getById(newTargetId);
            if (newTarget instanceof SConnectableElement) {
                edge.targetId = newTarget.id;
                hasChanged = true;
            }
        }
        if (hasChanged) {
            // reset attached elements in index
            edge.index.remove(edge);
            edge.index.add(edge);
            if (this.getSelfEdgeIndex(edge) > -1) {
                edge.routingPoints = [];
                this.cleanupRoutingPoints(edge, edge.routingPoints, true, true);
            }
        }
    };
    LinearEdgeRouter.prototype.takeSnapshot = function (edge) {
        return {
            routingPoints: edge.routingPoints.slice(),
            routingHandles: edge.children
                .filter(function (child) { return child instanceof SRoutingHandle; })
                .map(function (child) { return child; }),
            routedPoints: this.route(edge),
            router: this,
            source: edge.source,
            target: edge.target
        };
    };
    LinearEdgeRouter.prototype.applySnapshot = function (edge, snapshot) {
        edge.routingPoints = snapshot.routingPoints;
        edge.removeAll(function (child) { return child instanceof SRoutingHandle; });
        edge.routerKind = snapshot.router.kind;
        snapshot.routingHandles.forEach(function (handle) { return edge.add(handle); });
        if (snapshot.source)
            edge.sourceId = snapshot.source.id;
        if (snapshot.target)
            edge.targetId = snapshot.target.id;
        // update index
        edge.root.index.remove(edge);
        edge.root.index.add(edge);
    };
    LinearEdgeRouter.prototype.calculateDefaultCorners = function (edge, sourceAnchors, targetAnchors, options) {
        var selfEdgeIndex = this.getSelfEdgeIndex(edge);
        if (selfEdgeIndex >= 0) {
            var standardDist = options.standardDistance;
            var delta = options.selfEdgeOffset * Math.min(sourceAnchors.bounds.width, sourceAnchors.bounds.height);
            switch (selfEdgeIndex % 4) {
                case 0:
                    return [
                        { x: sourceAnchors.get(Side.RIGHT).x + standardDist, y: sourceAnchors.get(Side.RIGHT).y + delta },
                        { x: sourceAnchors.get(Side.RIGHT).x + standardDist, y: sourceAnchors.get(Side.BOTTOM).y + standardDist },
                        { x: sourceAnchors.get(Side.BOTTOM).x + delta, y: sourceAnchors.get(Side.BOTTOM).y + standardDist },
                    ];
                case 1:
                    return [
                        { x: sourceAnchors.get(Side.BOTTOM).x - delta, y: sourceAnchors.get(Side.BOTTOM).y + standardDist },
                        { x: sourceAnchors.get(Side.LEFT).x - standardDist, y: sourceAnchors.get(Side.BOTTOM).y + standardDist },
                        { x: sourceAnchors.get(Side.LEFT).x - standardDist, y: sourceAnchors.get(Side.LEFT).y + delta },
                    ];
                case 2:
                    return [
                        { x: sourceAnchors.get(Side.LEFT).x - standardDist, y: sourceAnchors.get(Side.LEFT).y - delta },
                        { x: sourceAnchors.get(Side.LEFT).x - standardDist, y: sourceAnchors.get(Side.TOP).y - standardDist },
                        { x: sourceAnchors.get(Side.TOP).x - delta, y: sourceAnchors.get(Side.TOP).y - standardDist },
                    ];
                case 3:
                    return [
                        { x: sourceAnchors.get(Side.TOP).x + delta, y: sourceAnchors.get(Side.TOP).y - standardDist },
                        { x: sourceAnchors.get(Side.RIGHT).x + standardDist, y: sourceAnchors.get(Side.TOP).y - standardDist },
                        { x: sourceAnchors.get(Side.RIGHT).x + standardDist, y: sourceAnchors.get(Side.RIGHT).y - delta },
                    ];
            }
        }
        return [];
    };
    LinearEdgeRouter.prototype.getSelfEdgeIndex = function (edge) {
        if (!edge.source || edge.source !== edge.target)
            return -1;
        return edge.source.outgoingEdges
            .filter(function (otherEdge) { return otherEdge.target === edge.source; })
            .indexOf(edge);
    };
    __decorate([
        inject(AnchorComputerRegistry),
        __metadata("design:type", AnchorComputerRegistry)
    ], LinearEdgeRouter.prototype, "anchorRegistry", void 0);
    LinearEdgeRouter = __decorate([
        injectable()
    ], LinearEdgeRouter);
    return LinearEdgeRouter;
}());
export { LinearEdgeRouter };
//# sourceMappingURL=linear-edge-router.js.map