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
import { DIAMOND_ANCHOR_KIND, ELLIPTIC_ANCHOR_KIND, RECTANGULAR_ANCHOR_KIND, EllipseAnchor, RectangleAnchor, DiamondAnchor, } from "sprotty";
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
}(DiamondAnchor));
export { LibavoidDiamondAnchor };
//# sourceMappingURL=libavoid-router-anchors.js.map