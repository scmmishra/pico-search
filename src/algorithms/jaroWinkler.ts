/**
 * Calculates the Jaro-Winkler distance between two strings.
 * @param a The first string to compare.
 * @param b The second string to compare.
 * @returns A floating-point number between 0 and 1, where 0 means the strings are completely dissimilar and 1 means they are identical.
 */
export default function jaroWinkler(str1: string, str2: string): number {
  // Compute Jaro-Winkler distance between two string
  str1 = str1.trim().toLowerCase();
  str2 = str2.trim().toLowerCase();

  // Swap strings if str1 is shorter than string 2
  if (str1.length < str2.length) {
    const tempString: string = str1;
    str1 = str2;
    str2 = tempString;
  }

  let len1: number = str1.length;
  let len2: number = str2.length;
  if (!len2) {
    return 0.0;
  }

  const delta: number = Math.max(1, len1 / 2.0) - 1.0;

  // Flags for transpositions
  let flag: boolean[] = Array(len2).fill(false);
  let ch1Match: string[] = Array(len1).fill("");
  // Count number of matching characters
  let matches = 0;
  // Check if characters on both string matches
  for (let i: number = 0; i < len1; i++) {
    const ch1: string = str1[i];
    for (let j = 0; j < len2; j++) {
      const ch2: string = str2[j];
      if (j <= i + delta && j + delta >= 1 && ch1 == ch2 && !flag[j]) {
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
  let transpositions: number = 0.0;
  for (let i: number = 0, j: number = 0; j < len2; j++) {
    if (flag[j]) {
      if (str2[j] != ch1Match[i]) {
        transpositions++;
      }
      i++;
    }
  }

  const m: number = matches;

  // Jaro Similarity Formula simj = ( (m / length of s1) + (m / length of s2) + (m - t) / m ) / 3
  const jaro: number =
    (m / len1 + m / len2 + (m - transpositions / 2.0) / m) / 3.0;

  // Length of common prefix between string up to 4 characters
  let commonPrefix: number = 0.0;
  len2 = Math.min(4, len2);

  for (let i: number = 0; i < len2; i++) {
    if (str1[i] == str2[i]) {
      commonPrefix++;
    }
  }

  return jaro + commonPrefix * 0.1 * (1.0 - jaro);
}
