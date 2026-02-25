import { describe, expect, it } from "vitest";
import fuzzyScore from "../../src/algorithms/fuzzyScore";

describe("fuzzyScore", () => {
  it("exact match → 1", () => {
    expect(fuzzyScore("hello", "hello")).toBe(1);
    expect(fuzzyScore("Hello", "hello")).toBe(1);
  });

  it("no match / no subsequence → 0", () => {
    expect(fuzzyScore("abc", "xyz")).toBe(0);
    expect(fuzzyScore("hello", "hz")).toBe(0);
  });

  it("empty pattern → 1", () => {
    expect(fuzzyScore("anything", "")).toBe(1);
  });

  it("empty target → 0", () => {
    expect(fuzzyScore("", "abc")).toBe(0);
  });

  it("both empty → 1", () => {
    expect(fuzzyScore("", "")).toBe(1);
  });

  it("prefix match scores higher than mid-string match", () => {
    const prefix = fuzzyScore("apple", "app");
    const mid = fuzzyScore("pineapple", "app");
    expect(prefix).toBeGreaterThan(mid);
  });

  it("contiguous matches score higher than scattered", () => {
    const contiguous = fuzzyScore("abcdef", "abc");
    const scattered = fuzzyScore("axbxcx", "abc");
    expect(contiguous).toBeGreaterThan(scattered);
  });

  it("word boundary matches score higher", () => {
    const boundary = fuzzyScore("foo-bar", "b");
    const noBoundary = fuzzyScore("fooXar", "a");
    expect(boundary).toBeGreaterThan(noBoundary);
  });

  it("short targets preferred over long targets (same pattern)", () => {
    const short = fuzzyScore("cat", "c");
    const long = fuzzyScore("caterpillar", "c");
    expect(short).toBeGreaterThan(long);
  });

  it("camelCase boundary detection", () => {
    const camel = fuzzyScore("getElementById", "gEBI");
    expect(camel).toBeGreaterThan(0);
  });

  it("subsequence matching works", () => {
    expect(fuzzyScore("John Doe", "jd")).toBeGreaterThan(0);
    expect(fuzzyScore("The Shawshank Redemption", "shwshnk")).toBeGreaterThan(0);
  });

  it("single char matches target starting with that char", () => {
    expect(fuzzyScore("360dialog", "3")).toBeGreaterThan(0);
  });
});
