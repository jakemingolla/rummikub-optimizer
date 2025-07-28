import type { TileOnBoard, TileInHand } from "./tiles";

export type GameState = {
  board: TileOnBoard[][];
  hand: TileInHand[];
};
