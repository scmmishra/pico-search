export { assertTypes, clone, createDefer, deepClone, getOwnProperties, getType, isObject, noop, objectAttr, parseRegexp, slash, toArray } from './helpers.js';
import { format as format$1, plugins } from 'pretty-format';
import util from 'util';
import loupeImport from 'loupe';

const {
  AsymmetricMatcher,
  DOMCollection,
  DOMElement,
  Immutable,
  ReactElement,
  ReactTestComponent
} = plugins;
const PLUGINS = [
  ReactTestComponent,
  ReactElement,
  DOMElement,
  DOMCollection,
  Immutable,
  AsymmetricMatcher
];
function stringify(object, maxDepth = 10, { maxLength, ...options } = {}) {
  const MAX_LENGTH = maxLength ?? 1e4;
  let result;
  try {
    result = format$1(object, {
      maxDepth,
      escapeString: false,
      plugins: PLUGINS,
      ...options
    });
  } catch {
    result = format$1(object, {
      callToJSON: false,
      maxDepth,
      escapeString: false,
      plugins: PLUGINS,
      ...options
    });
  }
  return result.length >= MAX_LENGTH && maxDepth > 1 ? stringify(object, Math.floor(maxDepth / 2)) : result;
}

const SAFE_TIMERS_SYMBOL = Symbol("vitest:SAFE_TIMERS");
const SAFE_COLORS_SYMBOL = Symbol("vitest:SAFE_COLORS");

function getSafeTimers() {
  const {
    setTimeout: safeSetTimeout,
    setInterval: safeSetInterval,
    clearInterval: safeClearInterval,
    clearTimeout: safeClearTimeout,
    setImmediate: safeSetImmediate,
    clearImmediate: safeClearImmediate
  } = globalThis[SAFE_TIMERS_SYMBOL] || globalThis;
  const {
    nextTick: safeNextTick
  } = globalThis[SAFE_TIMERS_SYMBOL] || globalThis.process || { nextTick: (cb) => cb() };
  return {
    nextTick: safeNextTick,
    setTimeout: safeSetTimeout,
    setInterval: safeSetInterval,
    clearInterval: safeClearInterval,
    clearTimeout: safeClearTimeout,
    setImmediate: safeSetImmediate,
    clearImmediate: safeClearImmediate
  };
}
function setSafeTimers() {
  const {
    setTimeout: safeSetTimeout,
    setInterval: safeSetInterval,
    clearInterval: safeClearInterval,
    clearTimeout: safeClearTimeout,
    setImmediate: safeSetImmediate,
    clearImmediate: safeClearImmediate
  } = globalThis;
  const {
    nextTick: safeNextTick
  } = globalThis.process || { nextTick: (cb) => cb() };
  const timers = {
    nextTick: safeNextTick,
    setTimeout: safeSetTimeout,
    setInterval: safeSetInterval,
    clearInterval: safeClearInterval,
    clearTimeout: safeClearTimeout,
    setImmediate: safeSetImmediate,
    clearImmediate: safeClearImmediate
  };
  globalThis[SAFE_TIMERS_SYMBOL] = timers;
}

const RealDate = Date;
function random(seed) {
  const x = Math.sin(seed++) * 1e4;
  return x - Math.floor(x);
}
function shuffle(array, seed = RealDate.now()) {
  let length = array.length;
  while (length) {
    const index = Math.floor(random(seed) * length--);
    const previous = array[length];
    array[length] = array[index];
    array[index] = previous;
    ++seed;
  }
  return array;
}

const loupe = typeof loupeImport.default === "function" ? loupeImport.default : loupeImport;
function format(...args) {
  return util.format(...args);
}
function utilInspect(item, options) {
  return util.inspect(item, options);
}
function loupeInspect(obj) {
  return loupe(obj, {
    depth: 2,
    truncate: 40
  });
}
function objDisplay(obj) {
  const truncateThreshold = 40;
  const str = loupeInspect(obj);
  const type = Object.prototype.toString.call(obj);
  if (str.length >= truncateThreshold) {
    if (type === "[object Function]") {
      const fn = obj;
      return !fn.name || fn.name === "" ? "[Function]" : `[Function: ${fn.name}]`;
    } else if (type === "[object Array]") {
      return `[ Array(${obj.length}) ]`;
    } else if (type === "[object Object]") {
      const keys = Object.keys(obj);
      const kstr = keys.length > 2 ? `${keys.splice(0, 2).join(", ")}, ...` : keys.join(", ");
      return `{ Object (${kstr}) }`;
    } else {
      return str;
    }
  }
  return str;
}

