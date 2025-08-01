import {
  FreeJokerTile,
  BoundJokerTile,
  NumberedTile,
  TileColor,
} from "../tiles/tile";
import type { Tile, TileOnBoard } from "../tiles/tile";
import { getSortedTilesByColor } from "../tiles/sorting";
import { getConsecutiveTiles } from "../tiles/sorting";
import { bindRemainingFreeJokers } from "./jokers";

/**
 * Returns a list of tile runs and a list of tiles that are not part of any run.
 *
 * @param tiles - The tiles to find runs in.
 * @returns A tuple containing a list of tiles that are not part of any run and a list of tile runs.
 */
export const getTileRuns = (
  tiles: Tile[],
): { rest: Tile[]; runs: TileOnBoard[][] } => {
  if (tiles.length < 3) return { rest: tiles, runs: [] };

  const rest: Tile[] = [];
  const runs: TileOnBoard[][] = [];
  let freeJokerTiles: FreeJokerTile[] = tiles.filter(
    (t) => t instanceof FreeJokerTile,
  );
  const sortedTilesByColor = getSortedTilesByColor(tiles);
  for (const [color, sortedTilesOfSameColor] of Object.entries(
    sortedTilesByColor,
  )) {
    const consecutiveTiles = getConsecutiveTiles(sortedTilesOfSameColor);
    const insufficientRuns: TileOnBoard[][] = [];

    // Split out runs that are at least 3 tiles from the invalid runs.
    for (const run of consecutiveTiles) {
      if (run.length >= 3) {
        runs.push(run);
      } else {
        insufficientRuns.push(run);
      }
    }

    // Attempt to fill in the cracks of the runs with a free joker tile.
    // If this is the case, we should check the next run to see if it can be extended.
    // For example, if the insufficient runs are [[7], [9]] and we have a free joker,
    // we can make a run of [7, BoundJokerTile([8]), 9].
    for (let i = 0; i < insufficientRuns.length; i++) {
      const currentRun = insufficientRuns[i]!;
      const nextRun = insufficientRuns[i + 1];
      let jokerTilesNeeded: number;
      const firstRunEndsAt = currentRun.at(-1)!.getNumber();
      const firstRunStartsAt = currentRun.at(0)!.getNumber();

      if (nextRun === undefined) {
        jokerTilesNeeded = 3 - currentRun.length;
      } else {
        const nextRunStartsAt = nextRun.at(0)!.getNumber();
        jokerTilesNeeded = nextRunStartsAt - firstRunEndsAt - 1;
      }

      if (jokerTilesNeeded <= freeJokerTiles.length) {
        const run = [...currentRun];
        for (let j = 0; j < jokerTilesNeeded; j++) {
          if (nextRun) {
            run.push(
              new BoundJokerTile([
                new NumberedTile(color as TileColor, firstRunEndsAt + j + 1),
              ]),
            );
          } else {
            run.push(
              new BoundJokerTile([
                new NumberedTile(color as TileColor, firstRunStartsAt - j - 1),
                new NumberedTile(color as TileColor, firstRunEndsAt + j + 1),
              ]),
            );
          }
        }
        if (nextRun) {
          run.push(...nextRun);
          i++; // Account for the run we just added
        }
        freeJokerTiles = freeJokerTiles.slice(jokerTilesNeeded);
        runs.push(run);
      } else {
        rest.push(...currentRun);
      }
    }
  }

  // If there are any free joker tiles left, bind them to the first run.
  // TODO this should be configurable via a priority.
  if (freeJokerTiles.length > 0 && runs.length > 0) {
    runs[0] = bindRemainingFreeJokers(runs[0]!, freeJokerTiles);
  } else {
    rest.push(...freeJokerTiles);
  }

  return { rest, runs };
};
