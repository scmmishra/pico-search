/**
 * fzf-style fuzzy score. Returns 0 (no match) to 1 (perfect match).
 * Forward scan finds a subsequence match, reverse scan tightens the window,
 * then scores reward consecutive runs, word-boundary hits, and prefix matches.
 */
export default function fuzzyScore(target: string, pattern: string): number {
  if (pattern.length === 0) return 1;
  if (target.length === 0) return 0;

  const tLower = target.toLowerCase();
  const pLower = pattern.toLowerCase();

  if (tLower === pLower) return 1;

  const pLen = pLower.length;

  // Forward pass: find first valid subsequence (greedy left-to-right)
  let pi = 0;
  let endPos = -1;
  for (let ti = 0; ti < tLower.length; ti++) {
    if (tLower[ti] === pLower[pi]) {
      pi++;
      if (pi === pLen) { endPos = ti; break; }
    }
  }
  if (endPos === -1) return 0; // no subsequence match

  // Reverse pass: tighten the window from endPos backwards
  let startPos = endPos;
  for (pi = pLen - 1; pi >= 0; pi--) {
    while (tLower[startPos] !== pLower[pi]) startPos--;
    startPos--;
  }
  startPos++; // startPos was decremented one extra time

  // Score the window [startPos..endPos]
  let score = 0;
  let consecutive = 0;
  pi = 0;

  for (let ti = startPos; ti <= endPos; ti++) {
    if (tLower[ti] === pLower[pi]) {
      consecutive++;
      score += consecutive;

      if (ti === 0) score += 2;
      else if (isBoundary(target, ti)) score += 1.5;

      pi++;
    } else {
      consecutive = 0;
    }
  }

  // Normalize against ideal (consecutive run + first-position bonus)
  const maxScore = (pLen * (pLen + 1)) / 2 + 2;
  const raw = Math.min(1, score / maxScore);

  // Mild length penalty — prefer shorter targets as a tiebreaker
  const lengthPenalty = 1 - 0.1 * (1 - pLen / target.length);

  return raw * lengthPenalty;
}

/** Check if position `i` in `str` is a word boundary (camelCase, separator). */
function isBoundary(str: string, i: number): boolean {
  if (i === 0) return true;
  const prev = str[i - 1];
  const curr = str[i];
  if (" _-./".includes(prev)) return true;
  if (prev === prev.toLowerCase() && curr === curr.toUpperCase() && curr !== curr.toLowerCase()) return true;
  return false;
}
