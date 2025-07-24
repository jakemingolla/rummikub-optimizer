import { findBestPlay } from "../../src/algorithm-v3";
import { describe, it, expect } from "bun:test";
import {
  joker,
  black7,
  red8,
  red7,
  red9,
  red10,
  red11,
  orange7,
  blue7,
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
    expect(outputGameState.board).toEqual(tileGroup);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile run", () => {
    const tileRun = [red7, red8, red9];
    const inputGameState = {
      board: [],
      hand: [...tileRun],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileRun);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile group with a joker", () => {
    const tileGroup = [red7, red7, joker];
    const inputGameState = {
      board: [],
      hand: [...tileGroup],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileGroup);
    expect(outputGameState.hand).toEqual([]);
  });

  it("should find a single tile run with a joker", () => {
    const tileRun = [red7, red8, joker];
    const inputGameState = {
      board: [],
      hand: [...tileRun],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileRun);
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
    expect(outputGameState.board).toEqual(tileGroup);
    expect(outputGameState.hand).toEqual(incompleteTileRun);
  });

  it("does not move a joker from a tile group on the board to the hand to make a group", () => {
    const tileGroup = [red7, red7, joker];
    const hand = [red8, red8];
    const inputGameState = {
      board: [...tileGroup],
      hand: [...hand],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileGroup);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("does not move a joker from a tile group on the board to the hand to make a run", () => {
    const tileGroup = [red7, red7, joker];
    const hand = [red9, red10];
    const inputGameState = {
      board: [...tileGroup],
      hand: [...hand],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileGroup);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("does not move a joker from a tile run on the board to the hand to make a group", () => {
    const tileRun = [red7, red8, joker];
    const hand = [red9, red9];
    const inputGameState = {
      board: [...tileRun],
      hand: [...hand],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileRun);
    expect(outputGameState.hand).toEqual(hand);
  });

  it("does not move a joker from a tile run on the board to the hand to make a run", () => {
    const tileRun = [red7, red8, joker];
    const hand = [red9, red10];
    const inputGameState = {
      board: [...tileRun],
      hand: [...hand],
    };
    const outputGameState = findBestPlay(inputGameState);
    expect(outputGameState.board).toEqual(tileRun);
    expect(outputGameState.hand).toEqual(hand);
  });
});
