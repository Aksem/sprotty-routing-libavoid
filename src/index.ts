import { AvoidLib } from "libavoid-js";
import { LibavoidRouter } from "./libavoid-router";

export async function load() {
  await AvoidLib.load();
}

export { LibavoidRouter };
