import { Avoid as AvoidInterface } from "libavoid-js";
import { SConnectableElement, SParentElement, IAnchorComputer } from "sprotty";
import { Point, Bounds } from "sprotty-protocol";
export type ShapeConnPinsInfo = {
    left: AvoidInterface["ShapeConnectionPin"];
    leftIsOnSide: boolean;
    right: AvoidInterface["ShapeConnectionPin"];
    rightIsOnSide: boolean;
    top: AvoidInterface["ShapeConnectionPin"];
    topIsOnSide: boolean;
    bottom: AvoidInterface["ShapeConnectionPin"];
    bottomIsOnSide: boolean;
    center: AvoidInterface["ShapeConnectionPin"];
};
export type ShapeInfo = {
    ref: AvoidInterface["ShapeRef"];
    bounds: Bounds;
    connPins: ShapeConnPinsInfo;
};
export declare function getRelativeAnchor(connectable: SConnectableElement, refPoint: Point, refContainer: SParentElement, anchorComputer: IAnchorComputer, anchorCorrection?: number): Point;
export declare function addConnectionPinsToShape(shapeRef: AvoidInterface["ShapeRef"], child: SConnectableElement, centerPoint: Point, anchorComputer: IAnchorComputer, Avoid: AvoidInterface): ShapeConnPinsInfo;
export declare function getCenterPoint(element: SConnectableElement): {
    x: number;
    y: number;
};
export declare function updateConnPinsOnShapeResize(child: SConnectableElement, shapeInfo: ShapeInfo, anchorComputer: IAnchorComputer, Avoid: AvoidInterface): void;
//# sourceMappingURL=connection-pins-utils.d.ts.map