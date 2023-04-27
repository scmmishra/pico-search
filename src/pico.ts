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

/**
 * Searches for objects in an array based on a search term and a set of keys.
 * @param {T[]} objectsArray - The array of objects to search.
 * @param {string} searchTerm - The search term to match against the objects.
 * @param {Keys} keys - The keys to search in each object.
 * @param {PicoSearchConfig} [config] - Configuration options for the search.
 * @returns {T[]} An array of objects that match the search criteria, ordered by their distance from the search term.
 */
export function picoSearch<T>(
  objectsArray: T[],
  searchTerm: string,
  keys: Keys,
  config?: { algorithm?: SearchAlgorithm; threshold?: number }
): T[] {
  const results: SearchResult<T>[] = [];

  const algorithm = config?.algorithm || "levenshtein";
  const threshold = config?.threshold || 0.8;

  if (!searchTerm) {
    return objectsArray;
  }

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

    const distanceForObject = weightedAverage(distanceScores, weightsInOrder);

    if (distanceForObject >= threshold) {
      results.push({
        object: obj,
        distance: distanceForObject,
      });
    }
  });

  results.sort((a, b) => b.distance - a.distance);

  return results.map((result) => result.object);
}
