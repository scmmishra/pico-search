import v8 from 'node:v8';
import { c as createBirpc } from './vendor-index.783e7f3e.js';
import { parseRegexp } from '@vitest/utils';
import { s as startViteNode, m as moduleCache, a as mockMap } from './chunk-runtime-mocker.3283818a.js';
import { a as rpcDone } from './chunk-runtime-rpc.d6aa57f8.js';
import { s as setupInspect } from './chunk-runtime-inspector.b1427a10.js';
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
import 'node:util';
import '@vitest/runner/utils';
import './chunk-utils-global.fd174983.js';
import './chunk-paths.e36446b4.js';
import './chunk-utils-base.b5ddfcc9.js';
import '@vitest/spy';
import 'node:inspector';

function init(ctx) {
  const { config } = ctx;
  process.env.VITEST_WORKER_ID = "1";
  process.env.VITEST_POOL_ID = "1";
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
        serialize: v8.serialize,
        deserialize: (v) => v8.deserialize(Buffer.from(v)),
        post(v) {
          var _a;
          (_a = process.send) == null ? void 0 : _a.call(process, v);
        },
        on(fn) {
          process.on("message", fn);
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
function parsePossibleRegexp(str) {
  const prefix = "$$vitest:";
  if (typeof str === "string" && str.startsWith(prefix))
    return parseRegexp(str.slice(prefix.length));
  return str;
}
function unwrapConfig(config) {
  if (config.testNamePattern)
    config.testNamePattern = parsePossibleRegexp(config.testNamePattern);
  return config;
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
const procesExit = process.exit;
process.on("message", async (message) => {
  if (typeof message === "object" && message.command === "start") {
    try {
      message.config = unwrapConfig(message.config);
      await run(message);
    } finally {
      procesExit();
    }
  }
});

export { run };