const colorsMap = {
  bold: ["\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m"],
  dim: ["\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"],
  italic: ["\x1B[3m", "\x1B[23m"],
  underline: ["\x1B[4m", "\x1B[24m"],
  inverse: ["\x1B[7m", "\x1B[27m"],
  hidden: ["\x1B[8m", "\x1B[28m"],
  strikethrough: ["\x1B[9m", "\x1B[29m"],
  black: ["\x1B[30m", "\x1B[39m"],
  red: ["\x1B[31m", "\x1B[39m"],
  green: ["\x1B[32m", "\x1B[39m"],
  yellow: ["\x1B[33m", "\x1B[39m"],
  blue: ["\x1B[34m", "\x1B[39m"],
  magenta: ["\x1B[35m", "\x1B[39m"],
  cyan: ["\x1B[36m", "\x1B[39m"],
  white: ["\x1B[37m", "\x1B[39m"],
  gray: ["\x1B[90m", "\x1B[39m"],
  bgBlack: ["\x1B[40m", "\x1B[49m"],
  bgRed: ["\x1B[41m", "\x1B[49m"],
  bgGreen: ["\x1B[42m", "\x1B[49m"],
  bgYellow: ["\x1B[43m", "\x1B[49m"],
  bgBlue: ["\x1B[44m", "\x1B[49m"],
  bgMagenta: ["\x1B[45m", "\x1B[49m"],
  bgCyan: ["\x1B[46m", "\x1B[49m"],
  bgWhite: ["\x1B[47m", "\x1B[49m"]
};
const colorsEntries = Object.entries(colorsMap);
const string = (str) => String(str);
string.open = "";
string.close = "";
const defaultColors = colorsEntries.reduce((acc, [key]) => {
  acc[key] = string;
  return acc;
}, { isColorSupported: false });
function getDefaultColors() {
  return { ...defaultColors };
}
function getColors() {
  return globalThis[SAFE_COLORS_SYMBOL] || defaultColors;
}
function createColors(isTTY = false) {
  const enabled = typeof process !== "undefined" && !("NO_COLOR" in process.env || process.argv.includes("--no-color")) && !("GITHUB_ACTIONS" in process.env) && ("FORCE_COLOR" in process.env || process.argv.includes("--color") || process.platform === "win32" || isTTY && process.env.TERM !== "dumb" || "CI" in process.env);
  const replaceClose = (string2, close, replace, index) => {
    const start = string2.substring(0, index) + replace;
    const end = string2.substring(index + close.length);
    const nextIndex = end.indexOf(close);
    return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
  };
  const formatter = (open, close, replace = open) => {
    const fn = (input) => {
      const string2 = String(input);
      const index = string2.indexOf(close, open.length);
      return ~index ? open + replaceClose(string2, close, replace, index) + close : open + string2 + close;
    };
    fn.open = open;
    fn.close = close;
    return fn;
  };
  const colorsObject = {
    isColorSupported: enabled,
    reset: enabled ? (s) => `\x1B[0m${s}\x1B[0m` : string
  };
  for (const [name, formatterArgs] of colorsEntries) {
    colorsObject[name] = enabled ? formatter(...formatterArgs) : string;
  }
  return colorsObject;
}
function setupColors(colors) {
  globalThis[SAFE_COLORS_SYMBOL] = colors;
}

function createSimpleStackTrace(options) {
  const { message = "error", stackTraceLimit = 1 } = options || {};
  const limit = Error.stackTraceLimit;
  const prepareStackTrace = Error.prepareStackTrace;
  Error.stackTraceLimit = stackTraceLimit;
  Error.prepareStackTrace = (e) => e.stack;
  const err = new Error(message);
  const stackTrace = err.stack || "";
  Error.prepareStackTrace = prepareStackTrace;
  Error.stackTraceLimit = limit;
  return stackTrace;
}

export { SAFE_COLORS_SYMBOL, SAFE_TIMERS_SYMBOL, createColors, createSimpleStackTrace, format, getColors, getDefaultColors, getSafeTimers, loupeInspect, objDisplay, setSafeTimers, setupColors, shuffle, stringify, utilInspect };
