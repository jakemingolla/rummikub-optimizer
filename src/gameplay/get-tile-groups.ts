import { FreeJokerTile, NumberedTile, BoundJokerTile } from "../tiles/tile";
import type { Tile, TileOnBoard } from "../tiles/tile";
import { getTilesByNumber } from "../tiles/sorting";
import { bindRemainingFreeJokers } from "./jokers";

/**
 * Returns a list of tile groups and a list of tiles that are not part of any group.
 *
 * @param tiles - The tiles to group.
 * @returns A tuple containing a list of tiles that are not part of any group and a list of tile groups.
 */
export const getTileGroups = (
  tiles: Tile[],
): { rest: Tile[]; groups: TileOnBoard[][] } => {
  const rest: Tile[] = [];
  const groups: TileOnBoard[][] = [];
  const tilesByNumber = getTilesByNumber(tiles);
  let freeJokerTiles = tiles.filter((t) => t instanceof FreeJokerTile);
  for (const tiles of Object.values(tilesByNumber)) {
    const jokerTilesNeeded = 3 - tiles.length;
    if (tiles.length >= 3) {
      groups.push(tiles);
    } else if (jokerTilesNeeded <= freeJokerTiles.length) {
      const boundJokerTiles: BoundJokerTile[] = [];
      for (let i = 0; i < jokerTilesNeeded; i++) {
        boundJokerTiles.push(
          BoundJokerTile.fromTiles(
            tiles.filter((tile) => tile instanceof NumberedTile),
          ),
        );
      }
      groups.push([...tiles, ...boundJokerTiles]);
      freeJokerTiles = freeJokerTiles.slice(jokerTilesNeeded);
    } else {
      rest.push(...tiles);
    }
  }

  // If there are any free joker tiles left, bind them to the first group.
  // TODO this should be configurable via a priority.
  if (freeJokerTiles.length > 0 && groups.length > 0) {
    groups[0] = bindRemainingFreeJokers(groups[0]!, freeJokerTiles);
  } else {
    rest.push(...freeJokerTiles);
  }

  return { rest, groups };
};
