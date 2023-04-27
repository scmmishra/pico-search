import { describe, expect, it } from "vitest";
import jaroWinkler from "../../src/algorithms/jaroWinkler";

const pairs: Array<[string, string, number]> = [
  ["computer", "cucumber", 0.7149], // words with similar characters but different length
  ["hello", "world", 0.49], // words with no common characters
  ["elephant", "relevant", 0.833], // words with common characters but different order
  ["bake", "cake", 0.8833], // short words with one letter difference
  ["test", "rest", 0.8833], // short words with one letter difference
  ["backpack", "knapsack", 0.777], // longer words with similar characters and same length
  ["education", "adoption", 0.7], // words with no common characters
  ["world", "words", 0.9066], // words with similar characters but different length
  ["faith", "fate", 0.8266], // short words with similar characters but different length
  ["measure", "treasure", 0.8690476190476191], // longer words with similar characters and same length
  ["music", "magic", 0.7866], // short words with similar characters and same length
  ["information", "reformation", 0.8585], // longer words with similar characters but different length
  ["expect", "accept", 0.7249], // short words with similar characters but different length
  ["ceremony", "ceramics", 0.76666], // words with similar characters but different length and different order
  ["consult", "insult", 0.849], // short words with similar characters and same length but different order
  ["keyboard", "keychain", 0.76666], // words with similar characters but different length and different order
  ["toddler", "older", 0.854], // words with no common characters and different length
  ["republic", "public", 0.916], // longer words with one letter difference
  ["decision", "precision", 0.884], // longer words with similar characters and same length but different order

  // extreme cases
  ["apple", "", 0], // an empty string compared to a non-empty string
  ["💻🔋🚀", "🚀🔋💻", 0.8288], // strings containing emojis that look similar but in different orders
  ["racecar", "abcdefghijklmnopqrstuvwxyz", 0.46758241758241764], // a string with all distinct characters compared to a palindrome
  ["one", "two", 0], // words with no common characters
  ["thisisaverylongwordthatdoesnotmatchtheotherword", "word", 0.611], // a very long string compared to a short string
  ["abcdefghijklmnopqrstuvwxyz", "abcdefghijklmnopqrstuvwxyz", 1], // a long string compared to itself
  ["abcde", "vwxyz", 0], // words with no common characters
  ["red", "blue", 0.527], // words with no common characters
  ["aaaaaab", "aaaaaac", 0.942], // strings with long common prefix but different last character
  [
    "a",
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    0.704,
  ], // a very long string compared to a single character
  ["b", "a", 0], // short words with no common characters
];

describe("jaroWinkler", () => {
  it("should return correct value based on pairs", () => {
    pairs.map(([str1, str2, expected]) => {
      expect(jaroWinkler(str1, str2)).toBeCloseTo(expected, 2);
    });
  });
});
