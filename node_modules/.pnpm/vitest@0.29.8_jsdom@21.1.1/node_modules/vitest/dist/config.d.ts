import { UserConfig as UserConfig$2, ConfigEnv } from 'vite';
export { ConfigEnv } from 'vite';
import { a1 as ResolvedCoverageOptions, n as UserConfig$1, a4 as CoverageC8Options, a5 as CustomProviderOptions, a3 as CoverageIstanbulOptions, af as HtmlOptions, ag as FileOptions, ah as CloverOptions, ai as CoberturaOptions, aj as HtmlSpaOptions, ak as LcovOptions, al as LcovOnlyOptions, am as TeamcityOptions, an as TextOptions, ao as ProjectOptions, F as FakeTimerInstallOpts } from './types-94cfe4b4.js';
import '@vitest/expect';
import '@vitest/runner';
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

declare const defaultInclude: string[];
declare const defaultExclude: string[];
declare const coverageConfigDefaults: ResolvedCoverageOptions;
declare const config: {
    allowOnly: boolean;
    watch: boolean;
    globals: boolean;
    environment: "node";
    threads: boolean;
    clearMocks: boolean;
    restoreMocks: boolean;
    mockReset: boolean;
    include: string[];
    exclude: string[];
    testTimeout: number;
    hookTimeout: number;
    teardownTimeout: number;
    isolate: boolean;
    watchExclude: string[];
    forceRerunTriggers: string[];
    update: boolean;
    reporters: never[];
    silent: boolean;
    api: boolean;
    ui: boolean;
    uiBase: string;
    open: boolean;
    css: {
        include: never[];
    };
    coverage: {
        provider: "c8";
    } & CoverageC8Options & Required<Pick<({
        provider?: undefined;
    } & CoverageC8Options) | ({
        provider: "custom";
    } & CustomProviderOptions) | ({
        provider: "c8";
    } & CoverageC8Options) | ({
        provider: "istanbul";
    } & CoverageIstanbulOptions), "exclude" | "enabled" | "clean" | "cleanOnRerun" | "reportsDirectory" | "extension">> & {
        reporter: (["html", Partial<HtmlOptions>] | ["none", {}] | ["json", Partial<FileOptions>] | ["clover", Partial<CloverOptions>] | ["cobertura", Partial<CoberturaOptions>] | ["html-spa", Partial<HtmlSpaOptions>] | ["json-summary", Partial<FileOptions>] | ["lcov", Partial<LcovOptions>] | ["lcovonly", Partial<LcovOnlyOptions>] | ["teamcity", Partial<TeamcityOptions>] | ["text", Partial<TextOptions>] | ["text-lcov", Partial<ProjectOptions>] | ["text-summary", Partial<FileOptions>])[];
    };
    fakeTimers: FakeTimerInstallOpts;
    maxConcurrency: number;
    dangerouslyIgnoreUnhandledErrors: boolean;
    typecheck: {
        checker: "tsc";
        include: string[];
        exclude: string[];
    };
    slowTestThreshold: number;
};
declare const configDefaults: Required<Pick<UserConfig$1, keyof typeof config>>;

interface UserConfig extends UserConfig$2 {
    test?: UserConfig$2['test'];
}

type UserConfigFn = (env: ConfigEnv) => UserConfig | Promise<UserConfig>;
type UserConfigExport = UserConfig | Promise<UserConfig> | UserConfigFn;
declare function defineConfig(config: UserConfigExport): UserConfigExport;

export { UserConfig, UserConfigExport, UserConfigFn, configDefaults, coverageConfigDefaults, defaultExclude, defaultInclude, defineConfig };
