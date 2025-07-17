// A run is a set of three or more tiles meeting the following characteristics:
// - All tiles are of the same color
// - No two tiles may have the same value
// - The tiles are in consecutive order. Gaps of more than 1 can be filled by jokers.

import type { NumberedTile, Tile } from "./tile";
import { isNumberedTile, isJokerTile } from "./tile";

export type TileRun = Tile[];

export function isValidTileRun(tiles: Tile[]): tiles is TileRun {
  if (tiles.length < 3) {
    return false;
  }

  const numberedTiles = tiles.filter((tile) => isNumberedTile(tile));
  const jokerTiles = tiles.filter((tile) => isJokerTile(tile));

  const firstNumberedTile = numberedTiles[0] as NumberedTile;
  const allTilesSameColor = numberedTiles.every(
    (tile) => tile.color === firstNumberedTile.color,
  );

  if (!allTilesSameColor) {
    return false;
  }

  const sortedNumberedTiles = numberedTiles.sort((a, b) =>
    a.number < b.number ? -1 : 1,
  );

  let gaps = 0;
  for (let i = 1; i < sortedNumberedTiles.length; i++) {
    const current = sortedNumberedTiles.at(i) as NumberedTile;
    const previous = sortedNumberedTiles.at(i - 1) as NumberedTile;
    const difference = current.number - previous.number;

    if (difference === 1) {
      continue;
      // A difference of 0 means two Tiles have the same number.
      // This immediately indicates the run is invalid.
    } else if (difference === 0) {
      return false;
    } else {
      // Otherwise, the gap between the two numbers will need to be filled by jokers.
      // For example, a 7 and a 10 need two jokers to bridge the gap.
      gaps += difference - 1;
    }
  }

  // A perfect run!
  if (gaps === 0) {
    return true;
    // If we can fill the gaps with jokers, it's valid.
  } else if (gaps === jokerTiles.length) {
    return true;
  } else {
    // We have too many gaps to fill with jokers. The run is not valid.
    return false;
  }
}
