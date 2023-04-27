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
