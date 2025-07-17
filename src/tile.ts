export enum TileColor {
  RED = "red",
  BLUE = "blue",
  ORANGE = "orange",
  BLACK = "black",
}

export type TileNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type NumberedTile = {
  __type: "numbered";
  color: TileColor;
  number: TileNumber;
};

export type JokerTile = {
  __type: "joker";
};

export type Tile = NumberedTile | JokerTile;

export function isNumberedTile(tile: Tile): tile is NumberedTile {
  return tile.__type === "numbered";
}

export function isJokerTile(tile: Tile): tile is JokerTile {
  return tile.__type === "joker";
}
