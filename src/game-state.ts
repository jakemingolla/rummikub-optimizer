import type { TileOnBoard, TileInHand } from "./tile";

export type GameState = {
  board: TileOnBoard[][];
  hand: TileInHand[];
};
