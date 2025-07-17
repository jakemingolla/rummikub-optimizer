import type { Tile } from "../src/tile";
import { TileColor } from "../src/tile";

export const red7: Tile = {
  __type: "numbered",
  color: TileColor.RED,
  number: 7,
};

export const red8: Tile = {
  __type: "numbered",
  color: TileColor.RED,
  number: 8,
};

export const red9: Tile = {
  __type: "numbered",
  color: TileColor.RED,
  number: 9,
};

export const red10: Tile = {
  __type: "numbered",
  color: TileColor.RED,
  number: 10,
};

export const black7: Tile = {
  __type: "numbered",
  color: TileColor.BLACK,
  number: 7,
};

export const joker: Tile = {
  __type: "joker",
};
