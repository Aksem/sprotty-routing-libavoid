import { DIAMOND_ANCHOR_KIND, ELLIPTIC_ANCHOR_KIND, RECTANGULAR_ANCHOR_KIND, EllipseAnchor, RectangleAnchor, ManhattanDiamondAnchor, } from "sprotty";
import { LibavoidRouter } from "./libavoid-router";
export class LibavoidEllipseAnchor extends EllipseAnchor {
    get kind() {
        return LibavoidRouter.KIND + ":" + ELLIPTIC_ANCHOR_KIND;
    }
}
export class LibavoidRectangleAnchor extends RectangleAnchor {
    get kind() {
        return LibavoidRouter.KIND + ":" + RECTANGULAR_ANCHOR_KIND;
    }
}
// Use ManhattanDiamondAnchor instead DiamondAnchor, because it calculates
// lines to diamond sides, not rectangle around diamond
export class LibavoidDiamondAnchor extends ManhattanDiamondAnchor {
    get kind() {
        return LibavoidRouter.KIND + ":" + DIAMOND_ANCHOR_KIND;
    }
}
//# sourceMappingURL=libavoid-router-anchors.js.map