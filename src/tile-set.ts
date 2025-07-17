import type { Tile, NumberedTile } from "./tile";
import { isNumberedTile, isJokerTile } from "./tile";

export type TileSet = Tile[];

export function isValidTileSet(tiles: Tile[]): tiles is TileSet {
  if (tiles.length < 3) {
    return false;
  }

  const firstNumberedTile = tiles.find(isNumberedTile) as NumberedTile;

  return tiles.every(
    (tile) => isJokerTile(tile) || tile.number === firstNumberedTile.number,
  );
}
