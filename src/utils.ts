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

/**
 * Clamps a number between a minimum and maximum value.
 * @param {number} value - The number to clamp.
 * @returns {number} The clamped value, which is between the minimum and maximum values.
 */
export function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Splits a string into words, removes duplicates and empty words.
 * @param {string } value - The string to split and trim.
 * @returns {string[]} Returns an array of words, with duplicates and empty strings removed.
 */
export function splitAndTrim(value: string): string[] {
  return value
    .split(/\s+/) // split by one or more whitespace characters
    .filter((word, index, words) => word && words.indexOf(word) === index); // remove empty strings and duplicates
}
