import { g as globalApis } from './chunk-constants.bc18a549.js';
import { i as index } from './chunk-integrations-utils.23c19408.js';
import '@vitest/runner';
import './chunk-utils-import.e488ace3.js';
import '@vitest/runner/utils';
import '@vitest/utils';
import './chunk-utils-env.6b856dbf.js';
import 'pathe';
import 'std-env';
import './chunk-utils-global.fd174983.js';
import 'chai';
import './vendor-_commonjsHelpers.addc3445.js';
import '@vitest/expect';
import './chunk-runtime-rpc.d6aa57f8.js';
import './chunk-snapshot-env.a347d647.js';
import './chunk-utils-base.b5ddfcc9.js';
import './chunk-utils-tasks.8781fd71.js';
import 'util';
import '@vitest/spy';
import './chunk-integrations-run-once.ea614f17.js';

function registerApiGlobally() {
  globalApis.forEach((api) => {
    globalThis[api] = index[api];
  });
}

export { registerApiGlobally };
