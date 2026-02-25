import fuzzyScore from "./algorithms/fuzzyScore";
import { weightedAverage } from "./utils";

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
  config?: { threshold: number },
): T[] {
  if (!searchTerm || typeof searchTerm !== "string") {
    return objectsArray;
  }

  const results: SearchResult<T>[] = [];
  const threshold = config?.threshold ?? 0.3;
  const trimmed = searchTerm.trim().toLowerCase();
  const terms = trimmed.split(/\s+/).filter(Boolean);

  // Normalize keys to { name, weight } form
  const normalizedKeys = keys.map((k) =>
    typeof k === "string" ? { name: k, weight: 1 } : k,
  );

  objectsArray.forEach((obj) => {
    // Get string values for each key
    const values = normalizedKeys.map((k) => {
      const raw = (obj as any)[k.name]; // skipcq: JS-0323
      return typeof raw === "string" ? raw.trim() : "";
    });

    if (terms.length <= 1) {
      // Single term: score each key, weighted average
      const scores = values.map((v) => (v ? fuzzyScore(v, terms[0]) : 0));
      const weights = normalizedKeys.map((k) => k.weight);
      const similarity = weightedAverage(scores, weights);

      if (similarity >= threshold) {
        results.push({ object: obj, similarity });
      }
    } else {
      // Multi-word: each term finds its best weighted score across keys.
      // All terms must match somewhere (min across terms).
      const termScores = terms.map((term) => {
        let best = 0;
        for (let i = 0; i < values.length; i++) {
          if (values[i]) {
            const s = fuzzyScore(values[i], term);
            if (s > best) best = s;
          }
        }
        return best;
      });

      const similarity = Math.min(...termScores);

      if (similarity >= threshold) {
        results.push({ object: obj, similarity });
      }
    }
  });

  results.sort((a, b) => b.similarity - a.similarity);

  return results.map((r) => r.object);
}
