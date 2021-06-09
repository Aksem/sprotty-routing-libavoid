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
import { center, PointToPointLine, intersection, subtract } from "sprotty/src/utils/geometry";
import { RECTANGULAR_ANCHOR_KIND, DIAMOND_ANCHOR_KIND, ELLIPTIC_ANCHOR_KIND } from "sprotty/src/features/routing/anchor";
import { ManhattanEdgeRouter } from "./manhattan-edge-router";
import { injectable } from "inversify";
var ManhattanRectangularAnchor = /** @class */ (function () {
    function ManhattanRectangularAnchor() {
    }
    ManhattanRectangularAnchor_1 = ManhattanRectangularAnchor;
    Object.defineProperty(ManhattanRectangularAnchor.prototype, "kind", {
        get: function () {
            return ManhattanRectangularAnchor_1.KIND;
        },
        enumerable: false,
        configurable: true
    });
    ManhattanRectangularAnchor.prototype.getAnchor = function (connectable, refPoint, offset) {
        var b = connectable.bounds;
        if (b.width <= 0 || b.height <= 0) {
            return b;
        }
        var bounds = {
            x: b.x - offset,
            y: b.y - offset,
            width: b.width + 2 * offset,
            height: b.height + 2 * offset
        };
        if (refPoint.x >= bounds.x && bounds.x + bounds.width >= refPoint.x) {
            if (refPoint.y < bounds.y + 0.5 * bounds.height)
                return { x: refPoint.x, y: bounds.y };
            else
                return { x: refPoint.x, y: bounds.y + bounds.height };
        }
        if (refPoint.y >= bounds.y && bounds.y + bounds.height >= refPoint.y) {
            if (refPoint.x < bounds.x + 0.5 * bounds.width)
                return { x: bounds.x, y: refPoint.y };
            else
                return { x: bounds.x + bounds.width, y: refPoint.y };
        }
        return center(bounds);
    };
    var ManhattanRectangularAnchor_1;
    ManhattanRectangularAnchor.KIND = ManhattanEdgeRouter.KIND + ':' + RECTANGULAR_ANCHOR_KIND;
    ManhattanRectangularAnchor = ManhattanRectangularAnchor_1 = __decorate([
        injectable()
    ], ManhattanRectangularAnchor);
    return ManhattanRectangularAnchor;
}());
export { ManhattanRectangularAnchor };
var ManhattanDiamondAnchor = /** @class */ (function () {
    function ManhattanDiamondAnchor() {
    }
    ManhattanDiamondAnchor_1 = ManhattanDiamondAnchor;
    Object.defineProperty(ManhattanDiamondAnchor.prototype, "kind", {
        get: function () {
            return ManhattanDiamondAnchor_1.KIND;
        },
        enumerable: false,
        configurable: true
    });
    ManhattanDiamondAnchor.prototype.getAnchor = function (connectable, refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var b = connectable.bounds;
        if (b.width <= 0 || b.height <= 0) {
            return b;
        }
        var bounds = {
            x: b.x - offset,
            y: b.y - offset,
            width: b.width + 2 * offset,
            height: b.height + 2 * offset
        };
        var c = center(bounds);
        var outline = undefined;
        var refLine = undefined;
        if (refPoint.x >= bounds.x && refPoint.x <= bounds.x + bounds.width) {
            if (bounds.x + 0.5 * bounds.width >= refPoint.x) {
                refLine = new PointToPointLine(refPoint, { x: refPoint.x, y: c.y });
                if (refPoint.y < c.y)
                    outline = new PointToPointLine({ x: bounds.x, y: c.y }, { x: c.x, y: bounds.y });
                else
                    outline = new PointToPointLine({ x: bounds.x, y: c.y }, { x: c.x, y: bounds.y + bounds.height });
            }
            else {
                refLine = new PointToPointLine(refPoint, { x: refPoint.x, y: c.y });
                if (refPoint.y < c.y)
                    outline = new PointToPointLine({ x: bounds.x + bounds.width, y: c.y }, { x: c.x, y: bounds.y });
                else
                    outline = new PointToPointLine({ x: bounds.x + bounds.width, y: c.y }, { x: c.x, y: bounds.y + bounds.height });
            }
        }
        else if (refPoint.y >= bounds.y && refPoint.y <= bounds.y + bounds.height) {
            if (bounds.y + 0.5 * bounds.height >= refPoint.y) {
                refLine = new PointToPointLine(refPoint, { x: c.x, y: refPoint.y });
                if (refPoint.x < c.x)
                    outline = new PointToPointLine({ x: bounds.x, y: c.y }, { x: c.x, y: bounds.y });
                else
                    outline = new PointToPointLine({ x: bounds.x + bounds.width, y: c.y }, { x: c.x, y: bounds.y });
            }
            else {
                refLine = new PointToPointLine(refPoint, { x: c.x, y: refPoint.y });
                if (refPoint.x < c.x)
                    outline = new PointToPointLine({ x: bounds.x, y: c.y }, { x: c.x, y: bounds.y + bounds.height });
                else
                    outline = new PointToPointLine({ x: bounds.x + bounds.width, y: c.y }, { x: c.x, y: bounds.y + bounds.height });
            }
        }
        if (!!refLine && !!outline)
            return intersection(outline, refLine);
        else
            return c;
    };
    var ManhattanDiamondAnchor_1;
    ManhattanDiamondAnchor.KIND = ManhattanEdgeRouter.KIND + ':' + DIAMOND_ANCHOR_KIND;
    ManhattanDiamondAnchor = ManhattanDiamondAnchor_1 = __decorate([
        injectable()
    ], ManhattanDiamondAnchor);
    return ManhattanDiamondAnchor;
}());
export { ManhattanDiamondAnchor };
var ManhattanEllipticAnchor = /** @class */ (function () {
    function ManhattanEllipticAnchor() {
    }
    ManhattanEllipticAnchor_1 = ManhattanEllipticAnchor;
    Object.defineProperty(ManhattanEllipticAnchor.prototype, "kind", {
        get: function () {
            return ManhattanEllipticAnchor_1.KIND;
        },
        enumerable: false,
        configurable: true
    });
    ManhattanEllipticAnchor.prototype.getAnchor = function (connectable, refPoint, offset) {
        if (offset === void 0) { offset = 0; }
        var b = connectable.bounds;
        if (b.width <= 0 || b.height <= 0) {
            return b;
        }
        var bounds = {
            x: b.x - offset,
            y: b.y - offset,
            width: b.width + 2 * offset,
            height: b.height + 2 * offset
        };
        var c = center(bounds);
        var refRelative = subtract(refPoint, c);
        var x = c.x;
        var y = c.y;
        if (refPoint.x >= bounds.x && bounds.x + bounds.width >= refPoint.x) {
            x += refRelative.x;
            var dy = 0.5 * bounds.height * Math.sqrt(1 - (refRelative.x * refRelative.x) / (0.25 * bounds.width * bounds.width));
            if (refRelative.y < 0)
                y -= dy;
            else
                y += dy;
        }
        else if (refPoint.y >= bounds.y && bounds.y + bounds.height >= refPoint.y) {
            y += refRelative.y;
            var dx = 0.5 * bounds.width * Math.sqrt(1 - (refRelative.y * refRelative.y) / (0.25 * bounds.height * bounds.height));
            if (refRelative.x < 0)
                x -= dx;
            else
                x += dx;
        }
        return { x: x, y: y };
    };
    var ManhattanEllipticAnchor_1;
    ManhattanEllipticAnchor.KIND = ManhattanEdgeRouter.KIND + ':' + ELLIPTIC_ANCHOR_KIND;
    ManhattanEllipticAnchor = ManhattanEllipticAnchor_1 = __decorate([
        injectable()
    ], ManhattanEllipticAnchor);
    return ManhattanEllipticAnchor;
}());
export { ManhattanEllipticAnchor };
//# sourceMappingURL=manhattan-anchors.js.map