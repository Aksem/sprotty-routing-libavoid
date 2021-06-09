/********************************************************************************
 * Copyright (c) 2018 TypeFox and others.
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
import { SChildElement } from 'sprotty/src/base/model/smodel';
import { combine, EMPTY_BOUNDS } from 'sprotty/src/utils/geometry';
import { SShapeElement } from 'sprotty/src/features/bounds/model';
import { deletableFeature } from 'sprotty/src/features/edit/delete';
import { selectFeature } from 'sprotty/src/features/select/model';
import { hoverFeedbackFeature } from 'sprotty/src/features/hover/model';
import { moveFeature } from 'sprotty/src/features//move/model';
var SRoutableElement = /** @class */ (function (_super) {
    __extends(SRoutableElement, _super);
    function SRoutableElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.routingPoints = [];
        return _this;
    }
    Object.defineProperty(SRoutableElement.prototype, "source", {
        get: function () {
            return this.index.getById(this.sourceId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SRoutableElement.prototype, "target", {
        get: function () {
            return this.index.getById(this.targetId);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SRoutableElement.prototype, "bounds", {
        get: function () {
            // this should also work for splines, which have the convex hull property
            return this.routingPoints.reduce(function (bounds, routingPoint) { return combine(bounds, {
                x: routingPoint.x,
                y: routingPoint.y,
                width: 0,
                height: 0
            }); }, EMPTY_BOUNDS);
        },
        enumerable: false,
        configurable: true
    });
    return SRoutableElement;
}(SChildElement));
export { SRoutableElement };
export var connectableFeature = Symbol('connectableFeature');
export function isConnectable(element) {
    return element.hasFeature(connectableFeature) && element.canConnect;
}
export function getAbsoluteRouteBounds(model, route) {
    if (route === void 0) { route = model.routingPoints; }
    var bounds = getRouteBounds(route);
    var current = model;
    while (current instanceof SChildElement) {
        var parent_1 = current.parent;
        bounds = parent_1.localToParent(bounds);
        current = parent_1;
    }
    return bounds;
}
export function getRouteBounds(route) {
    var bounds = { x: NaN, y: NaN, width: 0, height: 0 };
    for (var _i = 0, route_1 = route; _i < route_1.length; _i++) {
        var point = route_1[_i];
        if (isNaN(bounds.x)) {
            bounds.x = point.x;
            bounds.y = point.y;
        }
        else {
            if (point.x < bounds.x) {
                bounds.width += bounds.x - point.x;
                bounds.x = point.x;
            }
            else if (point.x > bounds.x + bounds.width) {
                bounds.width = point.x - bounds.x;
            }
            if (point.y < bounds.y) {
                bounds.height += bounds.y - point.y;
                bounds.y = point.y;
            }
            else if (point.y > bounds.y + bounds.height) {
                bounds.height = point.y - bounds.y;
            }
        }
    }
    return bounds;
}
/**
 * A connectable element is one that can have outgoing and incoming edges, i.e. it can be the source
 * or target element of an edge. There are two kinds of connectable elements: nodes (`SNode`) and
 * ports (`SPort`). A node represents a main entity, while a port is a connection point inside a node.
 */
var SConnectableElement = /** @class */ (function (_super) {
    __extends(SConnectableElement, _super);
    function SConnectableElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.strokeWidth = 0;
        return _this;
    }
    Object.defineProperty(SConnectableElement.prototype, "incomingEdges", {
        /**
         * The incoming edges of this connectable element. They are resolved by the index, which must
         * be an `SGraphIndex`.
         */
        get: function () {
            return this.index.getIncomingEdges(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SConnectableElement.prototype, "outgoingEdges", {
        /**
         * The outgoing edges of this connectable element. They are resolved by the index, which must
         * be an `SGraphIndex`.
         */
        get: function () {
            return this.index.getOutgoingEdges(this);
        },
        enumerable: false,
        configurable: true
    });
    SConnectableElement.prototype.canConnect = function (routable, role) {
        return true;
    };
    return SConnectableElement;
}(SShapeElement));
export { SConnectableElement };
var SRoutingHandle = /** @class */ (function (_super) {
    __extends(SRoutingHandle, _super);
    function SRoutingHandle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** Whether the routing point is being dragged. */
        _this.editMode = false;
        _this.hoverFeedback = false;
        _this.selected = false;
        return _this;
    }
    /**
     * SRoutingHandles are created using the constructor, so we hard-wire the
     * default features
     */
    SRoutingHandle.prototype.hasFeature = function (feature) {
        return SRoutingHandle.DEFAULT_FEATURES.indexOf(feature) !== -1;
    };
    SRoutingHandle.DEFAULT_FEATURES = [selectFeature, moveFeature, hoverFeedbackFeature];
    return SRoutingHandle;
}(SChildElement));
export { SRoutingHandle };
var SDanglingAnchor = /** @class */ (function (_super) {
    __extends(SDanglingAnchor, _super);
    function SDanglingAnchor() {
        var _this = _super.call(this) || this;
        _this.type = 'dangling-anchor';
        _this.size = { width: 0, height: 0 };
        return _this;
    }
    SDanglingAnchor.DEFAULT_FEATURES = [deletableFeature];
    return SDanglingAnchor;
}(SConnectableElement));
export { SDanglingAnchor };
export var edgeInProgressID = 'edge-in-progress';
export var edgeInProgressTargetHandleID = edgeInProgressID + '-target-anchor';
//# sourceMappingURL=model.js.map