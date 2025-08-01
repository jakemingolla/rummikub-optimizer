import { FreeJokerTile, NumberedTile, BoundJokerTile } from "../tiles/tile";
import type { Tile, TileOnBoard } from "../tiles/tile";
import { getTilesByNumber } from "../tiles/sorting";
import { bindRemainingFreeJokers } from "./jokers";

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
  if (freeJokerTiles.length > 0 && groups.length > 0) {
    groups[0] = bindRemainingFreeJokers(groups[0]!, freeJokerTiles);
  } else {
    rest.push(...freeJokerTiles);
  }

  return { rest, groups };
};
