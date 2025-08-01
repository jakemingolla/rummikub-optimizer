import { describe, expect, test } from "bun:test";
import { getTileGroups } from "../../../src/gameplay/get-tile-groups";
import { red7, red8, black7, freeJoker, red10, red9 } from "../../fixtures";
import type { Tile } from "../../../src/tiles/tile";
import { BoundJokerTile } from "../../../src/tiles/tile";

describe("getTileGroups", () => {
  test("should return the nothing if there are no tiles", () => {
    const tiles: Tile[] = [];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([]);
    expect(rest).toEqual([]);
  });

  test("should return nothing if there are no groups", () => {
    const tiles: Tile[] = [red7, black7, red8];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([]);
    expect(rest).toEqual(tiles);
  });

  test("should returning nothing if there are no groups and a joker", () => {
    const tiles: Tile[] = [red7, red8, freeJoker];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([]);
    expect(rest).toEqual(tiles);
  });

  test("should return a single group if there is a single group", () => {
    const tiles: Tile[] = [red7, black7, red7, red10];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([[red7, black7, red7]]);
    expect(rest).toEqual([red10]);
  });

  test("should return a single group if there is a single group and a joker", () => {
    const tiles: Tile[] = [red7, black7, red10, freeJoker];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([[red7, black7, BoundJokerTile.fromTiles([red7])]]);
    expect(rest).toEqual([red10]);
  });

  test("should return a single group of more than 3 tiles", () => {
    const tiles: Tile[] = [red7, black7, red7, red7, red10];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([[red7, black7, red7, red7]]);
    expect(rest).toEqual([red10]);
  });

  test("should return a single group of more than 3 tiles and a joker", () => {
    const tiles: Tile[] = [red7, black7, red7, red7, red10, freeJoker];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([
      [red7, black7, red7, red7, BoundJokerTile.fromTiles([red7])],
    ]);
    expect(rest).toEqual([red10]);
  });

  test("should return multiple groups if there are multiple groups", () => {
    const tiles: Tile[] = [red7, black7, red7, red10, red10, red10, red9];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([
      [red7, black7, red7],
      [red10, red10, red10],
    ]);
    expect(rest).toEqual([red9]);
  });

  test("should return multiple groups if there are multiple groups and a joker", () => {
    const tiles: Tile[] = [
      red7,
      black7,
      red7,
      red10,
      red10,
      red10,
      red9,
      freeJoker,
    ];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([
      [red7, black7, red7, BoundJokerTile.fromTiles([red7])],
      [red10, red10, red10],
    ]);
    expect(rest).toEqual([red9]);
  });

  test("prioritizes using a joker to complete a group", () => {
    const tiles: Tile[] = [red7, black7, red7, red10, red10, freeJoker];
    const { groups, rest } = getTileGroups(tiles);
    expect(groups).toEqual([
      [red7, black7, red7],
      [red10, red10, BoundJokerTile.fromTiles([red10])],
    ]);
    expect(rest).toEqual([]);
  });
});
