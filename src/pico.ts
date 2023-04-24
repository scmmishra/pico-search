interface SearchResult<T> {
  object: T;
  distance: number;
}

export function fuzzySearchObjects<T>(
  objectsArray: T[],
  searchTerm: string,
  keys: string[],
  algorithm: "levenshtein" | "jaroWinkler"
): T[] {
  const results: SearchResult<T>[] = [];

  objectsArray.forEach((obj) => {
    for (const key of keys) {
      if (
        Object.prototype.hasOwnProperty.call(obj, key) &&
        typeof (obj as any)[key] === "string"
      ) {
        const distance =
          algorithm === "levenshtein"
            ? levenshtein((obj as any)[key], searchTerm)
            : jaroWinkler((obj as any)[key], searchTerm);

        results.push({ object: obj, distance });
      }
    }
  });

  results.sort((a, b) => a.distance - b.distance);

  return results.map((result) => result.object);
}
