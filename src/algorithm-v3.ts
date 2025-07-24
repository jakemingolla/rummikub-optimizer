import type { Tile } from "./tile";
import { NumberedTile, JokerTile, TileColor } from "./tile";

type GameState = {
  board: Tile[];
  hand: Tile[];
};

const extractTileGroups = (tiles: Tile[]): { rest: Tile[]; groups: Tile[] } => {
  const rest: Tile[] = [];
  const groups: Tile[] = [];
  const tilesByNumber: Record<number, Tile[]> = {};
  let jokerTiles: JokerTile[] = [];
  for (const tile of tiles) {
    if (tile instanceof NumberedTile) {
      tilesByNumber[tile.getNumber()] = [
        ...(tilesByNumber[tile.getNumber()] || []),
        tile,
      ];
    } else {
      jokerTiles.push(tile);
    }
  }
  console.log(`There are ${Object.keys(tilesByNumber).length} numbered tiles`);
  console.log(`There are ${jokerTiles.length} joker tiles`);
  for (const tiles of Object.values(tilesByNumber)) {
    const jokerTilesNeeded = 3 - tiles.length;
    console.log(
      `There are ${tiles.length} tiles of number ${(tiles[0] as NumberedTile).getNumber()}`,
    );
    if (tiles.length >= 3) {
      groups.push(...tiles);
    } else if (jokerTilesNeeded <= jokerTiles.length) {
      groups.push(...tiles);
      groups.push(...jokerTiles.slice(0, jokerTilesNeeded));
      jokerTiles = jokerTiles.slice(jokerTilesNeeded);
    } else {
      rest.push(...tiles);
    }
  }

  rest.push(...jokerTiles);

  return { rest, groups };
};

const extractTileRuns = (tiles: Tile[]): { rest: Tile[]; runs: Tile[] } => {
  const rest: Tile[] = [];
  const runs: Tile[] = [];
  let jokerTiles: JokerTile[] = [];
  const sortedTilesByColor: Record<TileColor, NumberedTile[]> = Object.values(
    TileColor,
  ).reduce(
    (acc, color) => {
      acc[color as TileColor] = [];
      return acc;
    },
    {} as Record<TileColor, NumberedTile[]>,
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
    } else {
      jokerTiles.push(tile);
    }
  }

  const consecutiveTiles: NumberedTile[][] = [];
  for (const tilesOfSameColor of Object.values(sortedTilesByColor)) {
    let currentRun: NumberedTile[] = [];

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
      `There are ${potentialRun.length} consecutive tiles of color ${potentialRun[0]!.getColor()} and ${jokerTiles.length} joker tiles left`,
    );
    if (potentialRun.length >= 3) {
      console.log(`Adding a run of ${potentialRun.length} tiles to the board`);
      runs.push(...potentialRun);
    } else if (jokerTilesNeeded <= jokerTiles.length) {
      runs.push(...potentialRun);
      runs.push(...jokerTiles.slice(0, jokerTilesNeeded));
      jokerTiles = jokerTiles.slice(jokerTilesNeeded);
    } else {
      rest.push(...potentialRun);
    }
  }

  rest.push(...jokerTiles);

  return { rest, runs };
};

export const findBestPlay = (gameState: GameState): GameState => {
  const { board, hand } = gameState;
  const allTiles = board.concat(hand);
  console.log(`There are ${allTiles.length} tiles in the game state`);
  const { groups, rest: ungrouped } = extractTileGroups(allTiles);
  console.log(`There are ${groups.length} groups`);
  console.log(`There are ${ungrouped.length} ungrouped tiles`);
  const { runs, rest } = extractTileRuns(ungrouped);
  console.log(`There are ${runs.length} runs`);
  console.log(`There are ${rest.length} remaining tiles`);

  return {
    board: groups.concat(runs),
    hand: rest,
  };
};
