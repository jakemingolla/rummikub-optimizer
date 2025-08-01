import { FreeJokerTile, BoundJokerTile, NumberedTile } from "../tiles/tile";
import type { TileOnBoard } from "../tiles/tile";
import type { GameState } from "../game-state";

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

export const substituteJokers = (gameState: GameState): GameState => {
  const { board, hand } = gameState;
  const numberedTilesInHand: NumberedTile[] = hand.filter(
    (t) => t instanceof NumberedTile,
  );
  const freeJokerTilesInHand: FreeJokerTile[] = hand.filter(
    (t) => t instanceof FreeJokerTile,
  );
  const addedFreeJokerTiles: FreeJokerTile[] = [];
  for (const set of board) {
    const boundJokerTiles = set.filter((t) => t instanceof BoundJokerTile);
    for (const boundJokerTile of boundJokerTiles) {
      for (const tile of numberedTilesInHand) {
        if (boundJokerTile.matches(tile)) {
          const indexOfNumberedTileInHand = numberedTilesInHand.indexOf(tile);
          numberedTilesInHand.splice(indexOfNumberedTileInHand, 1);
          addedFreeJokerTiles.push(new FreeJokerTile());
          const indexOfBoundJokerTileInSet = set.indexOf(boundJokerTile);
          set[indexOfBoundJokerTileInSet] = tile;
        }
      }
    }
  }
  return {
    board,
    hand: [
      ...numberedTilesInHand,
      ...freeJokerTilesInHand,
      ...addedFreeJokerTiles,
    ],
  };
};
