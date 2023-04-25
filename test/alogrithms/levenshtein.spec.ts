import { describe, expect, it } from "vitest";
import levenshtein from "../../src/algorithms/levenshtein";

describe("levenshtein", () => {
  it("should return 1 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(1);
  });

  it("should return 0 for completely different strings", () => {
    expect(levenshtein("aaaaa", "zzzzz")).toBe(0);
  });

  it("should return the correct similarity for slightly different strings", () => {
    expect(levenshtein("kitten", "sitting")).toBeCloseTo(0.57, 2);
  });

  it("should return the correct similarity for case-insensitive strings", () => {
    expect(levenshtein("Hello", "hELLo")).toBe(1);
  });

  it("should return the correct similarity for strings with leading/trailing whitespace", () => {
    expect(levenshtein("   hello", "hello   ")).toBe(1);
  });

  it("should return the correct similarity for strings with special characters", () => {
    expect(levenshtein("café", "coffee")).toBeCloseTo(0.3, 0.6);
  });
});
