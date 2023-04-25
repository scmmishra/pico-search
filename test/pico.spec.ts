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
    ]);
    expect(picoSearch(objects, "Boston", ["city"])).toEqual([
      { name: "Alice Williams", age: 55, city: "Boston" },
    ]);
  });

  it("should prioritize results based on distance", () => {
    const expected = [
      { name: "Bob Johnson", age: 45, city: "Los Angeles" },
      { name: "John Doe", age: 25, city: "New York" },
      { name: "Alice Williams", age: 55, city: "Boston" },
      { name: "Jane Smith", age: 35, city: "San Francisco" },
    ];
    expect(picoSearch(objects, "ohn", ["name"])).toEqual(expected);
  });

  it("should take into account weights for different keys", () => {
    const expected = [
      { name: "Jane Smith", age: 35, city: "San Francisco" },
      { name: "Bob Johnson", age: 45, city: "Los Angeles" },
      { name: "John Doe", age: 25, city: "New York" },
      { name: "Alice Williams", age: 55, city: "Boston" },
    ];
    const keys = [
      { name: "name", weight: 3 },
      { name: "age", weight: 1 },
      { name: "city", weight: 2 },
    ];
    expect(picoSearch(objects, "John", keys)).toEqual(expected);
  });

  it("should use Jaro-Winkler distance algorithm when specified", () => {
    const expected = [
      { name: "Jane Smith", age: 35, city: "San Francisco" },
      { name: "Bob Johnson", age: 45, city: "Los Angeles" },
      { name: "John Doe", age: 25, city: "New York" },
      { name: "Alice Williams", age: 55, city: "Boston" },
    ];
    expect(picoSearch(objects, "John", ["name"], "jaroWinkler")).toEqual(
      expected
    );
  });
});
