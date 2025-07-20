import type { Tile } from "./tile";
import { JokerTile } from "./tile";
import type { TileSet } from "./tile-set";
import { TileGroup } from "./tile-group";
import { TileRun } from "./tile-run";
import { generateCombinations } from "./utils";

export class Player {
  private hand: Tile[];
  private melded: boolean = false;

  constructor(hand: Tile[]) {
    this.hand = hand;
  }

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

  hasWon(): boolean {
    return this.hand.length === 0;
  }

  private makeTileGroupFromCombination(combination: Tile[]): TileGroup {
    const group = new TileGroup([]);
    for (const tile of combination) {
      if (group.check(tile)) {
        group.add(tile);
      } else {
        break;
      }
    }
    return group;
  }

  private makeTileRunFromCombination(combination: Tile[]): TileRun {
    const run = new TileRun([]);
    for (const tile of combination) {
      if (run.check(tile)) {
        run.add(tile);
      } else {
        break;
      }
    }
    return run;
  }

  makeTileSetsV1(tiles: Tile[]): TileSet[] {
    const sets: TileSet[] = [];

    let combinations = generateCombinations(tiles);
    let currentCombination: Tile[] | undefined;

    while ((currentCombination = combinations.pop())) {
      let isValid = false;
      const group = this.makeTileGroupFromCombination(currentCombination);
      const run = this.makeTileRunFromCombination(currentCombination);

      if (group.isValid()) {
        sets.push(group);
        isValid = true;
      } else if (run.isValid()) {
        sets.push(run);
        isValid = true;
      }

      if (isValid) {
        // Clear out the tiles from the current combination from the candidates
        for (const tile of currentCombination) {
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

  makePlay(pool: Tile[], board: TileSet[]): TileSet[] {
    void pool;
    void board;

    const candidates: Tile[] = [...this.hand];
    const plays = this.makeTileSetsV1(candidates);

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
