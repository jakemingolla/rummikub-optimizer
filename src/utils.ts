/**
 * Generate all possible combinations of a collection.
 * @param collection - The collection to generate combinations from.
 * @returns An array of all possible combinations.
 */
export const generateCombinations = <T>(collection: T[]): T[][] => {
  const combinations: T[][] = [];
  const n = collection.length;
  const max = 1 << n;

  for (let i = 0; i < max; i++) {
    const combination: T[] = [];
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        combination.push(collection[j]!);
      }
    }
    if (combination.length > 0) {
      combinations.push(combination);
    }
  }
  return combinations;
};

/**
 * Generate all possible combinations of a collection while ensuring at least k elements remain.
 * @param collection - The collection to generate combinations from.
 * @param k - The minimum number of elements that must remain in the original array.
 * @returns An array of all possible combinations that leave at least k elements.
 */
export const generateCombinationsWithMinRemaining = <T>(
  collection: T[],
  k: number,
): T[][] => {
  const combinations: T[][] = [];
  const n = collection.length;

  // If k >= n, no valid combinations exist
  if (k >= n) {
    return combinations;
  }

  // Maximum size of combination is n - k (to leave at least k elements)
  const maxSize = n - k;

  // Generate combinations of all sizes from 1 to maxSize
  for (let size = 1; size <= maxSize; size++) {
    const sizeCombinations = generateCombinationsOfSize(collection, size);
    combinations.push(...sizeCombinations);
  }

  return combinations;
};

/**
 * Generate all combinations of a specific size from a collection.
 * @param collection - The collection to generate combinations from.
 * @param size - The size of each combination.
 * @returns An array of all combinations of the specified size.
 */
const generateCombinationsOfSize = <T>(
  collection: T[],
  size: number,
): T[][] => {
  const combinations: T[][] = [];
  const n = collection.length;

  if (size > n || size <= 0) {
    return combinations;
  }

  // Use bit manipulation to generate combinations of specific size
  const max = 1 << n;

  for (let i = 0; i < max; i++) {
    // Count set bits to check if this combination has the right size
    let bitCount = 0;
    for (let j = 0; j < n; j++) {
      if (i & (1 << j)) {
        bitCount++;
      }
    }

    // If this combination has the right size, add it
    if (bitCount === size) {
      const combination: T[] = [];
      for (let j = 0; j < n; j++) {
        if (i & (1 << j)) {
          combination.push(collection[j]!);
        }
      }
      combinations.push(combination);
    }
  }

  return combinations;
};

/**
 * Generate all possible combinations of a collection of nested collections.
 * @param input - The input to generate combinations from.
 * @returns An array of all possible combinations.
 * @example
 * ```ts
  const arrays = [{ id: "first", values: [1,2] }, { id: "second", values: [3,4] }]

  [
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
  ```
*/
export const generateNestedCombinations = <T>(
  input: { id: string; values: T[] }[],
): { id: string; values: T[] }[][] => {
  if (input.length === 0) return [];

  // Generate combinations for each input array
  const combinationsPerInput = input.map(({ id, values }) => {
    const isNestedArray = values.length > 0 && Array.isArray(values[0]);
    const combinations = isNestedArray
      ? values.map((value) => ({ id, values: [value] }))
      : generateCombinations(values).map((combination) => ({
          id,
          values: combination,
        }));
    return combinations;
  });

  const result: { id: string; values: T[] }[][] = [];

  // For single input: only individual combinations
  if (input.length === 1) {
    return combinationsPerInput[0]!
      .filter((combination) => combination.values.length === 1)
      .map((combination) => [combination]);
  }

  // For multiple inputs: all individual combinations + cross-products
  combinationsPerInput.forEach((combinations) => {
    combinations.forEach((combination) => result.push([combination]));
  });

  // Generate cross-products between first two arrays
  combinationsPerInput[0]!.forEach((first) => {
    combinationsPerInput[1]!.forEach((second) => {
      result.push([first, second]);
    });
  });

  return result;
};
