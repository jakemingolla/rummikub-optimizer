import { findBestPlay, substituteJokers } from "../../src/algorithm-v3";
import { BoundJokerTile } from "../../src/tiles";
import { describe, it, expect } from "bun:test";
import {
  freeJoker,
  black7,
  red8,
  red7,
  red9,
  red10,
  red11,
  red6,
} from "../fixtures";

describe("findBestPlay", () => {
  it("should find nothing if there are no tiles", () => {
    const inputGameState = {
      board: [],
      hand: [],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile group", () => {
    const tileGroup = [red7, red7, red7];
    const inputGameState = {
      board: [],
      hand: [...tileGroup],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileGroup]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile run", () => {
    const tileRun = [red7, red8, red9];
    const inputGameState = {
      board: [],
      hand: [...tileRun],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileRun]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile group with a joker", () => {
    const hand = [red7, red7, freeJoker];
    const tileGroup = [red7, red7, BoundJokerTile.fromTiles([red7])];
    const inputGameState = {
      board: [],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileGroup]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile run with a joker", () => {
    const hand = [red7, red8, freeJoker];
    const tileRun = [red7, red8, new BoundJokerTile([red6, red9])];
    const inputGameState = {
      board: [],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileRun]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a group rather than a run", () => {
    const tileGroup = [red7, red7, red7];
    const incompleteTileRun = [red8, red9];
    const inputGameState = {
      board: [],
      hand: [...tileGroup, ...incompleteTileRun],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileGroup]);
    expect(outputGameState.hand).toEqual(incompleteTileRun);
  });

  it("does not move a joker from a tile group on the board to the hand to make a group", () => {
    const tileGroup = [red7, red7, new BoundJokerTile([red7])];
    const hand = [red8, red8];
    const inputGameState = {
      board: [tileGroup],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileGroup]);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("does not move a joker from a tile group on the board to the hand to make a run", () => {
    const tileGroup = [red7, red7, new BoundJokerTile([red7])];
    const hand = [red9, red10];
    const inputGameState = {
      board: [tileGroup],
      hand: hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileGroup]);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("does not move a joker from a tile run on the board to the hand to make a group", () => {
    const tileRun = [red7, red8, new BoundJokerTile([red6, red9])];
    const hand = [red11, red11];
    const inputGameState = {
      board: [tileRun],
      hand: hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileRun]);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("does not move a joker from a tile run on the board to the hand to make a run", () => {
    const tileRun = [red7, red8, new BoundJokerTile([red6, red9])];
    const hand = [red10, red11];
    const inputGameState = {
      board: [tileRun],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileRun]);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("should add to a group", () => {
    const tileRun = [red7, red7, red7];
    const hand = [black7];
    const inputGameState = {
      board: [tileRun],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileRun.concat(hand)]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should add to a run", () => {
    const tileRun = [red7, red8, red9];
    const hand = [red10];
    const inputGameState = {
      board: [tileRun],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([tileRun.concat(hand)]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should add a joker to a run", () => {
    const tileRun = [red7, red8, red9];
    const hand = [freeJoker];
    const inputGameState = {
      board: [tileRun],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([
      [...tileRun, new BoundJokerTile([red6, red10])],
    ]);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should add a joker to a group", () => {
    const tileGroup = [red7, red7, red7];
    const hand = [freeJoker];
    const inputGameState = {
      board: [tileGroup],
      hand,
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual([
      [...tileGroup, BoundJokerTile.fromTiles([red7])],
    ]);
    expect(outputGameState.hand).toEqual([]);
  });
});

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
