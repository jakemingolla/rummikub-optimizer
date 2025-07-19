import type { Tile } from "./tile";
import type { TileSet } from "./tile-set";
import { MissingTileError, InvalidJokerTileRemovalError } from "./tile-set";
import { JokerTile, NumberedTile } from "./tile";

export class TileGroup implements TileSet {
  private tiles: Tile[];

  constructor(tiles: Tile[]) {
    this.tiles = [...tiles];
  }

  isValid(): boolean {
    return this.tiles.length >= 3;
  }

  check(tile: Tile): boolean {
    if (this.tiles.length === 0) {
      return true;
    }

    if (tile instanceof JokerTile) {
      return true;
    }

    if (this.tiles.every((t) => t instanceof JokerTile)) {
      return true;
    }

    const tiles: Tile[] = this.tiles;
    const firstNumberedTile = tiles.find(
      (t: Tile) => t instanceof NumberedTile,
    ) as NumberedTile;

    return tile.getNumber() === firstNumberedTile.getNumber();
  }

  add(tile: Tile): JokerTile | null {
    const tiles = this.tiles;
    const jokerTile = tiles.find((t) => t instanceof JokerTile);

    if (jokerTile && !(tile instanceof JokerTile)) {
      tiles.splice(tiles.indexOf(jokerTile), 1, tile);
      return jokerTile;
    } else {
      tiles.push(tile);
      return null;
    }
  }

  remove(tile: Tile): Tile {
    if (tile instanceof JokerTile) {
      throw new InvalidJokerTileRemovalError();
    }

    const tiles = this.tiles;

    for (let i = 0; i < tiles.length; i++) {
      const t = tiles.at(i);

      if (t?.equals(tile)) {
        tiles.splice(i, 1);
        return t;
      }
    }

    throw new MissingTileError(tile);
  }

  getRemovableTiles(): Tile[] {
    if (this.tiles.length <= 3) {
      return [];
    } else {
      return this.tiles;
    }
  }
}
