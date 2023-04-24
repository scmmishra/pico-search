export function weightedAverage(values: number[], weights?: number[]): number {
  const weightsToTest = weights ?? [];
  if (weightsToTest.length && values.length !== weightsToTest.length) {
    throw new Error(
      "The number of values must be equal to the number of weights"
    );
  }

  const sum = values.reduce((prev, curr, index) => {
    const weight = weightsToTest.length ? weightsToTest[index] : 1;
    return prev + curr * weight;
  }, 0);

  const totalWeight = weightsToTest
    ? weightsToTest.reduce((prev, curr) => prev + curr, 0)
    : values.length;

  return sum / totalWeight;
}
