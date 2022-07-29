var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { DIAMOND_ANCHOR_KIND, ELLIPTIC_ANCHOR_KIND, RECTANGULAR_ANCHOR_KIND, EllipseAnchor, RectangleAnchor, ManhattanDiamondAnchor, } from "sprotty";
import { LibavoidRouter } from "./libavoid-router";
var LibavoidEllipseAnchor = /** @class */ (function (_super) {
    __extends(LibavoidEllipseAnchor, _super);
    function LibavoidEllipseAnchor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LibavoidEllipseAnchor.prototype, "kind", {
        get: function () {
            return LibavoidRouter.KIND + ":" + ELLIPTIC_ANCHOR_KIND;
        },
        enumerable: false,
        configurable: true
    });
    return LibavoidEllipseAnchor;
}(EllipseAnchor));
export { LibavoidEllipseAnchor };
var LibavoidRectangleAnchor = /** @class */ (function (_super) {
    __extends(LibavoidRectangleAnchor, _super);
    function LibavoidRectangleAnchor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LibavoidRectangleAnchor.prototype, "kind", {
        get: function () {
            return LibavoidRouter.KIND + ":" + RECTANGULAR_ANCHOR_KIND;
        },
        enumerable: false,
        configurable: true
    });
    return LibavoidRectangleAnchor;
}(RectangleAnchor));
export { LibavoidRectangleAnchor };
// Use ManhattanDiamondAnchor instead DiamondAnchor, because it calculates
// lines to diamond sides, not rectangle around diamond
var LibavoidDiamondAnchor = /** @class */ (function (_super) {
    __extends(LibavoidDiamondAnchor, _super);
    function LibavoidDiamondAnchor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(LibavoidDiamondAnchor.prototype, "kind", {
        get: function () {
            return LibavoidRouter.KIND + ":" + DIAMOND_ANCHOR_KIND;
        },
        enumerable: false,
        configurable: true
    });
    return LibavoidDiamondAnchor;
}(ManhattanDiamondAnchor));
export { LibavoidDiamondAnchor };
//# sourceMappingURL=libavoid-router-anchors.js.map