import type { Tile } from "./tile";
import { NumberedTile, TileColor, FreeJokerTile, BoundJokerTile } from "./tile";
import type { TileOnBoard, TileInHand } from "./tile";

type GameState = {
  board: TileOnBoard[][];
  hand: TileInHand[];
};

const extractTileGroups = (
  tiles: Tile[],
): { rest: Tile[]; groups: TileOnBoard[][] } => {
  const rest: Tile[] = [];
  const groups: TileOnBoard[][] = [];
  const tilesByNumber: Record<number, (NumberedTile | BoundJokerTile)[]> = {};
  let freeJokerTiles: FreeJokerTile[] = [];
  for (const tile of tiles) {
    if (tile instanceof NumberedTile || tile instanceof BoundJokerTile) {
      const number = tile.getNumber();
      if (number in tilesByNumber) {
        tilesByNumber[number]!.push(tile);
      } else {
        tilesByNumber[number] = [tile];
      }
    } else if (tile instanceof FreeJokerTile) {
      freeJokerTiles.push(tile);
    }
  }
  console.log(
    `There are ${Object.keys(tilesByNumber).length} unique numbers in tiles`,
  );
  console.log(`There are ${freeJokerTiles.length} free joker tiles`);
  for (const tiles of Object.values(tilesByNumber)) {
    const jokerTilesNeeded = 3 - tiles.length;
    console.log(
      `There are ${tiles.length} tiles of number ${(tiles[0] as NumberedTile).getNumber()}`,
    );
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
    const firstGroup = groups[0]!;
    const numberedTilesInFirstGroup = firstGroup.filter(
      (t) => t instanceof NumberedTile,
    );
    const boundJokerTiles: BoundJokerTile[] = [];
    for (let i = 0; i < freeJokerTiles.length; i++) {
      boundJokerTiles.push(BoundJokerTile.fromTiles(numberedTilesInFirstGroup));
    }
    groups[0]!.push(...boundJokerTiles);
  } else {
    rest.push(...freeJokerTiles);
  }

  return { rest, groups };
};

const extractTileRuns = (
  tiles: Tile[],
): { rest: Tile[]; runs: TileOnBoard[][] } => {
  const rest: Tile[] = [];
  const runs: TileOnBoard[][] = [];
  let freeJokerTiles: FreeJokerTile[] = [];
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
      // TODO doesn't handle bound jokers
    } else if (tile instanceof FreeJokerTile) {
      freeJokerTiles.push(tile);
    }
  }

  const consecutiveTiles: TileOnBoard[][] = [];
  for (const tilesOfSameColor of Object.values(sortedTilesByColor)) {
    let currentRun: TileOnBoard[] = [];

    for (const tile of tilesOfSameColor) {
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
  }

  console.log(
    `There are ${consecutiveTiles.length} groups of consecutive tiles`,
  );

  for (const potentialRun of consecutiveTiles) {
    const jokerTilesNeeded = 3 - potentialRun.length;
    console.log(
      `There are ${potentialRun.length} consecutive tiles of color ${potentialRun[0]!.getColor()} and ${freeJokerTiles.length} free joker tiles left`,
    );
    if (potentialRun.length >= 3) {
      console.log(`Adding a run of ${potentialRun.length} tiles to the board`);
      runs.push(potentialRun);
    } else if (jokerTilesNeeded <= freeJokerTiles.length) {
      const boundJokerTiles: BoundJokerTile[] = [];
      for (let i = 0; i < jokerTilesNeeded; i++) {
        console.log(`Adding a joker tile to the run, ${potentialRun}`);
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
    const firstGroup = runs[0]!;
    const numberedTilesInFirstGroup = firstGroup.filter(
      (t) => t instanceof NumberedTile,
    );
    const boundJokerTiles: BoundJokerTile[] = [];
    for (let i = 0; i < freeJokerTiles.length; i++) {
      boundJokerTiles.push(BoundJokerTile.fromTiles(numberedTilesInFirstGroup));
    }
    runs[0]!.push(...boundJokerTiles);
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
  console.log(
    `There are ${numberedTilesInHand.length} numbered tiles in the hand`,
  );
  for (const set of board) {
    const boundJokerTiles = set.filter((t) => t instanceof BoundJokerTile);
    for (const boundJokerTile of boundJokerTiles) {
      for (const tile of numberedTilesInHand) {
        if (boundJokerTile.matches(tile)) {
          const indexOfNumberedTileInHand = numberedTilesInHand.indexOf(tile);
          console.log(
            `Substituting ${tile.toString()} into ${boundJokerTile.toString()}`,
          );
          numberedTilesInHand.splice(indexOfNumberedTileInHand, 1);
          addedFreeJokerTiles.push(new FreeJokerTile());
          const indexOfBoundJokerTileInSet = set.indexOf(boundJokerTile);
          set[indexOfBoundJokerTileInSet] = tile;
        }
      }
    }
  }
  console.log(`There are ${addedFreeJokerTiles.length} added free joker tiles`);
  return {
    board,
    hand: [...numberedTilesInHand, ...addedFreeJokerTiles],
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
  console.log(
    `There are ${allEligibleTiles.length} eligible tiles in the game state`,
  );
  console.log(`There are ${ineligibleTileSets.length} ineligible tile sets.`);
  const { groups, rest: ungrouped } = extractTileGroups(allEligibleTiles);
  console.log(`There are ${groups.length} groups`);
  for (const group of groups) {
    console.log(`Group of ${group[0]!.getNumber()} has ${group.length} tiles`);
  }
  console.log(`There are ${ungrouped.length} ungrouped tiles`);
  const { runs, rest } = extractTileRuns(ungrouped);
  console.log(`There are ${runs.length} runs`);
  console.log(`There are ${rest.length} remaining tiles`);

  return {
    board: [...groups, ...runs, ...ineligibleTileSets],
    hand: rest,
  };
};
