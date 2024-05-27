import { bench, describe } from "vitest";
import { picoSearch } from "../src/pico";
import jaroWinkler from "../src/algorithms/jaroWinkler";

// generate 10000 random strings of 10 characters
const testData = Array.from({ length: 50000 }, (ii) => {
  return {
    name: `some-text data-point-${ii}`,
  };
});

describe("picoSearch", () => {
  bench("Search 50K items", () => {
    picoSearch(testData, "data-point-39900", ["name"], { threshold: 0.8 });
  });
});

describe("jaroWinkler", () => {
  bench("Find distance", () => {
    testData.forEach(({ name }) => {
      jaroWinkler(name, "data-point-12345");
    });
  });
});
