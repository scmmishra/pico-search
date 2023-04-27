import { describe, expect, it } from "vitest";
import levenshtein from "../../src/algorithms/levenshtein";

const pairs: Array<[string, string, number]> = [
  ["computer", "cucumber", 0.375], // words with similar characters but different length
  ["hello", "world", 0.19999999999999996], // words with no common characters
  ["elephant", "relevant", 0.625], // words with common characters but different order
  ["bake", "cake", 0.75], // short words with one letter difference
  ["test", "rest", 0.75], // short words with one letter difference
  ["backpack", "knapsack", 0.375], // longer words with similar characters and same length
  ["education", "adoption", 0.5555555555555556], // words with no common characters
  ["world", "words", 0.6], // words with similar characters but different length
  ["faith", "fate", 0.6], // short words with similar characters but different length
  ["measure", "treasure", 0.75], // longer words with similar characters and same length
  ["music", "magic", 0.6], // short words with similar characters and same length
  ["information", "reformation", 0.8181818181818181], // longer words with similar characters but different length
  ["expect", "accept", 0.33333333333333337], // short words with similar characters but different length
  ["ceremony", "ceramics", 0.5], // words with similar characters but different length and different order
  ["consult", "insult", 0.7142857142857143], // short words with similar characters and same length but different order
  ["keyboard", "keychain", 0.5], // words with similar characters but different length and different order
  ["toddler", "older", 0.5714285714285714], // words with no common characters and different length
  ["republic", "public", 0.75], // longer words with one letter difference
  ["decision", "precision", 0.7777777777777778], // longer words with similar characters and same length but different order

  // extreme cases
  ["apple", "", 0], // an empty string compared to a non-empty string
  ["💻🔋🚀", "🚀🔋💻", 0.6666666666666667], // strings containing emojis that look similar but in different orders
  ["racecar", "abcdefghijklmnopqrstuvwxyz", 0.11538461538461542], // a string with all distinct characters compared to a palindrome
  ["one", "two", 0], // words with no common characters
  [
    "thisisaverylongwordthatdoesnotmatchtheotherword",
    "word",
    0.08510638297872342,
  ], // a very long string compared to a short string
  ["abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz", 1], // a long string compared to itself
  ["abcde", "vwxyz", 0], // words with no common characters
  ["red", "blue", 0], // words with no common characters
  ["aaaaaab", "aaaaaac", 0.857], // strings with long common prefix but different last character
  [
    "a",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    0.015,
  ], // a very long string compared to a single character
  ["b", "a", 0], // short words with no common characters
];

describe("levenshetin", () => {
  it("should return correct value based on pairs", () => {
    pairs.forEach(([str1, str2, expected]) => {
      expect(levenshtein(str1, str2)).toBeCloseTo(expected, 2);
    });
  });
});
