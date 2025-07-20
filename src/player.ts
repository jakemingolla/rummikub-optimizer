import type { Tile } from "./tile";
import { JokerTile } from "./tile";
import type { TileSet } from "./tile-set";
import { TileGroup } from "./tile-group";
import { TileRun } from "./tile-run";
import { generateCombinations } from "./utils";

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
        score += 30;
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

  makePlay(board: TileSet[]): TileSet[] {
    void board; // TODO DO NOT use board if the player has not melded.

    const candidates: Tile[] = [...this.hand];
    let plays = this.makeTileSets(candidates);

    // If a player has not yet melded, they may ONLY make a single play that is over 30 points.
    if (!this.hasMelded()) {
      plays = plays.filter((play) => play.getScore() >= 30);
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

  draw(pool: Tile[]): void {
    if (pool.length > 0) {
      const randomSelection = pool[Math.floor(Math.random() * pool.length)];
      this.hand.push(randomSelection!);
    }
  }
}
