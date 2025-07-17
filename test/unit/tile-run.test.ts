import { red7, red8, red9, red10, black7, joker } from "../fixtures";
import { describe, expect, test } from "bun:test";
import { isValidTileRun } from "../../src/tile-run";

describe("tile-run", () => {
  test("not valid if empty", () => {
    expect(isValidTileRun([])).toBe(false);
  });

  test("not valid for single tile", () => {
    expect(isValidTileRun([red7])).toBe(false);
  });

  test("is valid for run of 3", () => {
    expect(isValidTileRun([red7, red8, red9])).toBe(true);
  });

  test("is valid for run of 4", () => {
    expect(isValidTileRun([red7, red8, red9, red10])).toBe(true);
  });

  test("order doesnt matter", () => {
    expect(isValidTileRun([red9, red8, red7])).toBe(true);
  });

  test("is not valid if color mismatch", () => {
    expect(isValidTileRun([black7, red8, red9])).toBe(false);
  });

  test("is valid with joker", () => {
    expect(isValidTileRun([red7, joker, red9])).toBe(true);
  });

  test("is valid with multiple jokers", () => {
    expect(isValidTileRun([joker, red7, joker, red10])).toBe(true);
  });

  test("not valid with gap", () => {
    expect(isValidTileRun([red7, red8, red10])).toBe(false);
  });

  test("not valid with gap even with joker", () => {
    expect(isValidTileRun([red7, joker, red10])).toBe(false);
  });

  test("not valid with repeat", () => {
    expect(isValidTileRun([red7, red7, red8, red9])).toBe(false);
  });
});
