 <div align="center">
  <h2>Libavoid-based routing feature for sprotty</h2>
 
 <a href="https://github.com/Aksem/sprotty-routing-libavoid/actions"><img alt="Build Status" src="https://github.com/Aksem/sprotty-routing-libavoid/workflows/Build/badge.svg?color=green" /></a> <a href="https://github.com/Aksem/sprotty-routing-libavoid/actions"> <img alt="Publish Status" src="https://github.com/Aksem/sprotty-routing-libavoid/workflows/Publish/badge.svg?color=green" /></a>  <img src="https://api.dependabot.com/badges/status?host=github&repo=hodgef/ts-library-boilerplate-basic" />
 
</div>

**Supported Sprotty versions:**

- sprotty 1.0: 1.2.* version
- sprotty 0.11-0.13: 1.0.* version

## 📦 Getting Started

1. Install `sprotty-routing-libavoid` npm package.

    ```sh
    npm install --save sprotty-routing-libavoid
    ```

    1.1 Build systems don't recognize .wasm file as dependency, you need to include it in build manually. For instance run copy at the end of build process(e.g. esbuild-plugin-copy for esbuild) or just execute cp as the second subcommand of npm build script(or postbuild command), e.g:

    ```json
    "postbuild": "cp -f ../../node_modules/libavoid-js/dist/libavoid.wasm ./dist/libavoid.wasm"
    ```

2. Load router before application start, e.g.:

    ```javascript
    import { load as loadLibavoidRouter } from 'sprotty-routing-libavoid';

    loadLibavoidRouter().then(() => {
        startApp(); // app start can vary, it just an example
    })
    ```

    Note, that router loading is asynchronous, it's required because router uses WebAssembly and currently it can be loaded only asynchronously.

3. Add LibavoidRouter and optionally anchors to the DI container.

    ```javascript
    import { TYPES } from 'sprotty';
    import {
        LibavoidDiamondAnchor,
        LibavoidEllipseAnchor,
        LibavoidRectangleAnchor,
        LibavoidRouter,
    } from 'sprotty-routing-libavoid';

    bind(LibavoidRouter).toSelf().inSingletonScope();
    bind(TYPES.IEdgeRouter).toService(LibavoidRouter);
    bind(TYPES.IAnchorComputer).to(LibavoidDiamondAnchor).inSingletonScope();
    bind(TYPES.IAnchorComputer).to(LibavoidEllipseAnchor).inSingletonScope();
    bind(TYPES.IAnchorComputer).to(LibavoidRectangleAnchor).inSingletonScope();
    ```

4. Use LibavoidEdge as base class for edges that should be routed with `LibavoidRouter`. It's optional, but recommended because so you can pass additional parameters to edges supported by libavoid router.

    ```javascript
    import { LibavoidEdge } from 'sprotty-routing-libavoid';
    import { PolylineEdgeView } from 'sprotty';

    class CustomEdge extends LibavoidEdge {}

    // in DI config:
    configureModelElement(context, 'edge', CustomEdge, PolylineEdgeView);
    ```

5. Optionally customize configuration of `LibavoidRouter`:

    ```javascript
    const router = container.get(LibavoidRouter);
    router.setOptions({
        routingType: RouteType.Orthogonal,
        segmentPenalty: 50,
        idealNudgingDistance: 24,
        shapeBufferDistance: 25,
        nudgeOrthogonalSegmentsConnectedToShapes: true,
        // allow or disallow moving edge end from center
        nudgeOrthogonalTouchingColinearSegments: false
    });
    ```

## Known limitations

- if AnchorComputer returns anchors on sides of connectables on first rendering, then anchors are attached to sides of connectables
  and it cannot be changed later even if AnchorComputer returns new values not on sides. This is because libavoid doesn't have
  public API for changing type of anchor(absolute/relative) yet.

## Development

Notes:

- inversify [requires `reflect-metadata` and experimentalDecorators, emitDecoratorMetadata, types and lib compilation options in tsconfig.json](https://inversify.io/). Esbuild doesn't take these parameters(at least some of them) from tsconfig, because build created with esbuild doesn't work properly(injected classes cannot be resolved), that's why we still use tsc.
