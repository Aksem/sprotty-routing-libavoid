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
import { angleBetweenPoints, centerOfLine } from "sprotty/src/utils/geometry"; // center, maxDistance,
import { SRoutingHandle } from "./model";
import { AnchorComputerRegistry } from "sprotty/src/features/routing/anchor";
import { LinearEdgeRouter } from "./linear-edge-router";
var PolylineEdgeRouter = /** @class */ (function (_super) {
    __extends(PolylineEdgeRouter, _super);
    function PolylineEdgeRouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PolylineEdgeRouter_1 = PolylineEdgeRouter;
    Object.defineProperty(PolylineEdgeRouter.prototype, "kind", {
        get: function () {
            return PolylineEdgeRouter_1.KIND;
        },
        enumerable: false,
        configurable: true
    });
    PolylineEdgeRouter.prototype.getOptions = function (edge) {
        return {
            minimalPointDistance: 2,
            removeAngleThreshold: 0.1,
            standardDistance: 20,
            selfEdgeOffset: 0.25
        };
    };
    PolylineEdgeRouter.prototype.route = function (edge) {
        var source = edge.source;
        var target = edge.target;
        if (source === undefined || target === undefined) {
            return [];
        }
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
        //     let sourceAnchor: Point;
        //     let targetAnchor: Point;
        //     const options = this.getOptions(edge);
        //     const routingPoints = edge.routingPoints.length > 0
        //         ? edge.routingPoints
        //         : [];
        //     this.cleanupRoutingPoints(edge, routingPoints, false, false);
        //     const rpCount = routingPoints !== undefined ? routingPoints.length : 0;
        //     if (rpCount === 0) {
        //         // Use the target center as start anchor reference
        //         const startRef = center(target.bounds);
        //         sourceAnchor = this.getTranslatedAnchor(source, startRef, target.parent, edge, edge.sourceAnchorCorrection);
        //         // Use the source center as end anchor reference
        //         const endRef = center(source.bounds);
        //         targetAnchor = this.getTranslatedAnchor(target, endRef, source.parent, edge, edge.targetAnchorCorrection);
        //     } else {
        //         // Use the first routing point as start anchor reference
        //         const p0 = routingPoints[0];
        //         sourceAnchor = this.getTranslatedAnchor(source, p0, edge.parent, edge, edge.sourceAnchorCorrection);
        //         // Use the last routing point as end anchor reference
        //         const pn = routingPoints[rpCount - 1];
        //         targetAnchor = this.getTranslatedAnchor(target, pn, edge.parent, edge, edge.targetAnchorCorrection);
        //     }
        //     const result: RoutedPoint[] = [];
        //     result.push({ kind: 'source', x: sourceAnchor.x, y: sourceAnchor.y });
        //     for (let i = 0; i < rpCount; i++) {
        //         const p = routingPoints[i];
        //         if (i > 0 && i < rpCount - 1
        //             || i === 0 && maxDistance(sourceAnchor, p) >= options.minimalPointDistance + (edge.sourceAnchorCorrection || 0)
        //             || i === rpCount - 1 && maxDistance(p, targetAnchor) >= options.minimalPointDistance + (edge.targetAnchorCorrection || 0)) {
        //             result.push({ kind: 'linear', x: p.x, y: p.y, pointIndex: i });
        //         }
        //     }
        //     result.push({ kind: 'target', x: targetAnchor.x, y: targetAnchor.y });
        //         return this.filterEditModeHandles(result, edge, options);
    };
    /**
     * Remove routed points that are in edit mode and for which the angle between the preceding and
     * following points falls below a threshold.
     */
    PolylineEdgeRouter.prototype.filterEditModeHandles = function (route, edge, options) {
        if (edge.children.length === 0)
            return route;
        var i = 0;
        var _loop_1 = function () {
            var curr = route[i];
            if (curr.pointIndex !== undefined) {
                var handle = edge.children.find(function (child) {
                    return child instanceof SRoutingHandle && child.kind === 'junction' && child.pointIndex === curr.pointIndex;
                });
                if (handle !== undefined && handle.editMode && i > 0 && i < route.length - 1) {
                    var prev = route[i - 1], next = route[i + 1];
                    var prevDiff = { x: prev.x - curr.x, y: prev.y - curr.y };
                    var nextDiff = { x: next.x - curr.x, y: next.y - curr.y };
                    var angle = angleBetweenPoints(prevDiff, nextDiff);
                    if (Math.abs(Math.PI - angle) < options.removeAngleThreshold) {
                        route.splice(i, 1);
                        return "continue";
                    }
                }
            }
            i++;
        };
        while (i < route.length) {
            _loop_1();
        }
        return route;
    };
    PolylineEdgeRouter.prototype.createRoutingHandles = function (edge) {
        var rpCount = edge.routingPoints.length;
        this.addHandle(edge, 'source', 'routing-point', -2);
        this.addHandle(edge, 'line', 'volatile-routing-point', -1);
        for (var i = 0; i < rpCount; i++) {
            this.addHandle(edge, 'junction', 'routing-point', i);
            this.addHandle(edge, 'line', 'volatile-routing-point', i);
        }
        this.addHandle(edge, 'target', 'routing-point', rpCount);
    };
    PolylineEdgeRouter.prototype.getInnerHandlePosition = function (edge, route, handle) {
        if (handle.kind === 'line') {
            var _a = this.findRouteSegment(edge, route, handle.pointIndex), start = _a.start, end = _a.end;
            if (start !== undefined && end !== undefined)
                return centerOfLine(start, end);
        }
        return undefined;
    };
    PolylineEdgeRouter.prototype.applyInnerHandleMoves = function (edge, moves) {
        var _this = this;
        console.log(2);
        moves.forEach(function (move) {
            var handle = move.handle;
            var points = edge.routingPoints;
            var index = handle.pointIndex;
            if (handle.kind === 'line') {
                // Upgrade to a proper routing point
                handle.kind = 'junction';
                handle.type = 'routing-point';
                points.splice(index + 1, 0, move.fromPosition || points[Math.max(index, 0)]);
                edge.children.forEach(function (child) {
                    if (child instanceof SRoutingHandle && (child === handle || child.pointIndex > index))
                        child.pointIndex++;
                });
                _this.addHandle(edge, 'line', 'volatile-routing-point', index);
                _this.addHandle(edge, 'line', 'volatile-routing-point', index + 1);
                index++;
            }
            if (index >= 0 && index < points.length) {
                points[index] = move.toPosition;
            }
        });
    };
    var PolylineEdgeRouter_1;
    PolylineEdgeRouter.KIND = 'polyline';
    __decorate([
        inject(AnchorComputerRegistry),
        __metadata("design:type", AnchorComputerRegistry)
    ], PolylineEdgeRouter.prototype, "anchorRegistry", void 0);
    PolylineEdgeRouter = PolylineEdgeRouter_1 = __decorate([
        injectable()
    ], PolylineEdgeRouter);
    return PolylineEdgeRouter;
}(LinearEdgeRouter));
export { PolylineEdgeRouter };
//# sourceMappingURL=polyline-edge-router.js.map