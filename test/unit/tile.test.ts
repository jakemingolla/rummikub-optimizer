import { describe, expect, test } from "bun:test";
import { red7, red8, black7, freeJoker, red9, red10 } from "../fixtures";
import { BoundJokerTile, TileColor } from "../../src/tiles";

describe("tile", () => {
  describe("numbered tiles", () => {
    test("can check equality with other numbered tiles", () => {
      expect(red7.equals(red7)).toBe(true);
      expect(red7.equals(red8)).toBe(false);
      expect(red7.equals(black7)).toBe(false);
    });
  });

  describe("toString", () => {
    test("returns the correct string for numbered tiles", () => {
      expect(red7.toString()).toBe("Red 7");
    });

    test("returns the correct string for joker tiles", () => {
      expect(freeJoker.toString()).toBe("Free Joker");
    });
  });

  describe("bound joker tiles", () => {
    test("can check equality with other numbered tiles from a potential group", () => {
      const boundJoker = BoundJokerTile.fromTiles([red7, red7]);
      expect(boundJoker.matches(red7)).toBe(true);
      expect(boundJoker.matches(black7)).toBe(true);
      expect(boundJoker.matches(red8)).toBe(false);
    });

    test("can check equality with other numbered tiles from a potential run", () => {
      const boundJoker = BoundJokerTile.fromTiles([red8, red9]);
      expect(boundJoker.matches(red7)).toBe(true);
      expect(boundJoker.matches(black7)).toBe(false);
      expect(boundJoker.matches(red9)).toBe(false);
      expect(boundJoker.matches(red10)).toBe(true);
    });

    test("can get the number of a bound joker tile", () => {
      const boundJoker = BoundJokerTile.fromTiles([red7, red7]);
      expect(boundJoker.getNumber()).toBe(7);
    });

    test("can get the color of a bound joker tile", () => {
      const boundJoker = BoundJokerTile.fromTiles([red7, red7]);
      expect(boundJoker.getColor()).toBe(TileColor.RED);
    });
  });
});
