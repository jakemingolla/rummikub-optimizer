import { describe, it, expect } from "bun:test";
import { generateCombinations } from "../../src/utils";

describe("generateCombinations", () => {
  it("should generate all possible combinations of a collection", () => {
    const collection = [1, 2, 3];
    const combinations = generateCombinations(collection);
    expect(combinations).toEqual([
      [1],
      [2],
      [1, 2],
      [3],
      [1, 3],
      [2, 3],
      [1, 2, 3],
    ]);
  });
});
