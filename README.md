<div align="center">
<br>
<br>
<p>
  <img src=".github/mascot.png" style="height: 150px;">
  <h1>pico-search</h1>
</p>
<br>
<br>

![npm](https://img.shields.io/npm/dm/%40scmmishra%2Fpico-search)

</div>

PicoSearch is a lightweight fuzzy search JavaScript library that provides developers with an easy-to-use, efficient way to perform fuzzy searches on arrays of objects. It uses an fzf-style subsequence matching algorithm with word boundary awareness, and allows for weighting of search keys. At under 750 bytes (minified + brotli), it's an excellent choice for developers looking for a fast, lightweight search solution.

[Try on CodeSandbox](https://codesandbox.io/s/picosearch-demo-i79btf)

## Installation

```sh
pnpm install @scmmishra/pico-search
```

```sh
npm install @scmmishra/pico-search
```

```sh
yarn add @scmmishra/pico-search
```

## Usage

PicoSearch exposes a single function: `picoSearch()`. This function takes an array of objects, a search term, an array of keys to search against, and an optional config argument. It returns an array of objects that match the search term, ranked by relevance. You can find the [typedoc here](https://paka.dev/npm/@scmmishra/pico-search/api)

```typescript
import { picoSearch } from "@scmmishra/pico-search";

interface Person {
  name: string;
  age: number;
}

const people: Person[] = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 35 },
  { name: "David", age: 40 },
];

const searchTerm = "ali";
const keys = ["name"];

const results = picoSearch(people, searchTerm, keys);
console.log(results); // [{ name: "Alice", age: 25 }]
```

Subsequence matching means you can type scattered characters and still find results:

```typescript
picoSearch(people, "cd", ["name"]);
// [{ name: "Charlie", age: 35 }, { name: "David", age: 40 }]
```

Multi-word queries match each term independently across all keys:

```typescript
const data = [
  { name: "John Doe", city: "New York" },
  { name: "Jane Smith", city: "Boston" },
];

picoSearch(data, "John New", [
  { name: "name", weight: 3 },
  { name: "city", weight: 2 },
]);
// [{ name: "John Doe", city: "New York" }]
```

## Options

### Weighted Keys

By default, all keys passed to `picoSearch()` are weighted equally. You can specify a weight for a specific key by passing an object with `name` and `weight` properties instead of a string in the `keys` array.

```typescript
const keys = [{ name: "name", weight: 2 }, "age"];
```

Weights are relative, so a key with a weight of 2 will be considered twice as important as a key with a weight of 1.

### Threshold

PicoSearch includes a minimum score threshold to filter out weak matches. The default threshold is 0.3. You can adjust it in the config:

```typescript
const results = picoSearch(people, searchTerm, keys, {
  threshold: 0.5,
});
```

Higher values return fewer, more precise results. Lower values return more results with looser matching.

## How it works

PicoSearch uses a greedy forward+reverse subsequence scan inspired by fzf:

1. **Forward scan** finds the first valid subsequence match
2. **Reverse scan** tightens the match to the smallest window
3. **Scoring** rewards consecutive character runs, word boundary matches (spaces, hyphens, camelCase), and prefix hits
4. **Normalization** with a mild length penalty prefers shorter targets as a tiebreaker

## License

PicoSearch is released under the MIT License. See LICENSE for details.
