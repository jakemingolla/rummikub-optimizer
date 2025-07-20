import { describe, it, expect } from "bun:test";
import { Player } from "../../src/player";
import { joker, black7, red8, red7, red9 } from "../fixtures";
import { TileGroup } from "../../src/tile-group";
import { TileRun } from "../../src/tile-run";

describe("Player", () => {
  describe("getScore", () => {
    it("should have a score of zero if no tiles", () => {
      const player = new Player([]);
      expect(player.getScore()).toBe(0);
    });

    it("should have a score of 30 if a joker is in the hand", () => {
      const player = new Player([joker]);
      expect(player.getScore()).toBe(30);
    });

    it("should add numbered tiles to the score", () => {
      const player = new Player([black7, red8]);
      expect(player.getScore()).toBe(15);
    });

    it("should add multiplejokers to the score", () => {
      const player = new Player([joker, joker]);
      expect(player.getScore()).toBe(60);
    });
  });

  describe("hasWon", () => {
    it("should have won if the hand is empty", () => {
      const player = new Player([]);
      expect(player.hasWon()).toBe(true);
    });

    it("should not have won if the hand is not empty", () => {
      const player = new Player([black7]);
      expect(player.hasWon()).toBe(false);
    });
  });

  describe("makePlay", () => {
    it("should return an empty array if no play can be made", () => {
      const player = new Player([]);
      const play = player.makePlay([], []);
      expect(play).toHaveLength(0);
    });

    it("should return a winning tile group if a tile group can be made", () => {
      const player = new Player([black7, black7, black7]);
      const play = player.makePlay([], []);

      expect(play).toHaveLength(1);
      const group = play.at(0)!;
      expect(group).toBeInstanceOf(TileGroup);
      expect(group.isValid()).toBe(true);

      expect(player.getScore()).toBe(0);
      expect(player.hasWon()).toBe(true);
    });

    it("should return a winning tile run if a tile run can be made", () => {
      const player = new Player([red7, red8, red9]);
      const play = player.makePlay([], []);

      expect(play).toHaveLength(1);
      const run = play.at(0)!;
      expect(run).toBeInstanceOf(TileRun);
      expect(run.isValid()).toBe(true);

      expect(player.getScore()).toBe(0);
      expect(player.hasWon()).toBe(true);
    });
  });
});
