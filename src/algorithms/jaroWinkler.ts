/**
 * Calculates the Jaro-Winkler similarity between two strings.
 * @param {string} str1 - The first string to compare.
 * @param {string} str2 - The second string to compare.
 * @returns {number} A value between 0 and 1 indicating the similarity between the two strings, where 1 means the strings are identical and 0 means the strings are completely different.
 */
export default function jaroWinkler(str1: string, str2: string): number {
  // Swap strings if str1 is shorter than string 2
  if (str1.length < str2.length) {
    [str1, str2] = [str2, str1];
  }

  const len1 = str1.length;
  const len2 = str2.length;

  if (len1 === 0) return 0.0;
  if (len2 === 0) return 0.0;

  const delta = Math.floor(len1 / 2) - 1;

  // Flags for transpositions
  const flag = Array(len2).fill(false);
  const ch1Match = Array(len1).fill("");

  // Count number of matching characters
  let matches = 0;
  // Check if characters on both string matches
  for (let i = 0; i < len1; i++) {
    const ch1: string = str1[i];
    for (let j = 0; j < len2; j++) {
      const ch2: string = str2[j];
      if (j <= i + delta && j + delta >= 1 && ch1 === ch2 && !flag[j]) {
        flag[j] = true;
        ch1Match[matches++] = ch1;
        break;
      }
    }
  }

  if (!matches) {
    return 0;
  }

  // Count number of transpositions (shared characters placed in different positions)
  let transpositions = 0.0;
  for (let i = 0, j = 0; j < len2; j++) {
    if (flag[j]) {
      if (str2[j] !== ch1Match[i]) {
        transpositions++;
      }
      i++;
    }
  }

  const mCount: number = matches;

  // Jaro Similarity Formula simj = ( (m / length of s1) + (m / length of s2) + (m - t) / m ) / 3
  const jaro: number =
    (mCount / len1 + mCount / len2 + (mCount - transpositions / 2.0) / mCount) /
    3.0;

  // Length of common prefix between string up to 4 characters
  let commonPrefix = 0.0;
  const prefixLength = Math.min(4, len2);

  for (let i = 0; i < prefixLength; i++) {
    if (str1[i] === str2[i]) {
      commonPrefix++;
    }
  }

  return jaro + commonPrefix * 0.1 * (1.0 - jaro);
}
