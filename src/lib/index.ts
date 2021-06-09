import { AvoidLib } from 'libavoid-js';

export async function load() {
    await AvoidLib.load();
}

export * from 'sprotty/src/features/routing/anchor';
export * from 'sprotty/src/features/routing/views';

export * from "./routing/linear-edge-router";
export * from "./routing/manhattan-anchors";
export * from "./routing/manhattan-edge-router";
export * from "./routing/model";
export * from "./routing/polyline-anchors";
export * from "./routing/polyline-edge-router";
export * from "./routing/routing";
