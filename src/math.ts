/**
 * Calculates the weighted average of a set of values.
 * @param {number[]} values - The values to be averaged.
 * @param {number[]} [weights] - The weights to be applied to the values.
 * @returns {number} The weighted average of the values.
 * @throws {Error} If the number of values is not equal to the number of weights.
 */
export function weightedAverage(values: number[], weights?: number[]): number {
  if (weights && values.length !== weights.length) {
    throw new Error(
      "The number of values must be equal to the number of weights"
    );
  }

  const sum = values.reduce((prev, curr, index) => {
    const weight = weights ? weights[index] : 1;
    return prev + curr * weight;
  }, 0);

  const totalWeight = weights
    ? weights.reduce((prev, curr) => prev + curr, 0)
    : values.length;

  return sum / totalWeight;
}

/**
 * Clamps a number between a minimum and maximum value.
 * @param {number} value - The number to clamp.
 * @param {number} [min=0] - The minimum value to clamp to.
 * @param {number} [max=1] - The maximum value to clamp to.
 * @returns {number} The clamped value, which is between the minimum and maximum values.
 */
export function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}
