import { c as createBirpc } from './vendor-index.783e7f3e.js';
import { workerId } from 'tinypool';
import { g as getWorkerState } from './chunk-utils-global.fd174983.js';
import { s as startViteNode, m as moduleCache, a as mockMap } from './chunk-runtime-mocker.3283818a.js';
import { s as setupInspect } from './chunk-runtime-inspector.b1427a10.js';
import { a as rpcDone } from './chunk-runtime-rpc.d6aa57f8.js';
import 'node:url';
import 'vite-node/client';
import 'vite-node/utils';
import 'pathe';
import './vendor-index.bdee400f.js';
import 'acorn';
import 'node:module';
import 'node:fs';
import 'node:assert';
import 'node:process';
import 'node:path';
import 'node:v8';
import 'node:util';
import '@vitest/runner/utils';
import './chunk-paths.e36446b4.js';
import '@vitest/utils';
import './chunk-utils-base.b5ddfcc9.js';
import '@vitest/spy';
import 'node:inspector';

function init(ctx) {
  if (typeof __vitest_worker__ !== "undefined" && ctx.config.threads && ctx.config.isolate)
    throw new Error(`worker for ${ctx.files.join(",")} already initialized by ${getWorkerState().ctx.files.join(",")}. This is probably an internal bug of Vitest.`);
  const { config, port, workerId: workerId$1 } = ctx;
  process.env.VITEST_WORKER_ID = String(workerId$1);
  process.env.VITEST_POOL_ID = String(workerId);
  globalThis.__vitest_environment__ = config.environment;
  globalThis.__vitest_worker__ = {
    ctx,
    moduleCache,
    config,
    mockMap,
    rpc: createBirpc(
      {},
      {
        eventNames: ["onUserConsoleLog", "onFinished", "onCollected", "onWorkerExit"],
        post(v) {
          port.postMessage(v);
        },
        on(fn) {
          port.addListener("message", fn);
        }
      }
    )
  };
  if (ctx.invalidates) {
    ctx.invalidates.forEach((fsPath) => {
      moduleCache.delete(fsPath);
      moduleCache.delete(`mock:${fsPath}`);
    });
  }
  ctx.files.forEach((i) => moduleCache.delete(i));
}
async function run(ctx) {
  const inspectorCleanup = setupInspect(ctx.config);
  try {
    init(ctx);
    const { run: run2, executor } = await startViteNode(ctx);
    await run2(ctx.files, ctx.config, ctx.environment, executor);
    await rpcDone();
  } finally {
    inspectorCleanup();
  }
}

export { run };
