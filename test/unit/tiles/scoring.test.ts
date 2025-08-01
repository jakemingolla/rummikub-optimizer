import { describe, expect, test } from "bun:test";
import { red7, red8, black7, freeJoker } from "../../fixtures";
import { getScore } from "../../../src/tiles/scoring";
import { JOKER_SCORE } from "../../../src/constants";
import type { TileOnBoard } from "../../../src/tiles/tile";

describe("getScore", () => {
  test("returns the correct score for a group of tiles", () => {
    const tiles = [red7, red8, black7];
    const score = getScore(tiles);
    expect(score).toBe(22);
  });

  test("returns the correct score with free jokers", () => {
    const tiles = [red7, red8, black7, freeJoker];
    const score = getScore(tiles);
    expect(score).toBe(22 + JOKER_SCORE);
  });

  test("returns 0 if there are no tiles", () => {
    const tiles: TileOnBoard[] = [];
    const score = getScore(tiles);
    expect(score).toBe(0);
  });
});
