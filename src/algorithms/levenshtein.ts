/**
 * Calculates the Damereau-Levenshtein similarity between two strings.
 * @param str1 The first string.
 * @param str2 The second string.
 * @returns The similarity between the two strings as a number between 0 and 1.
 */
function levenshtein(str1: string, str2: string): number {
  // Step 1: Initialize the matrix with the Levenshtein distance between each prefix of str1 and each prefix of str2.
  const m = str1.length;
  const n = str2.length;
  const d: number[][] = [];

  // Initialize the first column of the matrix to the Levenshtein distances between each prefix of str1 and an empty string.
  for (let i = 0; i <= m; i++) {
    d[i] = [];
    d[i][0] = i;
  }

  // Initialize the first row of the matrix to the Levenshtein distances between an empty string and each prefix of str2.
  for (let j = 1; j <= n; j++) {
    d[0][j] = j;
  }

  // Step 2: Compute the Levenshtein distance between each prefix of str1 and each prefix of str2 using dynamic programming.
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Calculate the cost of the substitution operation.
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;

      // Compute the minimum of the three possible operations: deletion, insertion, and substitution.
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Check if a transposition operation is possible and if it results in a smaller distance.
      if (
        i > 1 &&
        j > 1 &&
        str1[i - 1] === str2[j - 2] &&
        str1[i - 2] === str2[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + cost); // transposition
      }
    }
  }

  // Step 3: Calculate the similarity between the two strings as 1 minus the normalized Levenshtein distance.
  const distance = d[m][n];
  const maxLength = Math.max(m, n);
  const similarity = 1 - distance / maxLength;
  return similarity;
}
