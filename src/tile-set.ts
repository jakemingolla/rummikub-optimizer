import type { Tile } from "./tile";
import { JokerTile, NumberedTile } from "./tile";

export class MissingTileError extends Error {
  constructor(tile: Tile) {
    super(`The tile set does not contain the tile ${tile}.`);
  }
}

export class InvalidJokerTileRemovalError extends Error {
  constructor() {
    super("Cannot remove a joker tile from a set.");
  }
}

export class TileSet {
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
}
