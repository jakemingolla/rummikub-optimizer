import type { Tile } from "./tiles/tile";
import { BoundJokerTile } from "./tiles/tile";
import type { TileOnBoard } from "./tiles/tile";
import type { GameState } from "./game-state";
import { MELD_THRESHOLD } from "./constants";
import { getTileGroups } from "./gameplay/get-tile-groups";
import { getTileRuns } from "./gameplay/get-tile-runs";
import { getScore } from "./tiles/scoring";

export const findBestMeldingPlay = (gameState: GameState): GameState => {
  const { hand, board } = gameState;
  const { groups, rest: ungrouped } = getTileGroups(hand);
  const { runs, rest: remainingTiles } = getTileRuns(ungrouped);
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
  const { groups, rest: ungrouped } = getTileGroups(allEligibleTiles);
  const { runs, rest } = getTileRuns(ungrouped);

  return {
    board: [...groups, ...runs, ...ineligibleTileSets],
    hand: rest,
  };
};
