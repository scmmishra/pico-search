export { startTests } from '@vitest/runner';
import { a as ResolvedConfig, a0 as CoverageOptions, Y as CoverageProvider, _ as CoverageProviderModule } from './types-94cfe4b4.js';
export { s as setupSnapshotEnvironment } from './env-afee91f0.js';
import '@vitest/expect';
import 'vite';
import '@vitest/runner/types';
import '@vitest/runner/utils';
import '@vitest/utils';
import 'tinybench';
import 'vite-node/client';
import 'node:worker_threads';
import 'vite-node';
import 'source-map';
import 'node:fs';
import 'vite-node/server';

declare function setupCommonEnv(config: ResolvedConfig): Promise<void>;

interface Loader {
    executeId: (id: string) => Promise<{
        default: CoverageProviderModule;
    }>;
}
declare function getCoverageProvider(options: CoverageOptions | undefined, loader: Loader): Promise<CoverageProvider | null>;
declare function startCoverageInsideWorker(options: CoverageOptions | undefined, loader: Loader): Promise<unknown>;
declare function takeCoverageInsideWorker(options: CoverageOptions | undefined, loader: Loader): Promise<unknown>;
declare function stopCoverageInsideWorker(options: CoverageOptions | undefined, loader: Loader): Promise<unknown>;

export { getCoverageProvider, setupCommonEnv, startCoverageInsideWorker, stopCoverageInsideWorker, takeCoverageInsideWorker };
