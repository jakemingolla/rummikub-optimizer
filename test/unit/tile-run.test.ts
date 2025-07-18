import { TileRun } from "../../src/tile-run";
import { describe, expect, test } from "bun:test";
import { red7, red8, red9, red10, joker, black7 } from "../fixtures";

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
  });
});
