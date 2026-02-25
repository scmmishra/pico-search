/**
 * Calculates the weighted average of a set of values.
 * @param {number[]} values - The values to be averaged.
 * @param {number[]} [weights] - The weights to be applied to the values.
 * @returns {number} The weighted average of the values.
 * @throws {Error} If the number of values is not equal to the number of weights.
 */
export function weightedAverage(values: number[], weights?: number[]): number {
  let sum = 0;
  let totalWeight = 0;

  if (weights && values.length !== weights.length) {
    throw new Error(
      "The number of values must be equal to the number of weights",
    );
  }

  for (let i = 0; i < values.length; i++) {
    const weight = weights ? weights[i] : 1;
    sum += values[i] * weight;
    totalWeight += weight;
  }

  return sum / totalWeight;
}

