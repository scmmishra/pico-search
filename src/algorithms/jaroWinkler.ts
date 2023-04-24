/**
 * Calculates the Jaro-Winkler distance between two strings.
 * @param a The first string to compare.
 * @param b The second string to compare.
 * @returns A floating-point number between 0 and 1, where 0 means the strings are completely dissimilar and 1 means they are identical.
 */
export default function jaroWinkler(a: string, b: string): number {
  // Jaro distance
  const m: boolean[] = []; // match flags
  let matches = 0;
  let transpositions = 0;
  let aMatch = "";
  let bMatch = "";

  const len1 = a.length;
  const len2 = b.length;
  const maxDistance = Math.floor(Math.max(len1, len2) / 2) - 1;

  // Calculate matches and transpositions for Jaro distance
  for (let i = 0; i < len1; i++) {
    const start = Math.max(0, i - maxDistance);
    const end = Math.min(i + maxDistance + 1, len2);
    for (let j = start; j < end; j++) {
      if (m[j] || a[i] !== b[j]) {
        continue;
      }
      m[j] = true;
      matches++;
      if (i === j) {
        // Exact match
        aMatch += a[i];
      } else {
        // Partial match
        aMatch += a[i];
        bMatch += b[j];
        transpositions++;
      }
      break;
    }
  }

  // Check for zero matches
  if (matches === 0) {
    return 0;
  }

  // Calculate Jaro distance
  const jaroDistance =
    (matches / len1 +
      matches / len2 +
      (matches - transpositions / 2) / matches) /
    3;

  // Jaro-Winkler distance
  let prefix = 0;

  // Calculate prefix match for Jaro-Winkler distance
  while (a[prefix] === b[prefix] && prefix < 4) {
    prefix++;
  }

  // Calculate Jaro-Winkler distance
  const jaroWinklerDistance = jaroDistance + prefix * 0.1 * (1 - jaroDistance);

  return jaroWinklerDistance;
}
