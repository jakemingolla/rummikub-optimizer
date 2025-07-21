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

  getRemovableTiles(): Tile[][] {
    // Return all combinations of tiles that can be removed from the run.
    // This MUST leave at least 3 contiguous tiles in the run.
    // We can only remove numbered tiles from the ends of the run.
    if (this.tiles.length <= 3) return [];

    const removableTiles: Tile[][] = [];

    // Find all numbered tiles and their positions
    const numberedTiles: { tile: Tile; index: number }[] = [];
    for (let i = 0; i < this.tiles.length; i++) {
      if (!(this.tiles[i] instanceof JokerTile)) {
        numberedTiles.push({ tile: this.tiles[i]!, index: i });
      }
    }

    // If no numbered tiles found, return empty array
    if (numberedTiles.length === 0) return [];

    const firstNumbered = numberedTiles[0]!;
    const lastNumbered = numberedTiles[numberedTiles.length - 1]!;

    // Check if we can remove from the ends
    const canRemoveFromStart = firstNumbered.index === 0;
    const canRemoveFromEnd = lastNumbered.index === this.tiles.length - 1;

    // If jokers are at both ends, we can't remove anything
    if (!canRemoveFromStart && !canRemoveFromEnd) return [];

    // Single tile removals
    if (this.tiles.length > 3) {
      if (canRemoveFromStart) {
        removableTiles.push([firstNumbered.tile]);
      }
      if (canRemoveFromEnd && lastNumbered.tile !== firstNumbered.tile) {
        removableTiles.push([lastNumbered.tile]);
      }
    }

    // Pair removals (only if we have at least 5 tiles to ensure 3 remain)
    if (this.tiles.length >= 5) {
      // Remove first two numbered tiles from start
      if (
        canRemoveFromStart &&
        numberedTiles.length >= 2 &&
        numberedTiles[1]!.index === firstNumbered.index + 1
      ) {
        removableTiles.push([firstNumbered.tile, numberedTiles[1]!.tile]);
      }

      // Remove last two numbered tiles from end
      if (
        canRemoveFromEnd &&
        numberedTiles.length >= 2 &&
        numberedTiles[numberedTiles.length - 2]!.index ===
          lastNumbered.index - 1
      ) {
        const secondLast = numberedTiles[numberedTiles.length - 2]!;
        if (secondLast.tile !== firstNumbered.tile) {
          removableTiles.push([secondLast.tile, lastNumbered.tile]);
        }
      }
    }

    // Remove first and last numbered tiles (if different and we have at least 5 tiles)
    if (
      this.tiles.length >= 5 &&
      firstNumbered.tile !== lastNumbered.tile &&
      canRemoveFromStart &&
      canRemoveFromEnd
    ) {
      removableTiles.push([firstNumbered.tile, lastNumbered.tile]);
    }

    return removableTiles;
  }

  getTiles(): Tile[] {
    return this.tiles;
  }

  private getTileNumberForIndex(index: number): number {
    const tile = this.tiles.at(index)!;

    if (!tile || tile instanceof JokerTile) {
      return 0;
    } else {
      return tile.getNumber();
    }
  }

  getScore(): number {
    let score = 0;

    for (let i = 0; i < this.tiles.length; i++) {
      const tileNumber = this.getTileNumberForIndex(i);

      if (tileNumber === 0) {
        const left = this.getTileNumberForIndex(i - 1);
        const right = this.getTileNumberForIndex(i + 1);

        if (left !== 0) {
          score += left + 1;
        } else {
          score += right - 1;
        }
      } else {
        score += tileNumber;
      }
    }

    return score;
  }

  toString(): string {
    return `[${this.tiles.map((t) => t.toString()).join(", ")}]`;
  }
}
