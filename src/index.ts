import { AvoidLib } from '../../Hnatiuj.Adaptagrams/';
import { LibavoidRouter } from './libavoid-router';

export async function load() {
    console.log(0);
    await AvoidLib.load();
    console.log(1);
}

export { LibavoidRouter };
