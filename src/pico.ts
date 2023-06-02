import jaroWinkler from "./algorithms/jaroWinkler";
import { clamp, weightedAverage } from "./math";

interface SearchResult<T> {
  object: T;
  similarity: number;
}

type KeyWithWeight = { name: string; weight: number };
type Keys = Array<KeyWithWeight | string>;

/**
 * Searches for objects in an array based on a search term and a set of keys.
 * @param {T[]} objectsArray - The array of objects to search.
 * @param {string} searchTerm - The search term to match against the objects.
 * @param {Keys} keys - The keys to search in each object.
 * @param {PicoSearchConfig} [config] - Configuration options for the search.
 * @returns {T[]} An array of objects that match the search criteria, ordered by their similarity from the search term.
 */
export function picoSearch<T>(
  objectsArray: T[],
  searchTerm: string,
  keys: Keys,
  config?: { threshold?: number }
): T[] {
  const results: SearchResult<T>[] = [];

  const threshold = config?.threshold || 0.8;
  const trimmedSearchTerm = searchTerm.trim().toLowerCase();

  if (!searchTerm) {
    return objectsArray;
  }

  objectsArray.forEach((obj) => {
    const similarityScores: number[] = [];
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
        const valueToSearch = (obj as any)[keyToCheck].trim().toLowerCase();
        const similarity = splitWordsAndRank(valueToSearch, trimmedSearchTerm);

        similarityScores.push(similarity);
      }
    }

    const similarityForObject = weightedAverage(
      similarityScores,
      weightsInOrder
    );

    if (similarityForObject >= threshold) {
      results.push({
        object: obj,
        similarity: similarityForObject,
      });
    }
  });

  results.sort((a, b) => b.similarity - a.similarity);

  return results.map((result) => result.object);
}

function splitWordsAndRank(valueToSearch: string, searchTerm: string) {
  const boostFactor = 1.1;

  if (valueToSearch.includes(" ")) {
    const similarityValues = valueToSearch.split(" ").map((word) => {
      const jwScore = jaroWinkler(word, searchTerm);

      // if the word includes the search term, boost the score
      if (word.includes(searchTerm)) {
        return jwScore * boostFactor;
      }

      return jwScore;
    });

    const maxSimilarity = Math.max(...similarityValues);
    const firstSimilarity = similarityValues[0];

    // boost score if the highest matching word shows up first
    if (maxSimilarity === firstSimilarity) {
      return maxSimilarity * boostFactor;
    }

    return clamp(maxSimilarity);
  }

  return jaroWinkler(valueToSearch, searchTerm);
}
