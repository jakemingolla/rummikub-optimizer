import { describe, expect, test } from "bun:test";
import {
  generateCombinations,
  generateCombinationsWithMinRemaining,
} from "../../src/utils";

describe("generateCombinations", () => {
  test("should generate all possible combinations", () => {
    const result = generateCombinations([1, 2, 3]);
    expect(result).toEqual([[1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]);
  });

  test("should return empty array for empty input", () => {
    const result = generateCombinations([]);
    expect(result).toEqual([]);
  });
});

describe("generateCombinationsWithMinRemaining", () => {
  test("should generate combinations leaving at least k elements - example 1", () => {
    const result = generateCombinationsWithMinRemaining([1, 2, 3, 4], 3);
    expect(result).toEqual([[1], [2], [3], [4]]);
  });

  test("should generate combinations leaving at least k elements - example 2", () => {
    const result = generateCombinationsWithMinRemaining([1, 2, 3], 1);
    expect(result).toEqual([[1], [2], [3], [1, 2], [1, 3], [2, 3]]);
  });

  test("should return empty array when k >= array length", () => {
    const result = generateCombinationsWithMinRemaining([1, 2, 3], 3);
    expect(result).toEqual([]);
  });

  test("should return empty array when k > array length", () => {
    const result = generateCombinationsWithMinRemaining([1, 2], 3);
    expect(result).toEqual([]);
  });

  test("should work with k = 0 (all combinations except empty)", () => {
    const result = generateCombinationsWithMinRemaining([1, 2, 3], 0);
    expect(result).toEqual([[1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]);
  });

  test("should not mutate the original array", () => {
    const original = [1, 2, 3];
    const originalCopy = [...original];
    generateCombinationsWithMinRemaining(original, 1);
    expect(original).toEqual(originalCopy);
  });

  test("should work with different data types", () => {
    const result = generateCombinationsWithMinRemaining(["a", "b", "c"], 1);
    expect(result).toEqual([
      ["a"],
      ["b"],
      ["c"],
      ["a", "b"],
      ["a", "c"],
      ["b", "c"],
    ]);
  });
});
