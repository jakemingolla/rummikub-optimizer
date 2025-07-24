export enum TileColor {
  RED = "RED",
  BLUE = "BLUE",
  ORANGE = "ORANGE",
  BLACK = "BLACK",
}

export type Tile = NumberedTile | JokerTile;

export class NumberedTile {
  private color: TileColor;
  private number: number;

  constructor(color: TileColor, number: number) {
    this.color = color;
    this.number = number;
  }

  getColor(): TileColor {
    return this.color;
  }

  getNumber(): number {
    return this.number;
  }

  toString(): string {
    return `${this.color} ${this.number}`;
  }

  equals(other: NumberedTile): boolean {
    return this.color === other.getColor() && this.number === other.getNumber();
  }
}

export class FreeJokerTile {
  constructor() {}

  toString(): string {
    return "Free Joker";
  }
}

export class BoundJokerTile {
  private matchingTiles: NumberedTile[];

  constructor(matchingTiles: NumberedTile[]) {
    this.matchingTiles = matchingTiles;
  }

  static fromTiles(tiles: NumberedTile[]): BoundJokerTile {
    if (tiles.every((t) => t.getNumber() === tiles[0]!.getNumber())) {
      const matchingTiles: NumberedTile[] = [];
      for (const tileColor of Object.values(TileColor) as TileColor[]) {
        const tile = new NumberedTile(tileColor, tiles[0]!.getNumber());
        matchingTiles.push(tile);
      }
      return new BoundJokerTile(matchingTiles);
    } else {
      const tileColor = tiles[0]!.getColor();
      const lowestNumber = tiles.reduce(
        (min, t) => Math.min(min, t.getNumber()),
        Infinity,
      );
      const highestNumber = tiles.reduce(
        (max, t) => Math.max(max, t.getNumber()),
        -Infinity,
      );
      const matchingTiles: NumberedTile[] = [
        new NumberedTile(tileColor, lowestNumber - 1),
        new NumberedTile(tileColor, highestNumber + 1),
      ];
      return new BoundJokerTile(matchingTiles);
    }
  }

  matches(tile: NumberedTile): boolean {
    return this.matchingTiles.some((t) => t.equals(tile));
  }

  getNumber(): number {
    return this.matchingTiles[0]!.getNumber();
  }

  getColor(): TileColor {
    return this.matchingTiles[0]!.getColor();
  }

  toString(): string {
    return `Bound Joker (${this.matchingTiles.map((t) => t.toString()).join(", ")})`;
  }
}

export type JokerTile = FreeJokerTile | BoundJokerTile;
export type TileOnBoard = NumberedTile | BoundJokerTile;
export type TileInHand = NumberedTile | FreeJokerTile;
