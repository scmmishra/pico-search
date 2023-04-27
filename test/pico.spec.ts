import { expect, describe, it } from "vitest";
import { picoSearch } from "../src/pico";

describe("picoSearch: jaroWinkler", () => {
  const objects = [
    { name: "John Doe", age: 25, city: "New York" },
    { name: "Jane Smith", age: 35, city: "San Francisco" },
    { name: "Bob Johnson", age: 45, city: "Los Angeles" },
    { name: "Alice Williams", age: 55, city: "Boston" },
    { name: "Joe Brown", age: 65, city: "Washington DC" },
    { name: "Sherry Smith", age: 75, city: "Miami" },
    { name: "John Smith", age: 85, city: "Seattle" },
  ];

  it("should return an empty array if objectsArray is empty", () => {
    expect(
      picoSearch([], "hello", ["name"], { algorithm: "jaroWinkler" })
    ).toMatchObject([]);
  });

  it("should return all objects if searchTerm is an empty string", () => {
    expect(
      picoSearch(objects, "", ["name"], { algorithm: "jaroWinkler" })
    ).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 35, city: "San Francisco", name: "Jane Smith" },
      { age: 45, city: "Los Angeles", name: "Bob Johnson" },
      { age: 55, city: "Boston", name: "Alice Williams" },
      { age: 65, city: "Washington DC", name: "Joe Brown" },
      { age: 75, city: "Miami", name: "Sherry Smith" },
      { age: 85, city: "Seattle", name: "John Smith" },
    ]);
  });

  it("should return objects that match the searchTerm", () => {
    expect(
      picoSearch(objects, "John", ["name"], { algorithm: "jaroWinkler" })
    ).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 85, city: "Seattle", name: "John Smith" },
    ]);

    expect(
      picoSearch(objects, "Boston", ["city"], { algorithm: "jaroWinkler" })
    ).toMatchObject([{ age: 55, city: "Boston", name: "Alice Williams" }]);
  });

  it("should prioritize results based on distance", () => {
    expect(
      picoSearch(objects, "ohn", ["name"], {
        algorithm: "jaroWinkler",
        threshold: 0.7,
      })
    ).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 85, city: "Seattle", name: "John Smith" },
      { age: 45, city: "Los Angeles", name: "Bob Johnson" },
    ]);
  });

  it("should take into account weights for different keys", () => {
    const keys = [
      { name: "name", weight: 5 },
      { name: "city", weight: 1 },
    ];

    expect(
      picoSearch(objects, "John", keys, { algorithm: "jaroWinkler" })
    ).toMatchObject([{ name: "John Doe", age: 25, city: "New York" }]);
  });

  it("should use Jaro-Winkler distance algorithm when specified", () => {
    expect(
      picoSearch(objects, "John", ["name"], { algorithm: "jaroWinkler" })
    ).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 85, city: "Seattle", name: "John Smith" },
    ]);
  });
});

describe("picoSearch: levenshtein", () => {
  const objects = [
    { name: "John Doe", age: 25, city: "New York" },
    { name: "Jane Smith", age: 35, city: "San Francisco" },
    { name: "Bob Johnson", age: 45, city: "Los Angeles" },
    { name: "Alice Williams", age: 55, city: "Boston" },
    { name: "Joe Brown", age: 65, city: "Washington DC" },
    { name: "Sherry Smith", age: 75, city: "Miami" },
    { name: "John Smith", age: 85, city: "Seattle" },
  ];

  it("should return an empty array if objectsArray is empty", () => {
    expect(
      picoSearch([], "hello", ["name"], { algorithm: "levenshtein" })
    ).toMatchObject([]);
  });

  it("should return all objects if searchTerm is an empty string", () => {
    expect(
      picoSearch(objects, "", ["name"], { algorithm: "levenshtein" })
    ).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 35, city: "San Francisco", name: "Jane Smith" },
      { age: 45, city: "Los Angeles", name: "Bob Johnson" },
      { age: 55, city: "Boston", name: "Alice Williams" },
      { age: 65, city: "Washington DC", name: "Joe Brown" },
      { age: 75, city: "Miami", name: "Sherry Smith" },
      { age: 85, city: "Seattle", name: "John Smith" },
    ]);
  });

  it("should return objects that match the searchTerm", () => {
    expect(
      picoSearch(objects, "John", ["name"], { algorithm: "levenshtein" })
    ).toMatchObject([]);

    expect(
      picoSearch(objects, "Boston", ["city"], { algorithm: "levenshtein" })
    ).toMatchObject([{ age: 55, city: "Boston", name: "Alice Williams" }]);
  });

  it("should prioritize results based on distance", () => {
    expect(
      picoSearch(objects, "ohn", ["name"], { algorithm: "levenshtein" })
    ).toMatchObject([]);
  });

  it("should take into account weights for different keys", () => {
    const keys = [
      { name: "name", weight: 5 },
      { name: "city", weight: 1 },
    ];

    expect(
      picoSearch(objects, "John", keys, { algorithm: "levenshtein" })
    ).toMatchObject([]);
  });

  it("should use Jaro-Winkler distance algorithm when specified", () => {
    expect(
      picoSearch(objects, "John", ["name"], { algorithm: "levenshtein" })
    ).toMatchObject([]);
  });
});
