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

describe("picoSearch: label search", () => {
  const items = [
    { label: "360dialog" },
    { label: "bot-attended" },
    { label: "bot-unattended" },
    { label: "hello-world" },
    { label: "help-center" },
    { label: "high-priority" },
    { label: "customer-support" },
    { label: "cust-success" },
    { label: "auto-reply" },
    { label: "auto-resolve" },
    { label: "self-service" },
    { label: "sla-breach" },
    { label: "first-response" },
    { label: "feature-request" },
    { label: "bug-report" },
    { label: "v2-migration" },
    { label: "v2-beta" },
    { label: "needs-triage" },
    { label: "do-not-disturb" },
    { label: "whatsapp-business" },
  ];

  const search = (term: string) => picoSearch(items, term, ["label"]);
  const labels = (term: string) => search(term).map((r) => r.label);

  // Numeric prefix
  it("'3' finds '360dialog'", () => {
    expect(labels("3")).toContain("360dialog");
  });

  it("'360' ranks '360dialog' first", () => {
    expect(search("360")[0].label).toBe("360dialog");
  });

  // Exact segment match
  it("'hello' finds 'hello-world'", () => {
    expect(search("hello")[0].label).toBe("hello-world");
  });

  // Prefix ambiguity: "hel" matches hello-world and help-center
  it("'hel' finds both 'hello-world' and 'help-center'", () => {
    const r = labels("hel");
    expect(r).toContain("hello-world");
    expect(r).toContain("help-center");
  });

  // Disambiguating further
  it("'help' ranks 'help-center' above 'hello-world'", () => {
    expect(search("help")[0].label).toBe("help-center");
  });

  // Hyphenated exact
  it("'bot-attended' ranks exact over 'bot-unattended'", () => {
    expect(search("bot-attended")[0].label).toBe("bot-attended");
  });

  // Second segment search
  it("'reply' finds 'auto-reply'", () => {
    expect(labels("reply")).toContain("auto-reply");
  });

  // Subsequence across hyphen: "ar" → auto-reply (a...r)
  it("'ar' finds 'auto-reply' and 'auto-resolve'", () => {
    const r = labels("ar");
    expect(r).toContain("auto-reply");
    expect(r).toContain("auto-resolve");
  });

  // Contiguous mid-string
  it("'breach' finds 'sla-breach'", () => {
    expect(labels("breach")).toContain("sla-breach");
  });

  // Scattered subsequence: "cs" → customer-support, cust-success
  it("'cs' finds 'customer-support' and 'cust-success'", () => {
    const r = labels("cs");
    expect(r).toContain("customer-support");
    expect(r).toContain("cust-success");
  });

  // Short prefix on long label
  it("'wha' finds 'whatsapp-business'", () => {
    expect(search("wha")[0].label).toBe("whatsapp-business");
  });

  // Version prefix: "v2" matches both v2 labels
  it("'v2' finds both 'v2-migration' and 'v2-beta'", () => {
    const r = labels("v2");
    expect(r).toContain("v2-migration");
    expect(r).toContain("v2-beta");
  });

  // Disambiguate version labels
  it("'v2b' finds 'v2-beta'", () => {
    expect(labels("v2b")).toContain("v2-beta");
  });

  // Subsequence: "fr" → first-response, feature-request
  it("'fr' finds 'first-response' and 'feature-request'", () => {
    const r = labels("fr");
    expect(r).toContain("first-response");
    expect(r).toContain("feature-request");
  });

  // Full second segment
  it("'request' finds 'feature-request'", () => {
    expect(labels("request")).toContain("feature-request");
  });

  // "bug" is unambiguous
  it("'bug' finds only 'bug-report'", () => {
    const r = labels("bug");
    expect(r).toEqual([{ label: "bug-report" }].map((x) => x.label));
  });

  // Tricky: "dnd" subsequence → do-not-disturb
  it("'dnd' finds 'do-not-disturb'", () => {
    expect(labels("dnd")).toContain("do-not-disturb");
  });

  // "self" as prefix of first segment
  it("'self' finds 'self-service'", () => {
    expect(search("self")[0].label).toBe("self-service");
  });

  // No match at all
  it("'zzz' returns nothing", () => {
    expect(search("zzz")).toEqual([]);
  });

  // Longer scattered subsequence: "ntriage" → needs-triage
  it("'ntriage' finds 'needs-triage'", () => {
    expect(labels("ntriage")).toContain("needs-triage");
  });

  // "hi" is short and ambiguous — should find high-priority
  it("'hi' finds 'high-priority'", () => {
    expect(labels("hi")).toContain("high-priority");
  });

  // Hyphen in search term treated as literal character
  it("'auto-re' finds both 'auto-reply' and 'auto-resolve'", () => {
    const r = labels("auto-re");
    expect(r).toContain("auto-reply");
    expect(r).toContain("auto-resolve");
  });
});
