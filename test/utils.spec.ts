import { expect, describe, it } from "vitest";
import { weightedAverage, clamp, splitAndTrim } from "../src/utils";

describe("weightedAverage", () => {
  it("calculates the correct weighted average with default weights", () => {
    const values = [1, 2, 3, 4, 5];
    const expected = (1 + 2 + 3 + 4 + 5) / 5;
    const result = weightedAverage(values);
    expect(result).toEqual(expected);
  });

  it("calculates the correct weighted average with custom weights", () => {
    const values = [1, 2, 3, 4, 5];
    const weights = [1, 2, 3, 4, 5];
    const expected =
      (1 * 1 + 2 * 2 + 3 * 3 + 4 * 4 + 5 * 5) / (1 + 2 + 3 + 4 + 5);
    const result = weightedAverage(values, weights);
    expect(result).toEqual(expected);
  });

  it("throws an error if the number of values and weights are different", () => {
    const values = [1, 2, 3];
    const weights = [1, 2, 3, 4, 5];
    expect(() => weightedAverage(values, weights)).toThrow(
      "The number of values must be equal to the number of weights",
    );
  });
});

describe("clamp", () => {
  it("returns the value if it is within the range", () => {
    expect(clamp(0.5)).toBe(0.5);
  });

  it("returns the minimum value if the value is less than the minimum", () => {
    expect(clamp(-1)).toBe(0);
  });

  it("returns the maximum value if the value is greater than the maximum", () => {
    expect(clamp(2)).toBe(1);
  });
});

describe("splitAndTrim", () => {
  it("splits a regular string", () => {
    const input = "one two three";

    expect(splitAndTrim(input)).toEqual(["one", "two", "three"]);
  });

  it("splits a single string", () => {
    const input = "one";

    expect(splitAndTrim(input)).toEqual(["one"]);
  });

  it("splits a empty string", () => {
    const input = "";

    expect(splitAndTrim(input)).toEqual([]);
  });

  it("splits a string with multiple spaces", () => {
    const input = "one    two  three";

    expect(splitAndTrim(input)).toEqual(["one", "two", "three"]);
  });
});
