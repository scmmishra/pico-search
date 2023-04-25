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
