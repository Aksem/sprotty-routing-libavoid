var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AvoidLib } from "libavoid-js";
import { Directions, LibavoidEdge, LibavoidRouter, RouteType, } from "./libavoid-router";
import { LibavoidDiamondAnchor, LibavoidEllipseAnchor, LibavoidRectangleAnchor, } from "./libavoid-router-anchors";
export function load() {
    return __awaiter(this, arguments, void 0, function* (filePath = undefined) {
        yield AvoidLib.load(filePath);
    });
}
export { LibavoidRouter, LibavoidEdge, RouteType, Directions, LibavoidEllipseAnchor, LibavoidDiamondAnchor, LibavoidRectangleAnchor, };
//# sourceMappingURL=index.js.map