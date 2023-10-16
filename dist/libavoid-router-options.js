export var RouteType;
(function (RouteType) {
    RouteType[RouteType["PolyLine"] = 1] = "PolyLine";
    RouteType[RouteType["Orthogonal"] = 2] = "Orthogonal";
})(RouteType || (RouteType = {}));
// equal to ConnDirFlag in libavoid
export var Directions;
(function (Directions) {
    Directions[Directions["None"] = 0] = "None";
    Directions[Directions["Up"] = 1] = "Up";
    Directions[Directions["Down"] = 2] = "Down";
    Directions[Directions["Left"] = 4] = "Left";
    Directions[Directions["Right"] = 8] = "Right";
    Directions[Directions["All"] = 15] = "All";
})(Directions || (Directions = {}));
export const libavoidRouterKind = "libavoid";
//# sourceMappingURL=libavoid-router-options.js.map