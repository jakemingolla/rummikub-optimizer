import type { TileOnBoard, TileInHand } from "./tiles/tile";

export type GameState = {
  board: TileOnBoard[][];
  hand: TileInHand[];
};
