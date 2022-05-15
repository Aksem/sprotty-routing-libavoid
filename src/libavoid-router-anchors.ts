import {
  IAnchorComputer,
  DIAMOND_ANCHOR_KIND,
  ELLIPTIC_ANCHOR_KIND,
  RECTANGULAR_ANCHOR_KIND,
  EllipseAnchor,
  RectangleAnchor,
  DiamondAnchor,
} from "sprotty";

import { LibavoidRouter } from "./libavoid-router";

export class LibavoidEllipseAnchor
  extends EllipseAnchor
  implements IAnchorComputer
{
  get kind() {
    return LibavoidRouter.KIND + ":" + ELLIPTIC_ANCHOR_KIND;
  }
}

export class LibavoidRectangleAnchor
  extends RectangleAnchor
  implements IAnchorComputer
{
  get kind() {
    return LibavoidRouter.KIND + ":" + RECTANGULAR_ANCHOR_KIND;
  }
}

export class LibavoidDiamondAnchor
  extends DiamondAnchor
  implements IAnchorComputer
{
  get kind() {
    return LibavoidRouter.KIND + ":" + DIAMOND_ANCHOR_KIND;
  }
}
