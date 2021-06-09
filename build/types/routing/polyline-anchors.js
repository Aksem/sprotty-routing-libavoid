/********************************************************************************
 * Copyright (c) 2019 TypeFox and others.
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
import { ELLIPTIC_ANCHOR_KIND, RECTANGULAR_ANCHOR_KIND, DIAMOND_ANCHOR_KIND } from "sprotty/src/features/routing/anchor";
import { center, almostEquals, PointToPointLine, Diamond, intersection, shiftTowards } from "sprotty/src/utils/geometry";
import { injectable } from "inversify";
import { PolylineEdgeRouter } from "./polyline-edge-router";
var EllipseAnchor = /** @class */ (function () {
    function EllipseAnchor() {
    }
    Object.defineProperty(EllipseAnchor.prototype, "kind", {
        get: function () {
            return PolylineEdgeRouter.KIND + ':' + ELLIPTIC_ANCHOR_KIND;
        },
        enumerable: false,
        configurable: true
    });
    EllipseAnchor.prototype.getAnchor = function (connectable, refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var bounds = connectable.bounds;
        var c = center(bounds);
        var dx = c.x - refPoint.x;
        var dy = c.y - refPoint.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var normX = (dx / distance) || 0;
        var normY = (dy / distance) || 0;
        return {
            x: c.x - normX * (0.5 * bounds.width + offset),
            y: c.y - normY * (0.5 * bounds.height + offset)
        };
    };
    EllipseAnchor = __decorate([
        injectable()
    ], EllipseAnchor);
    return EllipseAnchor;
}());
export { EllipseAnchor };
var RectangleAnchor = /** @class */ (function () {
    function RectangleAnchor() {
    }
    Object.defineProperty(RectangleAnchor.prototype, "kind", {
        get: function () {
            return PolylineEdgeRouter.KIND + ':' + RECTANGULAR_ANCHOR_KIND;
        },
        enumerable: false,
        configurable: true
    });
    RectangleAnchor.prototype.getAnchor = function (connectable, refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var bounds = connectable.bounds;
        var c = center(bounds);
        var finder = new NearestPointFinder(c, refPoint);
        if (!almostEquals(c.y, refPoint.y)) {
            var xTop = this.getXIntersection(bounds.y, c, refPoint);
            if (xTop >= bounds.x && xTop <= bounds.x + bounds.width)
                finder.addCandidate(xTop, bounds.y - offset);
            var xBottom = this.getXIntersection(bounds.y + bounds.height, c, refPoint);
            if (xBottom >= bounds.x && xBottom <= bounds.x + bounds.width)
                finder.addCandidate(xBottom, bounds.y + bounds.height + offset);
        }
        if (!almostEquals(c.x, refPoint.x)) {
            var yLeft = this.getYIntersection(bounds.x, c, refPoint);
            if (yLeft >= bounds.y && yLeft <= bounds.y + bounds.height)
                finder.addCandidate(bounds.x - offset, yLeft);
            var yRight = this.getYIntersection(bounds.x + bounds.width, c, refPoint);
            if (yRight >= bounds.y && yRight <= bounds.y + bounds.height)
                finder.addCandidate(bounds.x + bounds.width + offset, yRight);
        }
        return finder.best;
    };
    RectangleAnchor.prototype.getXIntersection = function (yIntersection, centerPoint, point) {
        var t = (yIntersection - centerPoint.y) / (point.y - centerPoint.y);
        return (point.x - centerPoint.x) * t + centerPoint.x;
    };
    RectangleAnchor.prototype.getYIntersection = function (xIntersection, centerPoint, point) {
        var t = (xIntersection - centerPoint.x) / (point.x - centerPoint.x);
        return (point.y - centerPoint.y) * t + centerPoint.y;
    };
    RectangleAnchor = __decorate([
        injectable()
    ], RectangleAnchor);
    return RectangleAnchor;
}());
export { RectangleAnchor };
var NearestPointFinder = /** @class */ (function () {
    function NearestPointFinder(centerPoint, refPoint) {
        this.centerPoint = centerPoint;
        this.refPoint = refPoint;
        this.currentDist = -1;
    }
    NearestPointFinder.prototype.addCandidate = function (x, y) {
        var dx = this.refPoint.x - x;
        var dy = this.refPoint.y - y;
        var dist = dx * dx + dy * dy;
        if (this.currentDist < 0 || dist < this.currentDist) {
            this.currentBest = {
                x: x,
                y: y
            };
            this.currentDist = dist;
        }
    };
    Object.defineProperty(NearestPointFinder.prototype, "best", {
        get: function () {
            if (this.currentBest === undefined)
                return this.centerPoint;
            else
                return this.currentBest;
        },
        enumerable: false,
        configurable: true
    });
    return NearestPointFinder;
}());
var DiamondAnchor = /** @class */ (function () {
    function DiamondAnchor() {
    }
    Object.defineProperty(DiamondAnchor.prototype, "kind", {
        get: function () {
            return PolylineEdgeRouter.KIND + ':' + DIAMOND_ANCHOR_KIND;
        },
        enumerable: false,
        configurable: true
    });
    DiamondAnchor.prototype.getAnchor = function (connectable, refPoint, offset) {
        var bounds = connectable.bounds;
        var referenceLine = new PointToPointLine(center(bounds), refPoint);
        var closestDiamondSide = new Diamond(bounds).closestSideLine(refPoint);
        var anchorPoint = intersection(closestDiamondSide, referenceLine);
        return shiftTowards(anchorPoint, refPoint, offset);
    };
    DiamondAnchor = __decorate([
        injectable()
    ], DiamondAnchor);
    return DiamondAnchor;
}());
export { DiamondAnchor };
//# sourceMappingURL=polyline-anchors.js.map