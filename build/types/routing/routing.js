/********************************************************************************
 * Copyright (c) 2018-2020 TypeFox and others.
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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { AvoidLib } from 'libavoid-js';
import { SRoutableElement, SConnectableElement } from "./model";
import { InstanceRegistry } from "sprotty/src//utils/registry";
import { PolylineEdgeRouter } from "./polyline-edge-router";
import { injectable, multiInject } from "inversify";
import { TYPES } from "sprotty/src/base/types";
import { SParentElement } from "sprotty/src/base/model/smodel";
var EdgeRouterRegistry = /** @class */ (function (_super) {
    __extends(EdgeRouterRegistry, _super);
    function EdgeRouterRegistry(edgeRouters) {
        var _this = _super.call(this) || this;
        _this.renderedTimes = 0;
        var Avoid = AvoidLib.getInstance();
        _this.avoidRouter = new Avoid.Router(Avoid.OrthogonalRouting | Avoid.PolyLineRouting);
        _this.avoidRoutes = {};
        edgeRouters.forEach(function (router) {
            _this.register(router.kind, router);
            router.avoidRouter = _this.avoidRouter;
            router.avoidRoutes = _this.avoidRoutes;
        });
        return _this;
    }
    Object.defineProperty(EdgeRouterRegistry.prototype, "defaultKind", {
        get: function () {
            return PolylineEdgeRouter.KIND;
        },
        enumerable: false,
        configurable: true
    });
    EdgeRouterRegistry.prototype.get = function (kind) {
        return _super.prototype.get.call(this, kind || this.defaultKind);
    };
    EdgeRouterRegistry.prototype.getAllChildren = function (parent) {
        var routables = [];
        var connectables = [];
        for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if (child instanceof SRoutableElement) {
                routables.push(child);
            }
            else if (child instanceof SConnectableElement) {
                connectables.push(child);
            }
            if (child instanceof SParentElement) {
                var children = this.getAllChildren(child);
                routables.push.apply(routables, children.routables);
                connectables.push.apply(connectables, children.connectables);
            }
        }
        return { routables: routables, connectables: connectables };
    };
    EdgeRouterRegistry.prototype.getCenterPoint = function (element) {
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
    EdgeRouterRegistry.prototype.avoidRoutesToEdgeRoutes = function (avoidRoutes) {
        var routes = new EdgeRoutes();
        for (var _i = 0, avoidRoutes_1 = avoidRoutes; _i < avoidRoutes_1.length; _i++) {
            var connection = avoidRoutes_1[_i];
            var sprottyRoute = [];
            var route = connection.connRef.displayRoute();
            for (var i = 0; i < route.size(); i++) {
                var kind = 'linear';
                if (i === 0) {
                    kind = 'source';
                }
                else if (i === route.size() - 1) {
                    kind = 'target';
                }
                sprottyRoute.push({ x: route.get_ps(i).x, y: route.get_ps(i).y, kind: kind, pointIndex: 1 });
            }
            routes.set(connection.child, sprottyRoute);
        }
        return routes;
    };
    EdgeRouterRegistry.prototype.routeAllChildren = function (parent) {
        if (this.renderedTimes < 2) {
            var connections = [];
            var Avoid = AvoidLib.getInstance();
            // const router = new Avoid.Router(Avoid.OrthogonalRouting | Avoid.PolyLineRouting);
            var children = this.getAllChildren(parent);
            for (var _i = 0, _a = children.routables; _i < _a.length; _i++) {
                var child = _a[_i];
                var sourceConnectionEnd = this.getCenterPoint(child.source);
                var targetConnectionEnd = this.getCenterPoint(child.target);
                var connRef = new Avoid.ConnRef(this.avoidRouter, new Avoid.ConnEnd(new Avoid.Point(sourceConnectionEnd.x, sourceConnectionEnd.y)), new Avoid.ConnEnd(new Avoid.Point(targetConnectionEnd.x, targetConnectionEnd.y)));
                var routingType = Avoid.PolyLineRouting;
                if (child.routerKind === 'manhattan') {
                    routingType = Avoid.OrthogonalRouting;
                }
                connRef.setRoutingType(routingType);
                connections.push({ child: child, connRef: connRef });
                this.avoidRoutes[child.id] = { connRef: connRef, child: child };
            }
            for (var _b = 0, _c = children.connectables; _b < _c.length; _b++) {
                var child = _c[_b];
                var centerPoint = this.getCenterPoint(child);
                var rectangle = new Avoid.Rectangle(new Avoid.Point(centerPoint.x, centerPoint.y), child.bounds.width, child.bounds.height);
                new Avoid.ShapeRef(this.avoidRouter, rectangle);
            }
            this.avoidRouter.processTransaction();
            // for (const connection of connections) {
            //     router.deleteConnector(connection.connRef);
            // }
            // Avoid.destroy(router);
            this.renderedTimes += 1;
            return this.avoidRoutesToEdgeRoutes(connections);
        }
        else {
            this.avoidRouter.processTransaction();
            return this.avoidRoutesToEdgeRoutes(Object.values(this.avoidRoutes));
        }
    };
    EdgeRouterRegistry.prototype.route = function (edge, args) {
        if (containsEdgeRoutes(args)) {
            var route = args.edgeRoutes.get(edge);
            if (route) {
                return route;
            }
        }
        var router = this.get(edge.routerKind);
        return router.route(edge);
    };
    EdgeRouterRegistry = __decorate([
        injectable(),
        __param(0, multiInject(TYPES.IEdgeRouter)),
        __metadata("design:paramtypes", [Array])
    ], EdgeRouterRegistry);
    return EdgeRouterRegistry;
}(InstanceRegistry));
export { EdgeRouterRegistry };
export function containsEdgeRoutes(args) {
    return args !== undefined && 'edgeRoutes' in args;
}
var EdgeRoutes = /** @class */ (function () {
    function EdgeRoutes() {
        this._routes = new Map();
    }
    EdgeRoutes.prototype.set = function (routable, route) {
        this._routes.set(routable.id, route);
    };
    EdgeRoutes.prototype.setAll = function (otherRoutes) {
        var _this = this;
        otherRoutes.routes.forEach(function (route, routableId) { return _this._routes.set(routableId, route); });
    };
    EdgeRoutes.prototype.get = function (routable) {
        return this._routes.get(routable.id);
    };
    Object.defineProperty(EdgeRoutes.prototype, "routes", {
        get: function () {
            return this._routes;
        },
        enumerable: false,
        configurable: true
    });
    return EdgeRoutes;
}());
export { EdgeRoutes };
//# sourceMappingURL=routing.js.map