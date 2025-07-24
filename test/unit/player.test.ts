import { describe, it, expect } from "bun:test";
import { Player } from "../../src/player";
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
import { TileGroup } from "../../src/tile-group";
import { TileRun } from "../../src/tile-run";
import { MELD_THRESHOLD, JOKER_SCORE } from "../../src/constants";

describe("Player", () => {
  describe("getScore", () => {
    it("should have a score of zero if no tiles", () => {
      const player = new Player([]);
      expect(player.getScore()).toBe(0);
    });

    it("should have a score of JOKER_SCORE if a joker is in the hand", () => {
      const player = new Player([joker]);
      expect(player.getScore()).toBe(JOKER_SCORE);
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
      const player = new Player([], true);
      const play = player.makePlay([]);
      expect(play).toHaveLength(0);
    });

    it("should return an empty array if no plays can be made", () => {
      const player = new Player([red7], true);
      const play = player.makePlay([]);
      expect(play).toHaveLength(0);
      expect(player.hasWon()).toBe(false);
    });

    it("should return a winning tile group if a tile group can be made", () => {
      const player = new Player([black7, black7, black7], true);
      const play = player.makePlay([]);

      expect(play).toHaveLength(1);
      const group = play.at(0)!;
      expect(group).toBeInstanceOf(TileGroup);
      expect(group.isValid()).toBe(true);

      expect(player.getScore()).toBe(0);
      expect(player.hasWon()).toBe(true);
    });

    it("should return a winning tile run if a tile run can be made", () => {
      const player = new Player([red7, red8, red9], true);
      const play = player.makePlay([]);

      expect(play).toHaveLength(1);
      const run = play.at(0)!;
      expect(run).toBeInstanceOf(TileRun);
      expect(run.isValid()).toBe(true);

      expect(player.getScore()).toBe(0);
      expect(player.hasWon()).toBe(true);
    });

    it("should not reuse a numbered tile in multiple plays", () => {
      const player = new Player([red7, red7, red7, red8, red9], true);
      const play = player.makePlay([]);

      expect(play).toHaveLength(1);
    });

    it("should not reuse a joker in multiple plays", () => {
      const player = new Player([red7, red7, red8, joker], true);
      const play = player.makePlay([]);

      expect(play).toHaveLength(1);
    });

    it("cannot make a play if the player has not melded", () => {
      const player = new Player([red7, red7, red7], false);
      const play = player.makePlay([]);
      expect(play).toHaveLength(0);
    });

    it("only returns a single melding play if the player has not yet melded", () => {
      const player = new Player(
        [red10, red10, red10, red11, red11, red11],
        false,
      );
      const play = player.makePlay([]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBeGreaterThanOrEqual(MELD_THRESHOLD);
      expect(player.hasWon()).toBe(false);
    });

    it("can make multiple plays if the player has melded", () => {
      const player = new Player(
        [red10, red10, red10, red11, red11, red11],
        true,
      );
      const play = player.makePlay([]);
      expect(play).toHaveLength(2);
      const scores = play.map((p) => p.getScore());
      expect(scores.sort((a, b) => a - b)).toEqual([30, 33]);
    });

    it("cannot make a play that would break an existing group", () => {
      const existingGroup = new TileGroup([red7, red7, red7, red7]);
      const player = new Player([black7], true);
      const play = player.makePlay([existingGroup]);
      expect(play).toHaveLength(0);
    });

    it("can remove a tile from an existing group to make a group", () => {
      const existingGroup = new TileGroup([red7, blue7, orange7, red7]);
      const player = new Player([black7, black7], true);
      const play = player.makePlay([existingGroup]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(21);
      expect(existingGroup.getTiles()).toHaveLength(3);
      expect(existingGroup.getScore()).toBe(21);
    });

    it("can remove a tile from an existing group to make a run", () => {
      const existingGroup = new TileGroup([red7, red7, red7, red7]);
      const player = new Player([red8, red9], true);
      const play = player.makePlay([existingGroup]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(24);
      expect(existingGroup.getTiles()).toHaveLength(3);
      expect(existingGroup.getScore()).toBe(21);
    });

    it("can remove a tile from an existing run to make a group", () => {
      const existingRun = new TileRun([red7, red8, red9, red10]);
      const player = new Player([red7, red7], true);
      const play = player.makePlay([existingRun]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(21);
      expect(existingRun.getTiles()).toHaveLength(3);
      expect(existingRun.getScore()).toBe(27);
    });

    it("can remove a tile from an existing run to make a run", () => {
      const existingRun = new TileRun([red7, red8, red9, red10]);
      const player = new Player([red8, red9], true);
      const play = player.makePlay([existingRun]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(24);
      expect(existingRun.getTiles()).toHaveLength(3);
      expect(existingRun.getScore()).toBe(27);
    });

    it("can remove a tile from multiple groups to make a group", () => {
      const red7Group = new TileGroup([red7, red7, red7, red7]);
      const black7Group = new TileGroup([black7, black7, black7, black7]);
      const player = new Player([red7], true);
      const play = player.makePlay([red7Group, black7Group]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(21);
      expect(red7Group.getTiles()).toHaveLength(3);
      expect(red7Group.getScore()).toBe(21);
      expect(black7Group.getTiles()).toHaveLength(3);
      expect(black7Group.getScore()).toBe(21);
    });

    it("can remove a tile from multiple groups to make a run", () => {
      const red7Group = new TileGroup([red7, red7, red7, red7]);
      const red8Group = new TileGroup([red8, red8, red8, red8]);
      const player = new Player([red9], true);
      const play = player.makePlay([red7Group, red8Group]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(24);
      expect(red7Group.getTiles()).toHaveLength(3);
      expect(red7Group.getScore()).toBe(21);
      expect(red8Group.getTiles()).toHaveLength(3);
      expect(red8Group.getScore()).toBe(24);
    });

    it("can remove a tile from multiple runs to make a group", () => {
      const firstRun = new TileRun([red7, red8, red9, red10]);
      const secondRun = new TileRun([red7, red8, red9, red10]);
      const player = new Player([black7], true);
      const play = player.makePlay([firstRun, secondRun]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(21);
      expect(firstRun.getTiles()).toHaveLength(3);
      expect(firstRun.getScore()).toBe(27);
      expect(secondRun.getTiles()).toHaveLength(3);
      expect(secondRun.getScore()).toBe(27);
    });

    it("cannot make a play solely from removable tiles on the board", () => {
      // It's possible to make a run by taking the first tile from each group,
      // but it should not be allowed.
      const red7Group = new TileGroup([red7, red7, red7, red7]);
      const red8Group = new TileGroup([red8, red8, red8, red8]);
      const red9Group = new TileGroup([red9, red9, red9, red9]);
      const player = new Player([red11], true);
      const play = player.makePlay([red7Group, red8Group, red9Group]);
      expect(play).toHaveLength(0);
    });

    it("cannot reuse a tile from a group on the board to make multiple groups", () => {
      const red7Group = new TileGroup([red7, red7, red7, red7]);
      const player = new Player([red7, red7, red8, red9], true);
      const play = player.makePlay([red7Group]);
      expect(play).toHaveLength(1);
    });

    it("can add to an existing group on the board", () => {
      const existingGroup = new TileGroup([red7, red7, red7, red7]);
      const player = new Player([red7, red7, red7, red7], true);
      const play = player.makePlay([existingGroup]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(7 * 8);
      expect(existingGroup.getTiles()).toHaveLength(8);
      expect(existingGroup.getScore()).toBe(7 * 8);
      expect(player.getScore()).toBe(0);
      expect(player.hasWon()).toBe(true);
    });

    it("can add to an existing run on the board", () => {
      const existingRun = new TileRun([red7, red8, red9, red10]);
      const player = new Player([red11], true);
      const play = player.makePlay([existingRun]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(45);
      expect(existingRun.getTiles()).toHaveLength(5);
      expect(existingRun.getScore()).toBe(45);
      expect(player.getScore()).toBe(0);
      expect(player.hasWon()).toBe(true);
    });

    it("does not remove tiles from the player's hand that were not used", () => {
      const player = new Player([red8, red9], true);
      const board = [new TileRun([red9, red10, red11])];
      const play = player.makePlay(board);
      expect(play).toHaveLength(1);
      expect(player.getScore()).toBe(9);
    });
  });

  describe("draw", () => {
    it("should add a tile to the hand if the pool is not empty", () => {
      const player = new Player([]);
      player.draw([red7]);
      expect(player.hasWon()).toBe(false);
      expect(player.getScore()).toBe(7);
    });

    it("should not add a tile to the hand if the pool is empty", () => {
      const player = new Player([]);
      player.draw([]);
      expect(player.hasWon()).toBe(true);
    });

    it("should remove the tile from the pool once drawn", () => {
      const pool = [red7];
      const player = new Player([]);
      player.draw(pool);
      expect(pool).toHaveLength(0);
    });
  });

  describe("hasMelded", () => {
    it("should return false if the player has not melded", () => {
      const player = new Player([], false);
      expect(player.hasMelded()).toBe(false);
    });
  });

  describe("happy path", () => {
    it("should draw until a play can be made once melded", () => {
      const player = new Player([], true);
      const pool = [red7, red7, red7];

      for (let i = 0; i < 3; i++) {
        const play = player.makePlay([]);
        expect(play).toHaveLength(0);
        player.draw(pool);
      }

      const play = player.makePlay([]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBe(21);
      expect(player.hasWon()).toBe(true);
    });

    it("should draw until a melding play can be made", () => {
      const player = new Player([], false);
      const pool = [red7, red7, red7, red7, red7];

      for (let i = 0; i < 5; i++) {
        const play = player.makePlay([]);
        expect(play).toHaveLength(0);
        player.draw(pool);
      }

      const play = player.makePlay([]);
      expect(play).toHaveLength(1);
      expect(play.at(0)!.getScore()).toBeGreaterThanOrEqual(MELD_THRESHOLD);
      expect(player.hasWon()).toBe(true);
    });
  });
});
