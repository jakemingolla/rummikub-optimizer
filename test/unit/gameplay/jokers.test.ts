import { describe, expect, test } from "bun:test";
import {
  bindRemainingFreeJokers,
  substituteJokers,
} from "../../../src/gameplay/jokers";
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
  red6,
} from "../../fixtures";
import type { FreeJokerTile, TileOnBoard } from "../../../src/tiles/tile";
import { BoundJokerTile } from "../../../src/tiles/tile";
import type { GameState } from "../../../src/game-state";

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

describe("substituteJokers", () => {
  test("does nothing if there are no tiles on the board", () => {
    const gameState: GameState = {
      board: [],
      hand: [red9, freeJoker],
    };
    const substitutedGameState = substituteJokers(gameState);
    expect(substitutedGameState).toEqual(gameState);
  });

  test("does nothing if there are no bound jokers on the board", () => {
    const gameState: GameState = {
      board: [[red7, red8, red9]],
      hand: [red9, freeJoker],
    };
    const substitutedGameState = substituteJokers(gameState);
    expect(substitutedGameState).toEqual(gameState);
  });

  test("substitutes a matching tile into a group", () => {
    const gameState: GameState = {
      board: [[red7, red7, new BoundJokerTile([black7])]],
      hand: [black7, red10],
    };
    const substitutedGameState = substituteJokers(gameState);
    expect(substitutedGameState).toEqual({
      board: [[red7, red7, black7]],
      hand: [red10, freeJoker],
    });
  });

  test("substitutes a matching tile into a run", () => {
    const gameState: GameState = {
      board: [[red7, red8, new BoundJokerTile([red6, red9])]],
      hand: [black7, red9],
    };
    const substitutedGameState = substituteJokers(gameState);
    expect(substitutedGameState).toEqual({
      board: [[red7, red8, red9]],
      hand: [black7, freeJoker],
    });

    test("only substitutes a single matching tile for a bound joker", () => {
      const gameState: GameState = {
        board: [[red7, red8, new BoundJokerTile([red6, red9])]],
        hand: [black7, red9, red9],
      };
      const substitutedGameState = substituteJokers(gameState);
      expect(substitutedGameState).toEqual({
        board: [[red7, red8, red9]],
        hand: [black7, red9, freeJoker],
      });
    });
  });
});

/*

describe("substituteJokers", () => {
  it("should do nothing if there are no jokers", () => {
    const inputGameState = {
      board: [],
      hand: [],
    };
    const outputGameState = substituteJokers(inputGameState);
    expect(outputGameState.board).toEqual([]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should do nothing if there are no jokers on the hand", () => {
    const inputGameState = {
      board: [],
      hand: [red7, red8, red9],
    };
    const outputGameState = substituteJokers(inputGameState);
    expect(outputGameState.board).toEqual([]);
    expect(outputGameState.hand).toEqual([red7, red8, red9]);
  });

  it("should do nothing if there are no jokers on the board", () => {
    const inputGameState = {
      board: [[red7, red8, red9]],
      hand: [],
    };
    const outputGameState = substituteJokers(inputGameState);
    expect(outputGameState.board).toEqual([[red7, red8, red9]]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should substitute a matching tile into a group", () => {
    const inputGameState = {
      board: [[red7, red7, new BoundJokerTile([black7])]],
      hand: [black7, red10],
    };
    const outputGameState = substituteJokers(inputGameState);
    expect(outputGameState.board).toEqual([[red7, red7, black7]]);
    expect(outputGameState.hand).toEqual([red10, freeJoker]);
  });

  it("should substitute a matching tile into a run", () => {
    const inputGameState = {
      board: [[red7, red8, new BoundJokerTile([red6, red9])]],
      hand: [black7, red9],
    };
    const outputGameState = substituteJokers(inputGameState);
    expect(outputGameState.board).toEqual([[red7, red8, red9]]);
    expect(outputGameState.hand).toEqual([black7, freeJoker]);
  });
});
*/
