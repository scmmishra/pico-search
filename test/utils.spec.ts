import { expect, describe, it } from "vitest";
import { weightedAverage } from "../src/utils";

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
