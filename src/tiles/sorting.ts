import { TileColor, NumberedTile, BoundJokerTile } from "./tile";
import type { TileOnBoard, Tile } from "./tile";

/**
 * Sorts a list of tiles by color.
 *
 * @param tiles - The tiles to sort.
 * @returns A record of tiles sorted by color.
 */
export const getSortedTilesByColor = (
  tiles: Tile[],
): Record<TileColor, TileOnBoard[]> => {
  const sortedTilesByColor: Record<TileColor, TileOnBoard[]> = Object.values(
    TileColor,
  ).reduce(
    (acc, color) => {
      acc[color as TileColor] = [];
      return acc;
    },
    {} as Record<TileColor, TileOnBoard[]>,
  );
  for (const tile of tiles) {
    if (tile instanceof NumberedTile) {
      const tilesOfSameColor = sortedTilesByColor[tile.getColor()];
      const index = sortedTilesByColor[tile.getColor()].findIndex(
        (t) => t.getNumber() > tile.getNumber(),
      );
      if (index === -1) {
        tilesOfSameColor.push(tile);
      } else {
        tilesOfSameColor.splice(index, 0, tile);
      }
    }
  }
  return sortedTilesByColor;
};

/**
 * Sorts a list of tile runs by length.
 *
 * @param tiles - The tile runs to sort.
 * @returns A list of tile runs sorted by length.
 */
const sortedByLength = (tiles: TileOnBoard[][]): TileOnBoard[][] => {
  return tiles.sort((a, b) => b.length - a.length);
};

/**
 * Returns a list of consecutive tiles.
 *
 * @param tiles - The tiles to find consecutive tiles in.
 * @returns A list of consecutive tiles.
 */
export const getConsecutiveTiles = (tiles: TileOnBoard[]): TileOnBoard[][] => {
  const consecutiveTiles: TileOnBoard[][] = [];
  let currentRun: TileOnBoard[] = [];
  for (const tile of tiles) {
    if (currentRun.length === 0) {
      currentRun.push(tile);
    } else if (currentRun.at(-1)!.getNumber() + 1 === tile.getNumber()) {
      currentRun.push(tile);
    } else {
      consecutiveTiles.push(currentRun);
      currentRun = [tile];
    }
  }
  if (currentRun.length > 0) {
    consecutiveTiles.push(currentRun);
  }
  return sortedByLength(consecutiveTiles);
};

/**
 * Returns a record of tiles by number.
 *
 * @param tiles - The tiles to find tiles by number.
 * @returns A record of tiles by number.
 */
export const getTilesByNumber = (
  tiles: Tile[],
): Record<number, TileOnBoard[]> => {
  const tilesByNumber: Record<number, TileOnBoard[]> = {};
  for (const tile of tiles) {
    if (tile instanceof NumberedTile || tile instanceof BoundJokerTile) {
      const number = tile.getNumber();
      if (number in tilesByNumber) {
        tilesByNumber[number]!.push(tile);
      } else {
        tilesByNumber[number] = [tile];
      }
    }
  }
  return tilesByNumber;
};
