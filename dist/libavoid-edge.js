import { SEdgeImpl } from 'sprotty';
import { libavoidRouterKind } from './libavoid-router-options';
export class LibavoidEdge extends SEdgeImpl {
    constructor() {
        super(...arguments);
        this.routerKind = libavoidRouterKind;
        this.routeType = 0;
        this.sourceVisibleDirections = undefined;
        this.targetVisibleDirections = undefined;
        this.hateCrossings = false;
    }
}
//# sourceMappingURL=libavoid-edge.js.map