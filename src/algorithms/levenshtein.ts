/**
 * Calculates the Levenshtein similarity between two words.
 * @param {string} word1 - The first word to compare.
 * @param {string} word2 - The second word to compare.
 * @returns {number} A value between 0 and 1 indicating the similarity between the two words,
 * where 1 means the words are identical and 0 means the words are completely different.
 */
export default function levenshtein(word1: string, word2: string): number {
  const distance = levenshteinDistance(word1, word2);
  const maxLength = Math.max(word1.length, word2.length);
  return 1 - distance / maxLength;
}

/**
 * Calculates the Levenshtein distance between two words.
 * @param {string} word1 - The first word to compare.
 * @param {string} word2 - The second word to compare.
 * @returns {number} The Levenshtein distance between the two words.
 */
function levenshteinDistance(word1: string, word2: string): number {
  const m = word1.length;
  const n = word2.length;
  const dp = new Array(m + 1).fill(0).map(() => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j] + 1
        );
      }
    }
  }

  return dp[m][n];
}
