import { startTests } from '@vitest/runner';
import { resolve } from 'pathe';
import { r as resetModules } from './chunk-utils-env.6b856dbf.js';
import { R as RealDate, g as globalExpect, a as vi } from './chunk-utils-import.e488ace3.js';
import { d as distDir } from './chunk-paths.e36446b4.js';
import { a as startCoverageInsideWorker, t as takeCoverageInsideWorker, s as stopCoverageInsideWorker } from './chunk-integrations-coverage.d93ee824.js';
import { createRequire } from 'node:module';
import { isatty } from 'node:tty';
import { installSourcemapsSupport } from 'vite-node/source-map';
import { setupColors, createColors, getSafeTimers } from '@vitest/utils';
import { e as environments } from './chunk-env-node.affdd278.js';
import { i as index } from './chunk-integrations-utils.23c19408.js';
import { s as setupSnapshotEnvironment } from './chunk-snapshot-env.a347d647.js';
import { promises, existsSync } from 'node:fs';
import { r as rpc } from './chunk-runtime-rpc.d6aa57f8.js';
import { s as setupCommonEnv } from './chunk-runtime-setup.5d504677.js';
import { g as getWorkerState } from './chunk-utils-global.fd174983.js';
import 'std-env';
import '@vitest/runner/utils';
import 'chai';
import './vendor-_commonjsHelpers.addc3445.js';
import '@vitest/expect';
import './chunk-utils-base.b5ddfcc9.js';
import './chunk-utils-tasks.8781fd71.js';
import 'util';
import '@vitest/spy';
import 'node:url';
import 'node:console';
import 'local-pkg';
import './chunk-integrations-run-once.ea614f17.js';

class NodeSnapshotEnvironment {
  resolvePath(filepath) {
    return rpc().resolveSnapshotPath(filepath);
  }
  async prepareDirectory(filepath) {
    await promises.mkdir(filepath, { recursive: true });
  }
  async saveSnapshotFile(filepath, snapshot) {
    await promises.writeFile(filepath, snapshot, "utf-8");
  }
  async readSnapshotFile(filepath) {
    if (!existsSync(filepath))
      return null;
    return promises.readFile(filepath, "utf-8");
  }
  async removeSnapshotFile(filepath) {
    if (existsSync(filepath))
      await promises.unlink(filepath);
  }
}

let globalSetup = false;
async function setupGlobalEnv(config) {
  await setupCommonEnv(config);
  Object.defineProperty(globalThis, "__vitest_index__", {
    value: index,
    enumerable: false
  });
  if (globalSetup)
    return;
  globalSetup = true;
  setupSnapshotEnvironment(new NodeSnapshotEnvironment());
  setupColors(createColors(isatty(1)));
  const _require = createRequire(import.meta.url);
  _require.extensions[".css"] = () => ({});
  _require.extensions[".scss"] = () => ({});
  _require.extensions[".sass"] = () => ({});
  const state = getWorkerState();
  installSourcemapsSupport({
    getSourceMap: (source) => state.moduleCache.getSourceMap(source)
  });
  await setupConsoleLogSpy();
}
async function setupConsoleLogSpy() {
  const stdoutBuffer = /* @__PURE__ */ new Map();
  const stderrBuffer = /* @__PURE__ */ new Map();
  const timers = /* @__PURE__ */ new Map();
  const unknownTestId = "__vitest__unknown_test__";
  const { Writable } = await import('node:stream');
  const { Console } = await import('node:console');
  const { setTimeout, clearTimeout } = getSafeTimers();
  function schedule(taskId) {
    const timer = timers.get(taskId);
    const { stdoutTime, stderrTime } = timer;
    clearTimeout(timer.timer);
    timer.timer = setTimeout(() => {
      if (stderrTime < stdoutTime) {
        sendStderr(taskId);
        sendStdout(taskId);
      } else {
        sendStdout(taskId);
        sendStderr(taskId);
      }
    });
  }
  function sendStdout(taskId) {
    const buffer = stdoutBuffer.get(taskId);
    if (!buffer)
      return;
    const content = buffer.map((i) => String(i)).join("");
    const timer = timers.get(taskId);
    rpc().onUserConsoleLog({
      type: "stdout",
      content: content || "<empty line>",
      taskId,
      time: timer.stdoutTime || RealDate.now(),
      size: buffer.length
    });
    stdoutBuffer.set(taskId, []);
    timer.stdoutTime = 0;
  }
  function sendStderr(taskId) {
    const buffer = stderrBuffer.get(taskId);
    if (!buffer)
      return;
    const content = buffer.map((i) => String(i)).join("");
    const timer = timers.get(taskId);
    rpc().onUserConsoleLog({
      type: "stderr",
      content: content || "<empty line>",
      taskId,
      time: timer.stderrTime || RealDate.now(),
      size: buffer.length
    });
    stderrBuffer.set(taskId, []);
    timer.stderrTime = 0;
  }
  const stdout = new Writable({
    write(data, encoding, callback) {
      var _a, _b;
      const id = ((_b = (_a = getWorkerState()) == null ? void 0 : _a.current) == null ? void 0 : _b.id) ?? unknownTestId;
      let timer = timers.get(id);
      if (timer) {
        timer.stdoutTime = timer.stdoutTime || RealDate.now();
      } else {
        timer = { stdoutTime: RealDate.now(), stderrTime: RealDate.now(), timer: 0 };
        timers.set(id, timer);
      }
      let buffer = stdoutBuffer.get(id);
      if (!buffer) {
        buffer = [];
        stdoutBuffer.set(id, buffer);
      }
      buffer.push(data);
      schedule(id);
      callback();
    }
  });
  const stderr = new Writable({
    write(data, encoding, callback) {
      var _a, _b;
      const id = ((_b = (_a = getWorkerState()) == null ? void 0 : _a.current) == null ? void 0 : _b.id) ?? unknownTestId;
      let timer = timers.get(id);
      if (timer) {
        timer.stderrTime = timer.stderrTime || RealDate.now();
      } else {
        timer = { stderrTime: RealDate.now(), stdoutTime: RealDate.now(), timer: 0 };
        timers.set(id, timer);
      }
      let buffer = stderrBuffer.get(id);
      if (!buffer) {
        buffer = [];
        stderrBuffer.set(id, buffer);
      }
      buffer.push(data);
      schedule(id);
      callback();
    }
  });
  globalThis.console = new Console({
    stdout,
    stderr,
    colorMode: true,
    groupIndentation: 2
  });
}
async function loadEnvironment(name, executor) {
  const pkg = await executor.executeId(`vitest-environment-${name}`);
  if (!pkg || !pkg.default || typeof pkg.default !== "object" || typeof pkg.default.setup !== "function") {
    throw new Error(
      `Environment "${name}" is not a valid environment. Package "vitest-environment-${name}" should have default export with "setup" method.`
    );
  }
  return pkg.default;
}
async function withEnv(name, options, executor, fn) {
  const config = environments[name] || await loadEnvironment(name, executor);
  globalThis.__vitest_environment__ = config.name || name;
  globalExpect.setState({
    environment: config.name || name || "node"
  });
  const env = await config.setup(globalThis, options);
  try {
    await fn();
  } finally {
    const { setTimeout } = getSafeTimers();
    await new Promise((resolve) => setTimeout(resolve));
    await env.teardown(globalThis);
  }
}

