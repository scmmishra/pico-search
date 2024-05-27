import { bench, describe } from "vitest";
import { picoSearch } from "../src/pico";
import { weightedAverage, clamp, splitAndTrim } from "../src/utils";
import jaroWinkler from "../src/algorithms/jaroWinkler";

// generate 10000 random strings of 10 characters
const testData = Array.from({ length: 50000 }, (ii) => {
  return {
    name: `${Math.random() * 1000} data-point-${ii} fixed-target`,
  };
});

describe("picoSearch", () => {
  bench("Search 50K items", () => {
    picoSearch(testData, "data-point-39900", ["name"], { threshold: 0.8 });
  });

  bench("Search 5000 items", () => {
    picoSearch(testData.slice(0, 5000), "data-point-39900", ["name"], {
      threshold: 0.8,
    });
  });

  bench("Search 500 items", () => {
    picoSearch(testData.slice(0, 500), "data-point-39900", ["name"], {
      threshold: 0.8,
    });
  });
});

describe("utils: weightedAverage", () => {
  bench("specific weights", () => {
    weightedAverage([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
  });

  bench("uniform weights", () => {
    weightedAverage([1, 2, 3, 4, 5], [1, 1, 1, 1, 1]);
  });
});

describe("utils: clamp", () => {
  bench("base", () => {
    clamp(10);
  });
});

describe("utils: splitAndTrim", () => {
  bench("basic string", () => {
    splitAndTrim("Hello world");
  });
  bench("no spaces", () => {
    splitAndTrim("Helloworld");
  });
  bench("long string", () => {
    splitAndTrim("Hello world this is a good day");
  });
  bench("duplicates", () => {
    splitAndTrim("Hello hello this this this this");
  });
});

describe("jaroWinkler", () => {
  bench("Find distance", () => {
    testData.forEach(({ name }) => {
      jaroWinkler(name, "data-point-12345");
    });
  });
});
