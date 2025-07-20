import { TileGroup } from "../../src/tile-group";
import {
  MissingTileError,
  InvalidJokerTileRemovalError,
} from "../../src/tile-set";
import { describe, expect, test } from "bun:test";
import { red7, black7, joker, red8 } from "../fixtures";

describe("tile-group", () => {
  describe("validity", () => {
    test("is not valid if empty", () => {
      const group = new TileGroup([]);
      expect(group.isValid()).toBe(false);
    });

    test("is not valid if less than 3 tiles", () => {
      const group = new TileGroup([red7]);
      expect(group.isValid()).toBe(false);
    });

    test("is valid if 3 tiles", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(group.isValid()).toBe(true);
    });

    test("is valid if more than 3 tiles", () => {
      const group = new TileGroup([red7, red7, red7, red7]);
      expect(group.isValid()).toBe(true);
    });
  });

  describe("adding tiles", () => {
    test("can add a matching tile of the same number", () => {
      const group = new TileGroup([red7, red7]);
      expect(group.check(black7)).toBe(true);
      expect(group.add(black7)).toBe(null);
      expect(group.isValid()).toBe(true);
    });

    test("can add a joker", () => {
      const group = new TileGroup([red7, red7]);
      expect(group.check(joker)).toBe(true);
      expect(group.add(joker)).toBe(null);
      expect(group.isValid()).toBe(true);
    });

    test("cannot add a tile with a different number", () => {
      const group = new TileGroup([red7, red7]);
      expect(group.check(red8)).toBe(false);
    });

    test("can substitute a joker with a matching tile", () => {
      const group = new TileGroup([red7, red7, joker]);
      expect(group.check(red7)).toBe(true);
      expect(group.add(red7)).toBe(joker);
      expect(group.isValid()).toBe(true);
    });

    test("adds a joker without substitution if existing joker is present", () => {
      const group = new TileGroup([red7, red7, joker]);
      expect(group.check(joker)).toBe(true);
      expect(group.add(joker)).toBe(null);
      expect(group.isValid()).toBe(true);
    });
  });

  describe("removing tiles", () => {
    test("can remove a tile", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(group.remove(red7)).toBe(red7);
      expect(group.isValid()).toBe(false);
    });

    test("cannot remove a tile that is not in the group", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(() => group.remove(red8)).toThrow(MissingTileError);
    });

    test("cannot remove a joker", () => {
      const group = new TileGroup([red7, red7, joker]);
      expect(() => group.remove(joker)).toThrow(InvalidJokerTileRemovalError);
    });
  });

  describe("getting removable tiles", () => {
    test("returns an empty array if the group has less than 4 tiles", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(group.getRemovableTiles()).toEqual([]);
    });

    test("returns the tiles if the group has more than 3 tiles", () => {
      const group = new TileGroup([red7, red7, red7, red7]);
      expect(group.getRemovableTiles()).toEqual([red7, red7, red7, red7]);
    });
  });

  describe("getting tiles", () => {
    test("returns the tiles in the group", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(group.getTiles()).toEqual([red7, red7, red7]);
    });

    test("returns the tiles of an empty group", () => {
      const group = new TileGroup([]);
      expect(group.getTiles()).toEqual([]);
    });

    test("returns the tiles of a group with a joker", () => {
      const group = new TileGroup([red7, red7, joker]);
      expect(group.getTiles()).toEqual([red7, red7, joker]);
    });
  });

  describe("getting score", () => {
    test("returns 0 if the group is empty", () => {
      const group = new TileGroup([]);
      expect(group.getScore()).toBe(0);
    });

    test("returns the score of a group", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(group.getScore()).toBe(21);
    });

    test("returns the score of a group with a joker", () => {
      const group = new TileGroup([red7, red7, joker]);
      expect(group.getScore()).toBe(21);
    });
  });

  describe("toString", () => {
    test("returns the correct string for a group", () => {
      const group = new TileGroup([red7, red7, red7]);
      expect(group.toString()).toBe("[Red 7, Red 7, Red 7]");
    });

    test("returns the correct string for a group with a joker", () => {
      const group = new TileGroup([red7, red7, joker]);
      expect(group.toString()).toBe("[Red 7, Red 7, Joker]");
    });
  });
});
