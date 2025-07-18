import {
  TileSet,
  MissingTileError,
  InvalidJokerTileRemovalError,
} from "../../src/tile-set";
import { describe, expect, test } from "bun:test";
import { red7, black7, joker, red8 } from "../fixtures";

describe("tile-set", () => {
  describe("validity", () => {
    test("is not valid if empty", () => {
      const set = new TileSet([]);
      expect(set.isValid()).toBe(false);
    });

    test("is not valid if less than 3 tiles", () => {
      const set = new TileSet([red7]);
      expect(set.isValid()).toBe(false);
    });

    test("is valid if 3 tiles", () => {
      const set = new TileSet([red7, red7, red7]);
      expect(set.isValid()).toBe(true);
    });

    test("is valid if more than 3 tiles", () => {
      const set = new TileSet([red7, red7, red7, red7]);
      expect(set.isValid()).toBe(true);
    });
  });

  describe("adding tiles", () => {
    test("can add a matching tile of the same number", () => {
      const set = new TileSet([red7, red7]);
      expect(set.check(red7)).toBe(true);
      expect(set.add(red7)).toBe(null);
      expect(set.isValid()).toBe(true);
    });

    test("can add a joker", () => {
      const set = new TileSet([red7, red7]);
      expect(set.check(joker)).toBe(true);
      expect(set.add(joker)).toBe(null);
      expect(set.isValid()).toBe(true);
    });

    test("cannot add a tile with a different number", () => {
      const set = new TileSet([red7, red7]);
      expect(set.check(red8)).toBe(false);
    });

    test("can substitute a joker with a matching tile", () => {
      const set = new TileSet([red7, red7, joker]);
      expect(set.check(red7)).toBe(true);
      expect(set.add(red7)).toBe(joker);
      expect(set.isValid()).toBe(true);
    });

    test("adds a joker without substitution if existing joker is present", () => {
      const set = new TileSet([red7, red7, joker]);
      expect(set.check(joker)).toBe(true);
      expect(set.add(joker)).toBe(null);
      expect(set.isValid()).toBe(true);
    });
  });

  describe("removing tiles", () => {
    test("can remove a tile", () => {
      const set = new TileSet([red7, red7, red7]);
      expect(set.remove(red7)).toBe(red7);
      expect(set.isValid()).toBe(false);
    });

    test("cannot remove a tile that is not in the set", () => {
      const set = new TileSet([red7, red7, red7]);
      expect(() => set.remove(red8)).toThrow(MissingTileError);
    });

    test("cannot remove a joker", () => {
      const set = new TileSet([red7, red7, joker]);
      expect(() => set.remove(joker)).toThrow(InvalidJokerTileRemovalError);
    });
  });
});
