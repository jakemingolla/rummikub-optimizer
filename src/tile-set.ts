import type { Tile } from "./tile";

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

export interface TileSet {
  isValid(): boolean;
  check(tile: Tile): boolean;
  add(tile: Tile): Tile | null;
  remove(tile: Tile): Tile;
  getSwapCandidates(): Tile[];
}
