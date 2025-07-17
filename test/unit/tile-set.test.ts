import { isValidTileSet } from "../../src/tile-set";
import { describe, expect, test } from "bun:test";
import { red7, black7, joker } from "../fixtures";

describe("tile-set", () => {
  test("not valid if empty", () => {
    expect(isValidTileSet([])).toBe(false);
  });

  test("not valid for single element", () => {
    expect(isValidTileSet([red7])).toBe(false);
  });

  test("valid for all the same tiles", () => {
    expect(isValidTileSet([red7, red7, red7])).toBe(true);
  });

  test("valid for different colors", () => {
    expect(isValidTileSet([red7, black7, red7])).toBe(true);
  });

  test("valid with joker", () => {
    expect(isValidTileSet([red7, black7, joker])).toBe(true);
  });

  test("valid with multiple jokers", () => {
    expect(isValidTileSet([red7, joker, joker])).toBe(true);
  });
});
