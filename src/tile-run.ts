import type { TileSet } from "./tile-set";
import type { Tile } from "./tile";
import { JokerTile, TileColor, NumberedTile } from "./tile";

export class TileRun implements TileSet {
  private tiles: Tile[];
  private color: TileColor | null = null;

  constructor(tiles: Tile[]) {
    this.tiles = tiles;
    this.determineColor();
  }

  private determineColor(): void {
    const tiles: Tile[] = this.tiles;
    if (tiles.length === 0 || tiles.every((t) => t instanceof JokerTile)) {
      this.color = null;
    } else {
      const firstNumberedTile = this.tiles.find(
        (t) => t instanceof NumberedTile,
      );

      if (firstNumberedTile) {
        this.color = firstNumberedTile.getColor();
      } else {
        this.color = null;
      }
    }
  }

  private matchesColor(tile: Tile): boolean {
    if (this.color === null) {
      return true;
    } else if (tile instanceof JokerTile) {
      return true;
    } else {
      return tile.getColor() === this.color;
    }
  }

  isValid(): boolean {
    return this.tiles.length >= 3;
  }

  check(tile: Tile): boolean {
    if (tile instanceof JokerTile) {
      return true;
    }

    if (!this.matchesColor(tile)) {
      return false;
    }

    const tiles = this.tiles;

    if (tiles.length === 0) {
      return true;
    }

    const firstTile: Tile = tiles.at(0)!;
    const lastTile: Tile = tiles.at(-1)!;

    if (firstTile instanceof JokerTile || lastTile instanceof JokerTile) {
      return true;
    }

    if (tile.getNumber() === firstTile.getNumber() - 1) {
      return true;
    } else if (tile.getNumber() === lastTile.getNumber() + 1) {
      return true;
    }

    // TODO check if joker can be replaced

    return false;
  }

  add(tile: Tile): Tile | null {
    return null;
  }

  remove(tile: Tile): Tile {
    return tile;
  }

  getSwapCandidates(): Tile[] {
    return [];
  }
}
