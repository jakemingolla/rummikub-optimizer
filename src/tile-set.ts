import type { JokerTile, Tile } from "./tile";

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
  /**
   * Returns true if the set is valid and can be placed on the board.
   */
  isValid(): boolean;

  /**
   * Returns true if the tile can be added to the set, false otherwise.
   * @param tile The tile to check.
   */
  check(tile: Tile): boolean;

  /**
   * Adds a tile to the set. The tile MUST be previously checked with the `check` method returning true.
   * @param tile The tile to add.
   * @returns The JokerTile substituted for the added tile, or null if the tile can be added without substitution.
   */
  add(tile: Tile): JokerTile | null;

  /**
   * Removes a tile from the set.
   * @param tile The tile to remove.
   * @returns The tile that was removed.
   * @throws {InvalidJokerTileRemovalError} If the tile is a JokerTile.
   * @throws {MissingTileError} If the tile is not in the set.
   */
  remove(tile: Tile): Tile;

  /**
   * Returns the tiles that can be removed from the set.
   * @returns The tiles that can be removed from the set.
   */
  getRemovableTiles(): Tile[];

  /**
   * Returns the tiles that are in the set.
   * @returns The tiles that are in the set.
   */
  getTiles(): Tile[];

  /**
   * Returns the score of the set.
   * @returns The score of the set.
   */
  getScore(): number;
}
