import type { TileOnBoard, TileInHand } from "./tile";
import { FreeJokerTile } from "./tile";
import { JOKER_SCORE } from "../constants";

/**
 * Returns the score of a list of tiles.
 *
 * @param tiles - The tiles to score.
 * @returns The score of the tiles.
 */
export function getScore(tiles: TileOnBoard[]): number;
export function getScore(tiles: TileInHand[]): number;
export function getScore(tiles: TileOnBoard[] | TileInHand[]): number {
  let score = 0;
  for (const tile of tiles) {
    if (tile instanceof FreeJokerTile) {
      score += JOKER_SCORE;
    } else {
      score += tile.getNumber();
    }
  }
  return score;
}
