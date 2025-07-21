import { TileRun, InvalidTileRemovalError } from "../../src/tile-run";
import { describe, expect, test } from "bun:test";
import { red6, red7, red8, red9, red10, joker, black7 } from "../fixtures";
import {
  MissingTileError,
  InvalidJokerTileRemovalError,
} from "../../src/tile-set";

describe("tile-run", () => {
  describe("validity", () => {
    test("is not valid if less than 3 tiles", () => {
      const run = new TileRun([red7]);
      expect(run.isValid()).toBe(false);
    });

    test("is valid if 3 tiles", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.isValid()).toBe(true);
    });

    test("is valid if more than 3 tiles", () => {
      const run = new TileRun([red7, red8, red9, joker]);
      expect(run.isValid()).toBe(true);
    });
  });

  describe("adding tiles", () => {
    test("can add a tile to the run", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.check(red10)).toBe(true);
      expect(run.add(red10)).toBe(null);
      expect(run.isValid()).toBe(true);
    });

    test("cannot add a tile with a different color", () => {
      const run = new TileRun([red8, red9, red10]);
      expect(run.check(black7)).toBe(false);
    });

    test("cannot add a tile that does not match the run", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.check(red7)).toBe(false);
    });

    test("cannot add a tile that does not match the run with a joker", () => {
      const run = new TileRun([joker, red8, red9]);
      expect(run.check(red8)).toBe(false);
    });

    test("can add a tile to replace a joker at the start of the run", () => {
      const run = new TileRun([joker, red8, red9]);
      expect(run.check(red7)).toBe(true);
      expect(run.add(red7)).toBe(joker);
      expect(run.isValid()).toBe(true);
    });

    test("can add a tile to replace a joker at the end of the run", () => {
      const run = new TileRun([red7, red8, joker]);
      expect(run.check(red9)).toBe(true);
      expect(run.add(red9)).toBe(joker);
      expect(run.isValid()).toBe(true);
    });

    test("can add a tile to replace a joker in the middle of the run", () => {
      const run = new TileRun([red7, joker, red9]);
      expect(run.check(red8)).toBe(true);
      expect(run.add(red8)).toBe(joker);
      expect(run.isValid()).toBe(true);
    });

    test("can add a numbered tile to an empty run", () => {
      const run = new TileRun([]);
      expect(run.check(red7)).toBe(true);
      expect(run.add(red7)).toBe(null);
      expect(run.check(red8)).toBe(true);
      expect(run.check(red7)).toBe(false);
      expect(run.check(black7)).toBe(false);
    });

    test("can add a joker to an empty run", () => {
      const run = new TileRun([]);
      expect(run.check(joker)).toBe(true);
      expect(run.add(joker)).toBe(null);
      expect(run.isValid()).toBe(false);
    });

    test("can add a numberered tile to a run with a single joker", () => {
      const run = new TileRun([joker]);
      expect(run.check(red7)).toBe(true);
      expect(run.add(red7)).toBe(joker);
      expect(run.isValid()).toBe(false);
    });

    test("can add a numbered tile to a run with a multiple jokers", () => {
      const run = new TileRun([joker, joker]);
      expect(run.check(red7)).toBe(true);
      expect(run.add(red7)).toBe(joker);
      expect(run.isValid()).toBe(false);
    });
  });

  describe("removing tiles", () => {
    test("can remove a tile from the run", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.remove(red7)).toBe(red7);
      expect(run.isValid()).toBe(false);
    });

    test("cannot remove a tile that is not in the run", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(() => run.remove(red10)).toThrow(MissingTileError);
    });

    test("cannot remove a tile that is not the first or last tile", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(() => run.remove(red8)).toThrow(InvalidTileRemovalError);
    });

    test("cannot remove a joker tile", () => {
      expect(() => new TileRun([]).remove(joker)).toThrow(
        InvalidJokerTileRemovalError,
      );
    });
  });

  describe("getting removable tiles", () => {
    test("returns an empty array if the run is less than 3 tiles", () => {
      const run = new TileRun([red7]);
      expect(run.getRemovableTiles()).toEqual([]);
    });

    test("returns an empty array if the run is exactly 3 tiles", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.getRemovableTiles()).toEqual([]);
    });

    test("returns the first and last tiles if they are not jokers", () => {
      const run = new TileRun([red7, red8, red9, red10]);
      expect(run.getRemovableTiles()).toEqual([[red7], [red10]]);
    });

    test("does not return jokers if they are the first or last tile", () => {
      const run = new TileRun([joker, red7, red8, red9, joker]);
      expect(run.getRemovableTiles()).toEqual([]);
    });

    test("leaves at least 3 tiles in the run", () => {
      const run = new TileRun([red6, red7, red8, red9, red10]);
      expect(run.getRemovableTiles()).toEqual([
        [red6],
        [red10],
        [red6, red7],
        [red9, red10],
        [red6, red10],
      ]);
    });

    test("allows removing a numbered tile if it starts with a joker", () => {
      const run = new TileRun([joker, red7, red8, red9, red10]);
      expect(run.getRemovableTiles()).toEqual([[red10], [red9, red10]]);
    });

    test("allows removing a numbered tile if it ends with a joker", () => {
      const run = new TileRun([red6, red7, red8, red9, joker]);
      expect(run.getRemovableTiles()).toEqual([[red6], [red6, red7]]);
    });

    test("handles run with only jokers", () => {
      const run = new TileRun([joker, joker, joker, joker]);
      expect(run.getRemovableTiles()).toEqual([]);
    });

    test("handles run with jokers in the middle", () => {
      const run = new TileRun([red6, joker, red8, joker, red10]);
      expect(run.getRemovableTiles()).toEqual([[red6], [red10], [red6, red10]]);
    });

    test("handles run with consecutive jokers at start", () => {
      const run = new TileRun([joker, joker, red8, red9, red10]);
      expect(run.getRemovableTiles()).toEqual([[red10], [red9, red10]]);
    });

    test("handles run with consecutive jokers at end", () => {
      const run = new TileRun([red6, red7, red8, joker, joker]);
      expect(run.getRemovableTiles()).toEqual([[red6], [red6, red7]]);
    });

    test("handles run with exactly 4 tiles", () => {
      const run = new TileRun([red6, red7, red8, red9]);
      expect(run.getRemovableTiles()).toEqual([[red6], [red9]]);
    });

    test("handles run with exactly 5 tiles", () => {
      const run = new TileRun([red6, red7, red8, red9, red10]);
      expect(run.getRemovableTiles()).toEqual([
        [red6],
        [red10],
        [red6, red7],
        [red9, red10],
        [red6, red10],
      ]);
    });

    test("handles run with single numbered tile between jokers", () => {
      const run = new TileRun([joker, red7, joker, red9, joker]);
      expect(run.getRemovableTiles()).toEqual([]);
    });
  });

  describe("getting tiles", () => {
    test("returns the tiles in the group", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.getTiles()).toEqual([red7, red8, red9]);
    });

    test("returns the tiles of an empty group", () => {
      const run = new TileRun([]);
      expect(run.getTiles()).toEqual([]);
    });

    test("returns the tiles of a group with a joker", () => {
      const run = new TileRun([red7, red8, joker]);
      expect(run.getTiles()).toEqual([red7, red8, joker]);
    });
  });

  describe("getting score", () => {
    test("returns 0 if the run is empty", () => {
      const run = new TileRun([]);
      expect(run.getScore()).toBe(0);
    });

    test("returns the score of a run", () => {
      const run = new TileRun([red7, red8, red9]);
      expect(run.getScore()).toBe(24);
    });

    test("returns the score of a run with a joker in the middle", () => {
      const run = new TileRun([red7, joker, red9]);
      expect(run.getScore()).toBe(24);
    });

    test("returns the score of a run with a joker at the start", () => {
      const run = new TileRun([joker, red7, red8]);
      expect(run.getScore()).toBe(24);
    });

    test("returns the score of a run with a joker at the end", () => {
      const run = new TileRun([red7, red8, joker]);
      expect(run.getScore()).toBe(24);
    });
  });
});
