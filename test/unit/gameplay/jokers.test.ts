import { describe, expect, test } from "bun:test";
import { bindRemainingFreeJokers } from "../../../src/gameplay/jokers";
import {
  red7,
  orange7,
  blue7,
  black7,
  freeJoker,
  red8,
  red9,
  red10,
  red11,
} from "../../fixtures";
import type { FreeJokerTile, TileOnBoard } from "../../../src/tiles/tile";
import { BoundJokerTile } from "../../../src/tiles/tile";

describe("bindRemainingFreeJokers", () => {
  test("does nothing if there are no provided tiles", () => {
    const set: TileOnBoard[] = [];
    const freeJokerTiles: FreeJokerTile[] = [];
    const boundTiles = bindRemainingFreeJokers(set, freeJokerTiles);
    expect(boundTiles).toEqual(set);
  });

  test("does nothing if there are no free jokers", () => {
    const set: TileOnBoard[] = [red7, red7, black7];
    const freeJokerTiles: FreeJokerTile[] = [];
    const boundTiles = bindRemainingFreeJokers(set, freeJokerTiles);
    expect(boundTiles).toEqual(set);
  });

  test("binds free jokers to a group of tiles", () => {
    const set: TileOnBoard[] = [red7, red7, black7];
    const freeJokerTiles: FreeJokerTile[] = [freeJoker];
    const boundTiles = bindRemainingFreeJokers(set, freeJokerTiles);
    const boundJoker = new BoundJokerTile([red7, blue7, orange7, black7]);
    expect(boundTiles).toEqual([red7, red7, black7, boundJoker]);
  });

  test("binds multiple free jokers to a group of tiles", () => {
    const set: TileOnBoard[] = [red7, red7, black7];
    const freeJokerTiles: FreeJokerTile[] = [freeJoker, freeJoker];
    const boundTiles = bindRemainingFreeJokers(set, freeJokerTiles);
    const boundJoker = new BoundJokerTile([red7, blue7, orange7, black7]);
    expect(boundTiles).toEqual([red7, red7, black7, boundJoker, boundJoker]);
  });

  test("binds free jokers to a run of tiles", () => {
    const set: TileOnBoard[] = [red8, red9, red10];
    const freeJokerTiles: FreeJokerTile[] = [freeJoker];
    const boundTiles = bindRemainingFreeJokers(set, freeJokerTiles);
    const boundJoker = new BoundJokerTile([red7, red11]);
    expect(boundTiles).toEqual([red8, red9, red10, boundJoker]);
  });

  test("binds multiple free jokers to a run of tiles", () => {
    const set: TileOnBoard[] = [red8, red9, red10];
    const freeJokerTiles: FreeJokerTile[] = [freeJoker, freeJoker];
    const boundTiles = bindRemainingFreeJokers(set, freeJokerTiles);
    const boundJoker = new BoundJokerTile([red7, red11]);
    expect(boundTiles).toEqual([red8, red9, red10, boundJoker, boundJoker]);
  });
});
