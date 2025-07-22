import { describe, expect, test } from "bun:test";
import {
  generateCombinations,
  generateCombinationsWithMinRemaining,
  generateNestedCombinations,
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

  describe("generateNestedCombinations", () => {
    test("should generate all possible combinations", () => {
      const arrays = [
        { id: "first", values: [1, 2] },
        { id: "second", values: [3, 4] },
      ];
      // prettier-ignore
      const expected = [
          [{ id: "first", values: [1] }],
          [{ id: "first", values: [2] }],
          [{ id: "second", values: [3] }],
          [{ id: "second", values: [4] }],
          [{ id: "first", values: [1, 2] }],
          [{ id: "second", values: [3, 4] }],
          [{ id: "first", values: [1] }, { id: "second", values: [3] }],
          [{ id: "first", values: [1] }, { id: "second", values: [4] }],
          [{ id: "first", values: [2] }, { id: "second", values: [3] }],
          [{ id: "first", values: [2] }, { id: "second", values: [4] }],
          [{ id: "first", values: [1, 2] }, { id: "second", values: [3] }],
          [{ id: "first", values: [1, 2] }, { id: "second", values: [4] }],
          [{ id: "first", values: [1] }, { id: "second", values: [3, 4] }],
          [{ id: "first", values: [2] }, { id: "second", values: [3, 4] }],
          [{ id: "first", values: [1, 2] }, { id: "second", values: [3, 4] }],
        ]
      const result = generateNestedCombinations(arrays);
      expect(result.length).toBe(expected.length);

      // Sort both arrays to make the comparison order-independent
      const sortCombinations = (
        combinations: { id: string; values: number[] }[][],
      ) => {
        return combinations.sort((a, b) => {
          // Sort by the first item's id, then by the first item's values
          const aFirst = a[0]!;
          const bFirst = b[0]!;
          if (aFirst.id !== bFirst.id) {
            return aFirst.id.localeCompare(bFirst.id);
          }
          return JSON.stringify(aFirst.values).localeCompare(
            JSON.stringify(bFirst.values),
          );
        });
      };

      const sortedResult = sortCombinations(result);
      const sortedExpected = sortCombinations(expected);
      expect(sortedResult).toEqual(sortedExpected);
    });

    test("cannot reuse an id more than once", () => {
      const array = [{ id: "first", values: [1, 2, 3, 4] }];
      const result = generateNestedCombinations(array);
      expect(result).toEqual([
        [{ id: "first", values: [1] }],
        [{ id: "first", values: [2] }],
        [{ id: "first", values: [3] }],
        [{ id: "first", values: [4] }],
      ]);
    });

    test("cannot reuse an id more than once with nested arrays", () => {
      const array = [{ id: "first", values: [[1], [2], [3], [4]] }];
      const result = generateNestedCombinations(array);
      expect(result).toEqual([
        [{ id: "first", values: [[1]] }],
        [{ id: "first", values: [[2]] }],
        [{ id: "first", values: [[3]] }],
        [{ id: "first", values: [[4]] }],
      ]);
    });
  });
});
