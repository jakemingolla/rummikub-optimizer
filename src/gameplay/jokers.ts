import { FreeJokerTile, BoundJokerTile, NumberedTile } from "../tiles";
import type { TileOnBoard } from "../tiles";

export const bindRemainingFreeJokers = (
  set: TileOnBoard[],
  freeJokerTiles: FreeJokerTile[],
): TileOnBoard[] => {
  if (freeJokerTiles.length === 0) {
    return set;
  }
  const numberedTiles = set.filter((t) => t instanceof NumberedTile);
  const boundJokerTiles: BoundJokerTile[] = [];
  for (let i = 0; i < freeJokerTiles.length; i++) {
    boundJokerTiles.push(BoundJokerTile.fromTiles(numberedTiles));
  }
  return [...set, ...boundJokerTiles];
};