const runnersFile = resolve(distDir, "runners.js");
async function getTestRunnerConstructor(config, executor) {
  if (!config.runner) {
    const { VitestTestRunner, NodeBenchmarkRunner } = await executor.executeFile(runnersFile);
    return config.mode === "test" ? VitestTestRunner : NodeBenchmarkRunner;
  }
  const mod = await executor.executeId(config.runner);
  if (!mod.default && typeof mod.default !== "function")
    throw new Error(`Runner must export a default function, but got ${typeof mod.default} imported from ${config.runner}`);
  return mod.default;
}
async function getTestRunner(config, executor) {
  const TestRunner = await getTestRunnerConstructor(config, executor);
  const testRunner = new TestRunner(config);
  Object.defineProperty(testRunner, "__vitest_executor", {
    value: executor,
    enumerable: false,
    configurable: false
  });
  if (!testRunner.config)
    testRunner.config = config;
  if (!testRunner.importFile)
    throw new Error('Runner must implement "importFile" method.');
  const originalOnTaskUpdate = testRunner.onTaskUpdate;
  testRunner.onTaskUpdate = async (task) => {
    const p = rpc().onTaskUpdate(task);
    await (originalOnTaskUpdate == null ? void 0 : originalOnTaskUpdate.call(testRunner, task));
    return p;
  };
  const originalOnCollected = testRunner.onCollected;
  testRunner.onCollected = async (files) => {
    rpc().onCollected(files);
    await (originalOnCollected == null ? void 0 : originalOnCollected.call(testRunner, files));
  };
  const originalOnAfterRun = testRunner.onAfterRun;
  testRunner.onAfterRun = async (files) => {
    const coverage = await takeCoverageInsideWorker(config.coverage, executor);
    rpc().onAfterSuiteRun({ coverage });
    await (originalOnAfterRun == null ? void 0 : originalOnAfterRun.call(testRunner, files));
  };
  return testRunner;
}
async function run(files, config, environment, executor) {
  await setupGlobalEnv(config);
  await startCoverageInsideWorker(config.coverage, executor);
  const workerState = getWorkerState();
  const runner = await getTestRunner(config, executor);
  globalThis.__vitest_environment__ = environment;
  await withEnv(environment.name, environment.options || config.environmentOptions || {}, executor, async () => {
    for (const file of files) {
      if (config.isolate) {
        workerState.mockMap.clear();
        resetModules(workerState.moduleCache, true);
      }
      workerState.filepath = file;
      await startTests([file], runner);
      workerState.filepath = void 0;
      vi.resetConfig();
      vi.restoreAllMocks();
    }
    await stopCoverageInsideWorker(config.coverage, executor);
  });
  workerState.environmentTeardownRun = true;
}

export { run };
