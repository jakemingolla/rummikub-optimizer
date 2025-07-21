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
