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
