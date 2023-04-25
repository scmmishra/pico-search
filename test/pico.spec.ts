import { expect, describe, it } from "vitest";
import { picoSearch } from "../src/pico";

describe("picoSearch", () => {
  const objects = [
    { name: "John Doe", age: 25, city: "New York" },
    { name: "Jane Smith", age: 35, city: "San Francisco" },
    { name: "Bob Johnson", age: 45, city: "Los Angeles" },
    { name: "Alice Williams", age: 55, city: "Boston" },
  ];

  it("should return an empty array if objectsArray is empty", () => {
    expect(picoSearch([], "hello", ["name"])).toEqual([]);
  });

  it("should return all objects if searchTerm is an empty string", () => {
    expect(picoSearch(objects, "", ["name"])).toEqual(objects);
  });

  it("should return objects that match the searchTerm", () => {
    expect(picoSearch(objects, "John", ["name"])).toEqual([
      { name: "John Doe", age: 25, city: "New York" },
      { name: "Bob Johnson", age: 45, city: "Los Angeles" },
    ]);

    expect(picoSearch(objects, "Boston", ["city"])).toEqual([
      { name: "Alice Williams", age: 55, city: "Boston" },
    ]);
  });

  it("should prioritize results based on distance", () => {
    const expected = [
      { name: "John Doe", age: 25, city: "New York" },
      { name: "Jane Smith", age: 35, city: "San Francisco" },
      { name: "Bob Johnson", age: 45, city: "Los Angeles" },
    ];
    expect(
      picoSearch(objects, "ohn", ["name"], { algorithm: "jaroWinkler" })
    ).toEqual(expected);
  });

  it("should take into account weights for different keys", () => {
    const expected = [{ name: "John Doe", age: 25, city: "New York" }];

    const keys = [
      { name: "name", weight: 3 },
      { name: "city", weight: 2 },
    ];

    expect(picoSearch(objects, "John", keys)).toEqual(expected);
  });

  it("should use Jaro-Winkler distance algorithm when specified", () => {
    const expected = [
      { name: "John Doe", age: 25, city: "New York" },
      { name: "Bob Johnson", age: 45, city: "Los Angeles" },
      { name: "Jane Smith", age: 35, city: "San Francisco" },
    ];

    expect(
      picoSearch(objects, "John", ["name"], { algorithm: "jaroWinkler" })
    ).toEqual(expected);
  });
});
