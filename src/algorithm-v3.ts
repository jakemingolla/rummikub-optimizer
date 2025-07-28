import type { Tile } from "./tile";
import { NumberedTile, TileColor, FreeJokerTile, BoundJokerTile } from "./tile";
import type { TileOnBoard } from "./tile";
import type { GameState } from "./game-state";
import { MELD_THRESHOLD } from "./constants";

const getTilesByNumber = (
  tiles: Tile[],
): Record<number, (NumberedTile | BoundJokerTile)[]> => {
  const tilesByNumber: Record<number, (NumberedTile | BoundJokerTile)[]> = {};
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

const bindRemainingFreeJokers = (
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

const extractTileGroups = (
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

const sortTilesByColor = (tiles: Tile[]): Record<TileColor, TileOnBoard[]> => {
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
      // Insert the tile into the correct position in the array
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

const getConsecutiveTiles = (tiles: TileOnBoard[]): TileOnBoard[][] => {
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
  return consecutiveTiles;
};

const extractTileRuns = (
  tiles: Tile[],
): { rest: Tile[]; runs: TileOnBoard[][] } => {
  const rest: Tile[] = [];
  const runs: TileOnBoard[][] = [];
  let freeJokerTiles: FreeJokerTile[] = tiles.filter(
    (t) => t instanceof FreeJokerTile,
  );
  const sortedTilesByColor = sortTilesByColor(tiles);
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

export const substituteJokers = (gameState: GameState): GameState => {
  const { board, hand } = gameState;
  const numberedTilesInHand: NumberedTile[] = hand.filter(
    (t) => t instanceof NumberedTile,
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
    hand: [...numberedTilesInHand, ...addedFreeJokerTiles],
  };
};

const getScore = (tiles: TileOnBoard[]): number => {
  return tiles.reduce((acc, tile) => acc + tile.getNumber(), 0);
};

export const findBestMeldingPlay = (gameState: GameState): GameState => {
  const { hand, board } = gameState;
  const { groups, rest: ungrouped } = extractTileGroups(hand);
  const { runs, rest: remainingTiles } = extractTileRuns(ungrouped);
  const bestSet = groups.concat(runs).reduce((bestMeldingSet, currentSet) => {
    const score = getScore(currentSet);
    if (score >= MELD_THRESHOLD && score > getScore(bestMeldingSet)) {
      return currentSet;
    }
    return bestMeldingSet;
  }, [] as TileOnBoard[]);

  return {
    board: [...board, bestSet],
    hand: remainingTiles,
  };
};

export const findBestPlay = (gameState: GameState): GameState => {
  const { board, hand } = gameState;
  const ineligibleTileSets: TileOnBoard[][] = [];
  const eligbleTilesOnBoard: TileOnBoard[] = [];
  for (const set of board) {
    if (set.some((t) => t instanceof BoundJokerTile)) {
      ineligibleTileSets.push(set);
    } else {
      eligbleTilesOnBoard.push(...set);
    }
  }
  const allEligibleTiles: Tile[] = [...eligbleTilesOnBoard, ...hand];
  const { groups, rest: ungrouped } = extractTileGroups(allEligibleTiles);
  const { runs, rest } = extractTileRuns(ungrouped);

  return {
    board: [...groups, ...runs, ...ineligibleTileSets],
    hand: rest,
  };
};
