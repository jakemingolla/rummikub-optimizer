import {
  FreeJokerTile,
  BoundJokerTile,
  NumberedTile,
  TileColor,
} from "../tiles";
import type { Tile, TileOnBoard } from "../tiles";
import { getSortedTilesByColor } from "../tiles/sorting";
import { getConsecutiveTiles } from "../tiles/sorting";
import { bindRemainingFreeJokers } from "./jokers";

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

    for (const run of consecutiveTiles) {
      if (run.length >= 3) {
        runs.push(run);
      } else {
        insufficientRuns.push(run);
      }
    }

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

  if (freeJokerTiles.length > 0 && runs.length > 0) {
    runs[0] = bindRemainingFreeJokers(runs[0]!, freeJokerTiles);
  } else {
    rest.push(...freeJokerTiles);
  }

  return { rest, runs };
};
