import { expect, describe, it } from "vitest";
import { picoSearch } from "../src/pico";

const knownPairs = [
  {
    shouldWork: "The Shawshank Redemption",
    shouldNotWork: "Shrek",
    searchTerm: "shawshank",
  },
  {
    shouldWork: "Crocodile Dundee",
    shouldNotWork: "Madagascar 3: Europe's Most Wanted",
    searchTerm: "Dund",
  },
  {
    shouldWork: "Crocodile Dundee",
    shouldNotWork: "Django Unchained",
    searchTerm: "Dund",
  },
  {
    shouldWork: "Crocodile Dundee",
    shouldNotWork: "The Deer Hunter",
    searchTerm: "Dund",
  },
];

describe("splitWordsAndRank", () => {
  it("should perform correctly for known pairs", () => {
    knownPairs.forEach(({ shouldWork, shouldNotWork, searchTerm }) => {
      const result = picoSearch(
        [{ name: shouldNotWork }, { name: shouldWork }],
        searchTerm,
        ["name"],
      );

      const names = result.map((r) => r.name);

      expect(names).toMatchObject([shouldWork]);
    });
  });
});

describe("picoSearch: jaroWinkler [default]", () => {
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
    expect(picoSearch([], "hello", ["name"])).toMatchObject([]);
  });

  it("should return all objects if searchTerm is an empty string", () => {
    expect(picoSearch(objects, "", ["name"])).toMatchObject([
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
    expect(picoSearch(objects, "John", ["name"])).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 85, city: "Seattle", name: "John Smith" },
      { age: 45, city: "Los Angeles", name: "Bob Johnson" },
      { age: 65, city: "Washington DC", name: "Joe Brown" },
    ]);

    expect(picoSearch(objects, "Boston", ["city"])).toMatchObject([
      { age: 55, city: "Boston", name: "Alice Williams" },
      { age: 45, city: "Los Angeles", name: "Bob Johnson" },
    ]);
  });

  it("should prioritize results based on distance", () => {
    expect(
      picoSearch(objects, "ohn", ["name"], {
        threshold: 0.7,
      }),
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

    expect(picoSearch(objects, "John", keys)).toMatchObject([
      { age: 25, city: "New York", name: "John Doe" },
      { age: 85, city: "Seattle", name: "John Smith" },
      { age: 45, city: "Los Angeles", name: "Bob Johnson" },
      { age: 65, city: "Washington DC", name: "Joe Brown" },
    ]);
  });

  it("should work even if some data is missing", () => {
    const keys = [
      { name: "name", weight: 5 },
      { name: "city", weight: 1 },
    ];

    const objects = [
      { name: "John Doe", age: 25, city: null },
      { name: "Jane Smith", age: 35, city: null },
      { name: "Bob Johnson", age: 45, city: null },
      { name: "Alice Williams", age: 55, city: "Boston" },
      { name: "Joe Brown", age: 65, city: "Washington DC" },
      { name: "Sherry Smith", age: 75, city: "Miami" },
      { name: "John Smith", age: 85, city: "Seattle" },
    ];

    expect(picoSearch(objects, "John", keys)).toMatchObject([
      { age: 25, city: null, name: "John Doe" },
      { age: 85, city: "Seattle", name: "John Smith" },
      { age: 45, city: null, name: "Bob Johnson" },
      { age: 65, city: "Washington DC", name: "Joe Brown" },
    ]);
  });
});
