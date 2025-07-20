import type { Tile } from "./tile";
import { JokerTile, NumberedTile } from "./tile";
import type { TileSet } from "./tile-set";
import { TileGroup } from "./tile-group";
import { TileRun } from "./tile-run";

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

  private makeTileGroups(): TileGroup[] {
    const jokers: JokerTile[] = this.hand.filter((t) => t instanceof JokerTile);
    const groupsOfSameNumber: TileGroup[] = [];
    const sortedNumberedTiles = this.hand
      .filter((t) => t instanceof NumberedTile)
      .sort((a, b) => a.getNumber() - b.getNumber());

    let iterator = 0;
    let group = new TileGroup([]);
    while (iterator < sortedNumberedTiles.length) {
      const tile = sortedNumberedTiles.at(iterator)!;
      if (group.check(tile)) {
        group.add(tile);
      } else {
        group = new TileGroup([]);
      }
      iterator++;
    }

    // Have to check the last group because we may have added a tile to it
    // in the while loop above but not pushed to the array.
    if (group.isValid()) groupsOfSameNumber.push(group);

    for (const joker of jokers) {
      for (const group of groupsOfSameNumber) {
        if (group.check(joker)) {
          group.add(joker);
        }
      }
    }

    return groupsOfSameNumber;
  }

  private makeTileRuns(): TileRun[] {
    const jokers: JokerTile[] = this.hand.filter((t) => t instanceof JokerTile);
    const runs: TileRun[] = [];

    const sortedNumberedTilesByColorAndNumber = this.hand
      .filter((t) => t instanceof NumberedTile)
      .sort((a, b) => {
        if (a.getColor() !== b.getColor()) {
          return a.getColor() - b.getColor();
        }
        return a.getNumber() - b.getNumber();
      });

    let run = new TileRun([]);
    for (const tile of sortedNumberedTilesByColorAndNumber) {
      if (run.check(tile)) {
        run.add(tile);
      } else {
        runs.push(run);
        run = new TileRun([]);
      }
    }

    if (run.isValid()) runs.push(run);

    for (const joker of jokers) {
      for (const run of runs) {
        if (run.check(joker)) {
          run.add(joker);
        }
      }
    }

    return runs;
  }

  makePlay(pool: Tile[], board: TileSet[]): TileSet[] {
    void pool;
    void board;
    const plays: TileSet[] = [];
    const tileGroups = this.makeTileGroups();
    const tileRuns = this.makeTileRuns();

    for (const group of tileGroups) {
      if (group.isValid()) {
        plays.push(group);
      }
    }

    for (const run of tileRuns) {
      if (run.isValid()) {
        plays.push(run);
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
}
