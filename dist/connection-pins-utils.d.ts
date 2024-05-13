import { Avoid as AvoidInterface } from "libavoid-js";
import { SConnectableElementImpl, SParentElementImpl, IAnchorComputer } from "sprotty";
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
export declare function getRelativeAnchor(connectable: SConnectableElementImpl, refPoint: Point, refContainer: SParentElementImpl, anchorComputer: IAnchorComputer, anchorCorrection?: number): Point;
export declare function addConnectionPinsToShape(shapeRef: AvoidInterface["ShapeRef"], child: SConnectableElementImpl, centerPoint: Point, anchorComputer: IAnchorComputer, Avoid: AvoidInterface): ShapeConnPinsInfo;
export declare function getCenterPoint(element: SConnectableElementImpl): {
    x: number;
    y: number;
};
export declare function updateConnPinsOnShapeResize(child: SConnectableElementImpl, shapeInfo: ShapeInfo, anchorComputer: IAnchorComputer, Avoid: AvoidInterface): void;
//# sourceMappingURL=connection-pins-utils.d.ts.map