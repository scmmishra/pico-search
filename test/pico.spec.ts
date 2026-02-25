import { expect, describe, it } from "vitest";
import { picoSearch } from "../src/pico";

const objects = [
  { name: "John Doe", age: 25, city: "New York" },
  { name: "Jane Smith", age: 35, city: "San Francisco" },
  { name: "Bob Johnson", age: 45, city: "Los Angeles" },
  { name: "Alice Williams", age: 55, city: "Boston" },
  { name: "Joe Brown", age: 65, city: "Washington DC" },
  { name: "Sherry Smith", age: 75, city: "Miami" },
  { name: "John Smith", age: 85, city: "Seattle" },
];

describe("picoSearch", () => {
  it("should return all objects if searchTerm is empty", () => {
    expect(picoSearch(objects, "", ["name"])).toEqual(objects);
  });

  it("should return an empty array if objectsArray is empty", () => {
    expect(picoSearch([], "hello", ["name"])).toEqual([]);
  });

  it("basic single-key search", () => {
    const result = picoSearch(objects, "John", ["name"]);
    const names = result.map((r) => r.name);
    expect(names).toContain("John Doe");
    expect(names).toContain("John Smith");
  });

  it("multi-key weighted search", () => {
    const keys = [
      { name: "name", weight: 5 },
      { name: "city", weight: 1 },
    ];
    const result = picoSearch(objects, "John", keys);
    // John Doe and John Smith should rank highest
    expect(result[0].name).toBe("John Doe");
  });

  it("multi-word query (space-separated terms)", () => {
    const result = picoSearch(objects, "John New", [
      { name: "name", weight: 3 },
      { name: "city", weight: 2 },
    ]);
    // Only John Doe lives in New York — should match both terms
    const names = result.map((r) => r.name);
    expect(names).toContain("John Doe");
  });

  it("missing/null data handling", () => {
    const data = [
      { name: "John Doe", city: null },
      { name: "Jane Smith", city: "Boston" },
    ];
    const keys = [
      { name: "name", weight: 5 },
      { name: "city", weight: 1 },
    ];
    // Should not throw
    const result = picoSearch(data, "John", keys);
    expect(result.map((r) => r.name)).toContain("John Doe");
  });

  it("threshold filtering", () => {
    const result = picoSearch(objects, "xyzxyz", ["name"], { threshold: 0.3 });
    expect(result).toEqual([]);
  });

  it("the 360dialog / '3' bug case", () => {
    const data = [
      { name: "360dialog" },
      { name: "Apple" },
      { name: "Google" },
    ];
    const result = picoSearch(data, "3", ["name"]);
    expect(result.map((r) => r.name)).toContain("360dialog");
  });

  it("subsequence matching ('jd' → 'John Doe')", () => {
    const result = picoSearch(objects, "jd", ["name"]);
    expect(result.map((r) => r.name)).toContain("John Doe");
  });

  it("should find 'The Shawshank Redemption' with abbreviated search", () => {
    const movies = [
      { title: "The Shawshank Redemption" },
      { title: "The Godfather" },
      { title: "Shrek" },
    ];
    const result = picoSearch(movies, "shwshnk", ["title"]);
    expect(result.map((r) => r.title)).toContain("The Shawshank Redemption");
  });

  it("should prefer exact prefix matches in ranking", () => {
    const data = [
      { name: "Crocodile Dundee" },
      { name: "Django Unchained" },
      { name: "The Deer Hunter" },
    ];
    const result = picoSearch(data, "Dund", ["name"]);
    expect(result[0].name).toBe("Crocodile Dundee");
  });
});
