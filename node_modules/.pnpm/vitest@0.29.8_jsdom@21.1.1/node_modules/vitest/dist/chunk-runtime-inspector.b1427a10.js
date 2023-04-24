import inspector from 'node:inspector';

function setupInspect(config) {
  const isEnabled = config.inspect || config.inspectBrk;
  if (isEnabled) {
    const isOpen = inspector.url() !== void 0;
    if (!isOpen) {
      inspector.open();
      if (config.inspectBrk)
        inspector.waitForDebugger();
    }
  }
  const keepOpen = config.watch && !config.isolate && config.singleThread;
  return function cleanup() {
    if (isEnabled && !keepOpen)
      inspector.close();
  };
}

export { setupInspect as s };
