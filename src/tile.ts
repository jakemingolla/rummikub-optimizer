export enum TileColor {
  RED = 0,
  BLUE = 1,
  ORANGE = 2,
  BLACK = 3,
}

export const TileColorToString = {
  [TileColor.RED]: "Red",
  [TileColor.BLUE]: "Blue",
  [TileColor.ORANGE]: "Orange",
  [TileColor.BLACK]: "Black",
};

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

  equals(other: Tile): boolean {
    if (other instanceof JokerTile) {
      return true;
    } else {
      return (
        this.color === other.getColor() && this.number === other.getNumber()
      );
    }
  }

  toString(): string {
    return `${TileColorToString[this.color]} ${this.number}`;
  }
}

export class JokerTile {
  constructor() {}

  equals(other: Tile): boolean {
    void other;
    return true;
  }

  toString(): string {
    return "Joker";
  }
}
