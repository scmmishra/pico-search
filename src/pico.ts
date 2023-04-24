import jaroWinkler from "./algorithms/jaroWinkler";
import levenshtein from "./algorithms/levenshtein";
import { weightedAverage } from "./math";

interface SearchResult<T> {
  object: T;
  distance: number;
}

type SearchAlgorithm = "levenshtein" | "jaroWinkler";
type KeyWithWeight = { name: string; weight: number };
type Keys = Array<KeyWithWeight | string>;

export function picoSearch<T>(
  objectsArray: T[],
  searchTerm: string,
  keys: Keys,
  algorithm: SearchAlgorithm = "levenshtein"
): T[] {
  const results: SearchResult<T>[] = [];

  objectsArray.forEach((obj) => {
    const distanceScores: number[] = [];
    const weightsInOrder: number[] = [];

    for (const key of keys) {
      const keyToCheck =
        typeof key === "string" ? key : (key as KeyWithWeight).name;

      if (typeof key !== "string") {
        weightsInOrder.push((key as KeyWithWeight).weight);
      } else {
        weightsInOrder.push(1);
      }

      if (
        Object.prototype.hasOwnProperty.call(obj, keyToCheck) &&
        typeof (obj as any)[keyToCheck] === "string"
      ) {
        const distance =
          algorithm === "levenshtein"
            ? levenshtein((obj as any)[keyToCheck], searchTerm)
            : jaroWinkler((obj as any)[keyToCheck], searchTerm);

        distanceScores.push(distance);
      }
    }

    results.push({
      object: obj,
      distance: weightedAverage(distanceScores, weightsInOrder),
    });
  });

  results.sort((a, b) => b.distance - a.distance);

  return results.map((result) => result.object);
}
