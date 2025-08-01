import { describe, expect, test } from "bun:test";
import { getTileRuns } from "../../../src/gameplay/get-tile-runs";
import {
  freeJoker,
  red6,
  red7,
  red8,
  red9,
  red10,
  black7,
  black8,
  black9,
  orange7,
} from "../../fixtures";
import type { Tile } from "../../../src/tiles/tile";
import { BoundJokerTile } from "../../../src/tiles/tile";

describe("getTileRuns", () => {
  test("should return the nothing if there are no tiles", () => {
    const tiles: Tile[] = [];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([]);
    expect(rest).toEqual([]);
  });

  test("should return nothing if there are no runs", () => {
    const tiles: Tile[] = [red7, red8, black7];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([]);
    expect(rest).toEqual(tiles);
  });

  test("should returning nothing if there are no runs and a joker", () => {
    const tiles: Tile[] = [red7, red10, freeJoker];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([]);
    expect(rest).toEqual(tiles);
  });

  test("should return a single run if there is a single run", () => {
    const tiles: Tile[] = [red7, red8, red9, black7];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([[red7, red8, red9]]);
    expect(rest).toEqual([black7]);
  });

  test("should return a single run if there is a single run and a joker", () => {
    const tiles: Tile[] = [red7, black7, red8, freeJoker];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([[red7, red8, new BoundJokerTile([red6, red9])]]);
    expect(rest).toEqual([black7]);
  });

  test("should return a single run of more than 3 tiles", () => {
    const tiles: Tile[] = [red7, red7, red8, red9, red10];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([[red7, red8, red9, red10]]);
    expect(rest).toEqual([red7]);
  });

  test("should return a single run of more than 3 tiles and a joker", () => {
    const tiles: Tile[] = [red7, red7, red8, red9, freeJoker];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([
      [red7, red8, red9, new BoundJokerTile([red6, red10])],
    ]);
    expect(rest).toEqual([red7]);
  });

  test("should return multiple runs if there are multiple runs", () => {
    const tiles: Tile[] = [red7, red8, red9, black7, black8, black9, red7];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([
      [red7, red8, red9],
      [black7, black8, black9],
    ]);
    expect(rest).toEqual([red7]);
  });

  test("should return multiple runs if there are multiple runs and a joker", () => {
    const tiles: Tile[] = [
      red8,
      red9,
      orange7,
      black7,
      black8,
      black9,
      freeJoker,
    ];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([
      [red8, red9, new BoundJokerTile([red7, red10])],
      [black7, black8, black9],
    ]);
    expect(rest).toEqual([orange7]);
  });

  test("prioritizes using a joker to complete a run", () => {
    const tiles: Tile[] = [red7, red8, black7, black8, black9, freeJoker];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([
      [red7, red8, new BoundJokerTile([red6, red9])],
      [black7, black8, black9],
    ]);
    expect(rest).toEqual([]);
  });

  test("can use a joker to complete a run with a gap", () => {
    const tiles: Tile[] = [red7, red9, freeJoker, black7];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([[red7, new BoundJokerTile([red8]), red9]]);
    expect(rest).toEqual([black7]);
  });

  test("can use multiple jokers to complete a run with a gap", () => {
    const tiles: Tile[] = [red7, red10, freeJoker, freeJoker, black7];
    const { runs, rest } = getTileRuns(tiles);
    expect(runs).toEqual([
      [red7, new BoundJokerTile([red8]), new BoundJokerTile([red9]), red10],
    ]);
    expect(rest).toEqual([black7]);
  });
});
