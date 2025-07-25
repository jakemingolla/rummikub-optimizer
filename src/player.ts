import type { Tile } from "./tile";
import { JokerTile } from "./tile";
import type { TileSet } from "./tile-set";
import { TileGroup } from "./tile-group";
import { TileRun } from "./tile-run";
import { generateCombinations } from "./utils";
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
   * Returns all possible plays from a collection of tiles.
   *
   * @param board - The board to make plays from.
   * @returns All possible plays from the collection of tiles.
   */
  makePlay(board: TileSet[]): TileSet[] {
    void board; // TODO DO NOT use board if the player has not melded.

    const candidates: Tile[] = [...this.hand];
    let plays = this.makeTileSets(candidates);

    // If a player has not yet melded, they may ONLY make a single play over the meld threshold.
    if (!this.hasMelded()) {
      plays = plays.filter((play) => play.getScore() >= MELD_THRESHOLD);
      if (plays.length > 0) {
        plays = [plays[0]!];
      }
    }

    for (const play of plays) {
      for (const tile of play.getTiles()) {
        const index = this.hand.indexOf(tile);
        if (index !== -1) {
          this.hand.splice(index, 1);
        }
      }
    }

    return plays;
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
