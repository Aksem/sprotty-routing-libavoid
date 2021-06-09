/********************************************************************************
 * Copyright (c) 2020 TypeFox and others.
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
import 'mocha';
import { expect } from "chai";
import { SModelRoot } from 'sprotty/src/base/model/smodel';
import { SShapeElement } from 'sprotty/src/features/bounds/model';
import { SRoutableElement, getAbsoluteRouteBounds } from './model';
describe('getAbsoluteRouteBounds', function () {
    function createModel() {
        var root = new SModelRoot();
        var node1 = new TestNode();
        node1.bounds = { x: 100, y: 100, width: 100, height: 100 };
        root.add(node1);
        var edge1 = new TestEdge();
        edge1.routingPoints = [
            { x: 10, y: 30 },
            { x: 20, y: 10 },
            { x: 40, y: 20 }
        ];
        node1.add(edge1);
        return root;
    }
    it('should compute the absolute bounds of a routable element', function () {
        var model = createModel();
        var routable = model.children[0].children[0];
        expect(getAbsoluteRouteBounds(routable)).to.deep.equal({
            x: 110, y: 110, width: 30, height: 20
        });
    });
});
var TestNode = /** @class */ (function (_super) {
    __extends(TestNode, _super);
    function TestNode() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TestNode;
}(SShapeElement));
var TestEdge = /** @class */ (function (_super) {
    __extends(TestEdge, _super);
    function TestEdge() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TestEdge;
}(SRoutableElement));
//# sourceMappingURL=model.spec.js.map