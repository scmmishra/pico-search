import { describe, expect, it } from "vitest";
import jaroWinkler from "../../src/algorithms/jaroWinkler";

describe("jaroWinkler", () => {
  it("should return 1 for identical strings", () => {
    expect(jaroWinkler("hello", "hello")).toBe(1);
  });

  it("should return 0 for completely dissimilar strings", () => {
    expect(jaroWinkler("zzzzz", "xxxxx")).toBe(0);
  });

  it("should return the correct distance for slightly different strings", () => {
    expect(jaroWinkler("martha", "marhta")).toBeCloseTo(0.95, 1);
  });

  it("should return the correct distance for case-insensitive strings", () => {
    expect(jaroWinkler("Hello", "hELLo")).toBe(1);
  });

  it("should return the correct distance for strings with leading/trailing whitespace", () => {
    expect(jaroWinkler("   hello", "hello   ")).toBe(1);
  });

  it("should return the correct distance for strings with special characters", () => {
    expect(jaroWinkler("café", "coffee")).toBeCloseTo(0.65, 2);
  });

  it("should return a distance less than 1 for strings with different lengths", () => {
    expect(jaroWinkler("hello", "hellos")).toBeLessThan(1);
  });

  it("should return a distance less than 1 for very dissimilar strings", () => {
    expect(jaroWinkler("hello", "goodbye")).toBeLessThan(1);
  });
});
