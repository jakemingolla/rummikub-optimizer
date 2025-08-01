import { describe, expect, test } from "bun:test";
import { red7, red8, black7, freeJoker, red9, red10 } from "../../fixtures";
import {
  getSortedTilesByColor,
  getConsecutiveTiles,
  getTilesByNumber,
} from "../../../src/tiles/sorting";
import { BoundJokerTile } from "../../../src/tiles/tile";
import type { TileOnBoard } from "../../../src/tiles/tile";

describe("getSortedTilesByColor", () => {
  test("returns the correct sorted tiles by color", () => {
    const tiles = [red7, red8, black7, freeJoker];
    const sortedTiles = getSortedTilesByColor(tiles);
    expect(sortedTiles).toEqual({
      Red: [red7, red8],
      Blue: [],
      Orange: [],
      Black: [black7],
    });
  });

  test("ignores jokers", () => {
    const tiles = [red7, black7, freeJoker];
    const sortedTiles = getSortedTilesByColor(tiles);
    expect(sortedTiles).toEqual({
      Red: [red7],
      Blue: [],
      Orange: [],
      Black: [black7],
    });
  });

  describe("getConsecutiveTiles", () => {
    test("returns all consecutive tiles", () => {
      const tiles = [red7, red8, red10];
      const consecutiveTiles = getConsecutiveTiles(tiles);
      expect(consecutiveTiles).toEqual([[red7, red8], [red10]]);
    });

    test("returns all consecutive tiles sorted by length", () => {
      const tiles = [red7, red9, red10];
      const consecutiveTiles = getConsecutiveTiles(tiles);
      expect(consecutiveTiles).toEqual([[red9, red10], [red7]]);
    });

    test("can handle a run with a bound joker", () => {
      const boundJoker = new BoundJokerTile([red7, red10]);
      const tiles = [boundJoker, red8, red9, black7];
      const consecutiveTiles = getConsecutiveTiles(tiles);
      expect(consecutiveTiles).toEqual([[boundJoker, red8, red9], [black7]]);
    });

    test("can handle zero input tiles", () => {
      const tiles: TileOnBoard[] = [];
      const consecutiveTiles = getConsecutiveTiles(tiles);
      expect(consecutiveTiles).toEqual([]);
    });
  });

  describe("getTilesByNumber", () => {
    test("returns the correct tiles by number", () => {
      const tiles = [red7, red8, black7];
      const tilesByNumber = getTilesByNumber(tiles);
      expect(tilesByNumber).toEqual({
        7: [red7, black7],
        8: [red8],
      });
    });

    test("ignores jokers", () => {
      const tiles = [red7, black7, freeJoker];
      const tilesByNumber = getTilesByNumber(tiles);
      expect(tilesByNumber).toEqual({
        7: [red7, black7],
      });
    });

    test("can handle zero input tiles", () => {
      const tiles: TileOnBoard[] = [];
      const tilesByNumber = getTilesByNumber(tiles);
      expect(tilesByNumber).toEqual({});
    });
  });
});
