import { translatePoint, } from "sprotty";
import { Directions } from "./libavoid-router-options";
export function getRelativeAnchor(connectable, refPoint, refContainer, anchorComputer, anchorCorrection = 0) {
    const translatedRefPoint = translatePoint(refPoint, refContainer, connectable.parent);
    const strokeCorrection = 0.5 * connectable.strokeWidth;
    const anchor = anchorComputer.getAnchor(connectable, translatedRefPoint, anchorCorrection + strokeCorrection);
    return {
        x: anchor.x - connectable.bounds.x,
        y: anchor.y - connectable.bounds.y,
    };
}
export function addConnectionPinsToShape(shapeRef, child, centerPoint, anchorComputer, Avoid) {
    // let AnchorComputer compute anchors in all four directions from shape and use these
    // points as anchors(shape connection pins) in libavoid
    // - left
    let leftAnchor = getRelativeAnchor(child, { x: centerPoint.x - child.bounds.width, y: centerPoint.y }, child.parent, anchorComputer);
    // TODO: check also y?
    const leftIsOnSide = Math.abs(leftAnchor.x) < 0.01;
    const shapeLeftPin = new Avoid.ShapeConnectionPin(shapeRef, 1, leftIsOnSide ? 0 : leftAnchor.x, leftIsOnSide ? 0.5 : leftAnchor.y, leftIsOnSide, 0, Directions.Left);
    shapeLeftPin.setExclusive(false);
    // - right
    let rightAnchor = getRelativeAnchor(child, { x: centerPoint.x + child.bounds.width, y: centerPoint.y }, child.parent, anchorComputer);
    // TODO: check also y?
    const rightIsOnSide = Math.abs(rightAnchor.x - child.bounds.width) < 0.01;
    const shapeRightPin = new Avoid.ShapeConnectionPin(shapeRef, 1, rightIsOnSide ? 1 : rightAnchor.x, rightIsOnSide ? 0.5 : rightAnchor.y, rightIsOnSide, 0, Directions.Right);
    shapeRightPin.setExclusive(false);
    // - top
    let topAnchor = getRelativeAnchor(child, { x: centerPoint.x, y: centerPoint.y - child.bounds.height }, child.parent, anchorComputer);
    // TODO: check also x?
    const topIsOnSide = Math.abs(topAnchor.y) < 0.01;
    const shapeTopPin = new Avoid.ShapeConnectionPin(shapeRef, 1, topIsOnSide ? 0.5 : topAnchor.x, topIsOnSide ? 0 : topAnchor.y, topIsOnSide, 0, Directions.Up);
    shapeTopPin.setExclusive(false);
    // - bottom
    let bottomAnchor = getRelativeAnchor(child, { x: centerPoint.x, y: centerPoint.y + child.bounds.height }, child.parent, anchorComputer);
    // TODO: check also x?
    const bottomIsOnSide = Math.abs(bottomAnchor.y - child.bounds.height) < 0.01;
    const shapeBottomPin = new Avoid.ShapeConnectionPin(shapeRef, 1, bottomIsOnSide ? 0.5 : bottomAnchor.x, bottomIsOnSide ? 1 : bottomAnchor.y, bottomIsOnSide, 0, Directions.Down);
    shapeBottomPin.setExclusive(false);
    // - center for polyline routes
    const shapeCenterPin = new Avoid.ShapeConnectionPin(shapeRef, 2, 0.5, 0.5, true, 0, Directions.All);
    shapeCenterPin.setExclusive(false);
    console.log(child.id, leftAnchor, rightAnchor, bottomAnchor, topAnchor);
    if (!leftIsOnSide || !rightIsOnSide || !bottomIsOnSide || !topIsOnSide) {
        console.log("ERROR !");
    }
    return {
        left: shapeLeftPin,
        leftIsOnSide,
        right: shapeRightPin,
        rightIsOnSide,
        top: shapeTopPin,
        topIsOnSide,
        bottom: shapeBottomPin,
        bottomIsOnSide,
        center: shapeCenterPin,
    };
}
export function getCenterPoint(element) {
    let x = element.bounds.width / 2, y = element.bounds.height / 2;
    let currentElement = element;
    while (currentElement) {
        if (currentElement.position) {
            x += currentElement.position.x;
            y += currentElement.position.y;
        }
        if (!(currentElement.parent && currentElement.parent.id === "graph")) {
            currentElement = currentElement.parent;
        }
        else {
            break;
        }
    }
    return { x, y };
}
export function updateConnPinsOnShapeResize(child, shapeInfo, anchorComputer, Avoid) {
    const centerPoint = getCenterPoint(child);
    if (!shapeInfo.connPins.leftIsOnSide) {
        const leftAnchor = getRelativeAnchor(child, { x: centerPoint.x - child.bounds.width, y: centerPoint.y }, child.parent, anchorComputer);
        shapeInfo.connPins.left.updatePosition(new Avoid.Point(leftAnchor.x, leftAnchor.y));
    }
    if (!shapeInfo.connPins.rightIsOnSide) {
        let rightAnchor = getRelativeAnchor(child, { x: centerPoint.x + child.bounds.width, y: centerPoint.y }, child.parent, anchorComputer);
        shapeInfo.connPins.right.updatePosition(new Avoid.Point(rightAnchor.x, rightAnchor.y));
    }
    if (!shapeInfo.connPins.topIsOnSide) {
        let topAnchor = getRelativeAnchor(child, { x: centerPoint.x, y: centerPoint.y - child.bounds.height }, child.parent, anchorComputer);
        shapeInfo.connPins.top.updatePosition(new Avoid.Point(topAnchor.x, topAnchor.y));
    }
    if (!shapeInfo.connPins.bottomIsOnSide) {
        let bottomAnchor = getRelativeAnchor(child, { x: centerPoint.x, y: centerPoint.y + child.bounds.height }, child.parent, anchorComputer);
        shapeInfo.connPins.bottom.updatePosition(new Avoid.Point(bottomAnchor.x, bottomAnchor.y));
    }
}
//# sourceMappingURL=connection-pins-utils.js.map