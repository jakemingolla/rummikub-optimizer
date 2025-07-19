import type { TileSet } from "./tile-set";
import type { Tile } from "./tile";
import { JokerTile, TileColor, NumberedTile } from "./tile";
import { MissingTileError, InvalidJokerTileRemovalError } from "./tile-set";

export class InvalidTileRemovalError extends Error {
  constructor(tile: Tile) {
    super(`Cannot remove tile ${tile} from a run.`);
  }
}

const CANNOT_INSERT_SENTINEL = -1;

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

  private getInsertionIndex(tile: Tile): number {
    if (this.tiles.length === 0) return 0;
    if (this.tiles.every((t) => t instanceof JokerTile)) return 0;
    if (tile instanceof JokerTile) return 0;

    const tiles: Tile[] = this.tiles;
    const firstTile = tiles.at(0)!;
    const lastTile = tiles.at(-1)!;

    if (
      firstTile instanceof NumberedTile &&
      tile.getNumber() === firstTile.getNumber() - 1
    ) {
      return 0;
    }

    if (
      lastTile instanceof NumberedTile &&
      tile.getNumber() === lastTile.getNumber() + 1
    ) {
      return tiles.length;
    }

    for (let i = 0; i < tiles.length; i++) {
      const current = tiles.at(i)!;

      if (!(current instanceof JokerTile)) {
        continue;
      }

      const next = tiles.at(i + 1);

      if (next === undefined) {
        return i;
      } else if (next instanceof JokerTile) {
        return i + 1;
      } else if (tile.getNumber() + 1 === next.getNumber()) {
        return i;
      }
    }

    return CANNOT_INSERT_SENTINEL;
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

    const insertionIndex = this.getInsertionIndex(tile);

    if (insertionIndex === CANNOT_INSERT_SENTINEL) {
      return false;
    } else {
      return true;
    }
  }

  add(tile: Tile): JokerTile | null {
    if (tile instanceof JokerTile) {
      this.tiles.push(tile);
      return null;
    }

    const insertionIndex = this.getInsertionIndex(tile);
    const existingTile = this.tiles.at(insertionIndex);

    if (existingTile instanceof JokerTile) {
      this.tiles[insertionIndex] = tile;
      return existingTile;
    } else {
      this.tiles.splice(insertionIndex, 0, tile);
      return null;
    }
  }

  remove(tile: Tile): Tile {
    if (tile instanceof JokerTile) {
      throw new InvalidJokerTileRemovalError();
    }

    const matchingIndex = this.tiles.findIndex((t) => t === tile);
    if (matchingIndex === -1) {
      throw new MissingTileError(tile);
    }

    if (matchingIndex === 0 || matchingIndex === this.tiles.length - 1) {
      this.tiles.splice(matchingIndex, 1);
      return tile;
    } else {
      throw new InvalidTileRemovalError(tile);
    }
  }

  getRemovableTiles(): Tile[] {
    if (this.tiles.length <= 3) {
      return [];
    }

    const firstTile = this.tiles.at(0)!;
    const lastTile = this.tiles.at(-1)!;

    const candidates: Tile[] = [];

    if (!(firstTile instanceof JokerTile)) {
      candidates.push(firstTile);
    }
    if (!(lastTile instanceof JokerTile)) {
      candidates.push(lastTile);
    }

    return candidates;
  }
}
