import { FreeJokerTile, BoundJokerTile, NumberedTile } from "../tiles";
import type { Tile, TileOnBoard } from "../tiles";
import { getSortedTilesByColor } from "../tiles/sorting";
import { getConsecutiveTiles } from "../tiles/sorting";
import { bindRemainingFreeJokers } from "./jokers";

export const getTileRuns = (
  tiles: Tile[],
): { rest: Tile[]; runs: TileOnBoard[][] } => {
  const rest: Tile[] = [];
  const runs: TileOnBoard[][] = [];
  let freeJokerTiles: FreeJokerTile[] = tiles.filter(
    (t) => t instanceof FreeJokerTile,
  );
  const sortedTilesByColor = getSortedTilesByColor(tiles);
  const consecutiveTiles = getConsecutiveTiles(
    Object.values(sortedTilesByColor).flat(),
  );

  for (const potentialRun of consecutiveTiles) {
    const jokerTilesNeeded = 3 - potentialRun.length;
    if (potentialRun.length >= 3) {
      runs.push(potentialRun);
    } else if (jokerTilesNeeded <= freeJokerTiles.length) {
      const boundJokerTiles: BoundJokerTile[] = [];
      for (let i = 0; i < jokerTilesNeeded; i++) {
        boundJokerTiles.push(
          BoundJokerTile.fromTiles(
            potentialRun.filter((t) => t instanceof NumberedTile),
          ),
        );
      }
      runs.push([...potentialRun, ...boundJokerTiles]);
      freeJokerTiles = freeJokerTiles.slice(jokerTilesNeeded);
    } else {
      rest.push(...potentialRun);
    }
  }

  if (freeJokerTiles.length > 0 && runs.length > 0) {
    runs[0] = bindRemainingFreeJokers(runs[0]!, freeJokerTiles);
  } else {
    rest.push(...freeJokerTiles);
  }

  return { rest, runs };
};
