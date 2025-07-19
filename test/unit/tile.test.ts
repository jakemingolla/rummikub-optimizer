import { describe, expect, test } from "bun:test";
import { red7, red8, black7, joker } from "../fixtures";

describe("tile", () => {
  describe("numbered tiles", () => {
    test("can check equality with other numbered tiles", () => {
      expect(red7.equals(red7)).toBe(true);
      expect(red7.equals(red8)).toBe(false);
      expect(red7.equals(black7)).toBe(false);
    });

    test("can check equality with joker tiles", () => {
      expect(red7.equals(joker)).toBe(true);
    });
  });

  describe("joker tiles", () => {
    test("can check equality with other joker tiles", () => {
      expect(joker.equals(joker)).toBe(true);
    });

    test("can check equality with numbered tiles", () => {
      expect(joker.equals(red7)).toBe(true);
    });
  });
});
