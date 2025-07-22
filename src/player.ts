import type { Tile } from "./tile";
import { JokerTile } from "./tile";
import type { TileSet } from "./tile-set";
import { TileGroup } from "./tile-group";
import { TileRun } from "./tile-run";
import { generateCombinations, generateNestedCombinations } from "./utils";
import { MELD_THRESHOLD, JOKER_SCORE } from "./constants";

export class Player {
  private hand: Tile[];
  private melded: boolean;

  constructor(hand: Tile[], melded: boolean = false) {
    this.hand = hand;
    this.melded = melded;
  }

  /**
   * @returns The score of the player's hand.
   * @note Jokers are worth 30 points.
   */
  getScore(): number {
    let score = 0;

    for (const tile of this.hand) {
      if (tile instanceof JokerTile) {
        score += JOKER_SCORE;
      } else {
        score += tile.getNumber();
      }
    }

    return score;
  }

  /**
   * @returns True if the player has won the game.
   */
  hasWon(): boolean {
    return this.hand.length === 0;
  }

  /**
   * @returns True if the player has melded.
   */
  hasMelded(): boolean {
    return this.melded;
  }

  /**
   * Returns a TileSet from a combination of tiles.
   * Tiles are only added to the set if they have been checked successfully.
   *
   * @param combination - The combination of tiles to make a TileSet from.
   * @param constructor - The constructor of the TileSet to make.
   * @returns A TileSet from the combination of tiles.
   */
  private makeTileSetFromCombination<T extends TileSet>(
    combination: Tile[],
    constructor: new (tiles: Tile[]) => T,
  ): T {
    const set = new constructor([]);
    for (const tile of combination) {
      if (set.check(tile)) {
        set.add(tile);
      } else {
        break;
      }
    }
    return set;
  }

  /**
   * Returns all possible TileSets from a collection of tiles.
   *
   * @param tiles - The tiles to make TileSets from.
   * @returns All possible TileSets from the collection of tiles.
   */
  makeTileSets(tiles: Tile[]): TileSet[] {
    const sets: TileSet[] = [];

    let combinations = generateCombinations(tiles);
    let currentCombination: Tile[] | undefined;

    while ((currentCombination = combinations.pop())) {
      let isValid = false;
      let tilesToRemove: Tile[] = [];
      const group = this.makeTileSetFromCombination(
        currentCombination,
        TileGroup,
      );
      const run = this.makeTileSetFromCombination(currentCombination, TileRun);

      if (group.isValid()) {
        tilesToRemove = group.getTiles();
        sets.push(group);
        isValid = true;
      } else if (run.isValid()) {
        tilesToRemove = run.getTiles();
        sets.push(run);
        isValid = true;
      }

      if (isValid) {
        // Clear out the tiles from a valid set from the candidates and regenerate combinations.
        for (const tile of tilesToRemove) {
          const index = tiles.indexOf(tile);
          if (index !== -1) {
            tiles.splice(index, 1);
          }
        }
        combinations = generateCombinations(tiles);
      }
    }

    return sets;
  }

  /**
   * Returns all possible plays from a combination of the tiles on the board and the player's hand.
   *
   * @param board - The board to make plays from.
   * @returns The best play to make.
   * @note The board is modified in place.
   * @note The player's hand is modified in place.
   */
  makePlay(board: TileSet[]): TileSet[] {
    // Begin by determining the best play from solely the player's hand.
    let bestPlay = this.makeTileSets([...this.hand]);
    let bestScore = bestPlay.reduce((sum, play) => sum + play.getScore(), 0);

    // If the player has melded, we are allowed to make a play using the tiles on the board.
    // First generate all possible combinations of TileSets on the board and their removable tiles.
    const allCombinationsOfExistingTileSetsAndTheirRemovableTiles = this.melded
      ? generateNestedCombinations(
          board.map((set, index) => ({
            id: index.toString(),
            values: set.getRemovableTiles(),
          })),
        )
      : [];
    // This will keep track of the tiles we need to remove from the board corresponding to the
    // best play we find.
    let tilesToRemove: Record<string, Tile[]> = {};

    // For each combination of TileSets on the board and their removable tiles, we will generate
    // all possible plays and keep track of the best play we've found so far.
    for (const combination of allCombinationsOfExistingTileSetsAndTheirRemovableTiles) {
      const possibleTiles = combination.map((c) => c.values.flat()).flat();
      const possiblePlay = this.makeTileSets(possibleTiles.concat(this.hand));
      const possiblePlaysScore = possiblePlay.reduce(
        (sum, play) => sum + play.getScore(),
        0,
      );

      // If the score of the possible play is greater than the best score we've found so far,
      // we update the best score, the best play, and the tiles we need to remove from the board
      // after making the play.
      if (possiblePlaysScore > bestScore) {
        bestScore = possiblePlaysScore;
        bestPlay = possiblePlay;
        tilesToRemove = combination.reduce(
          (acc, c) => {
            acc[c.id] = c.values.flat();
            return acc;
          },
          {} as Record<string, Tile[]>,
        );
      }
    }

    // If a player has not yet melded, they may ONLY make a single play over the meld threshold.
    if (!this.hasMelded()) {
      bestPlay = bestPlay.filter((play) => play.getScore() >= MELD_THRESHOLD);
      if (bestPlay.length > 0) {
        bestPlay = [bestPlay[0]!];
      }
    }

    // Remove the tiles from the board that are in the best play.
    for (const [id, tiles] of Object.entries(tilesToRemove)) {
      for (const tile of tiles) {
        const index = parseInt(id);
        const tileSet = board[index];
        if (tileSet) {
          tileSet.remove(tile);
        }
      }
    }

    // Remove the tiles from the player's hand that are in the best play.
    for (const play of bestPlay) {
      for (const tile of play.getTiles()) {
        const index = this.hand.indexOf(tile);
        if (index !== -1) {
          this.hand.splice(index, 1);
        }
      }
    }

    return bestPlay;
  }

  /**
   * Draws a tile from the pool and adds it to the player's hand.
   *
   * @param pool - The pool to draw a tile from. This is modified in place.
   * @note The tile is removed from the pool once drawn.
   */
  draw(pool: Tile[]): void {
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const removedTile = pool.splice(randomIndex, 1);
      this.hand.push(removedTile[0]!);
    }
  }
}
