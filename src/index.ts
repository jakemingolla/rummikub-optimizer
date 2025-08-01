import { findBestPlay, findBestMeldingPlay } from "./algorithm-v3";
import type { Tile, TileOnBoard, TileInHand } from "./tiles/tile";
import { FreeJokerTile, NumberedTile, TileColor } from "./tiles/tile";
import shuffle from "knuth-shuffle-seeded";
import { STARTING_HAND_SIZE, NUMBER_OF_PLAYERS } from "./constants";

type Player = {
  melded: boolean;
  hand: TileInHand[];
};

const main = () => {
  let deck: Tile[] = [];
  const players: Player[] = [];
  let board: TileOnBoard[][] = [];

  // For each color, add 2 copies of each number (1 - 13) to the deck.
  for (const color of Object.values(TileColor)) {
    for (let i = 1; i <= 13; i++) {
      for (let j = 0; j < 2; j++) {
        const tile = new NumberedTile(color, i);
        deck.push(tile);
      }
    }
  }

  // Add 2 free jokers to the deck.
  deck.push(new FreeJokerTile());
  deck.push(new FreeJokerTile());

  // Shuffle the deck.
  deck = shuffle(deck);

  for (let i = 0; i < NUMBER_OF_PLAYERS; i++) {
    const hand: Tile[] = [];
    for (let j = 0; j < STARTING_HAND_SIZE; j++) {
      hand.push(deck.pop()!);
    }
    players.push({
      melded: false,
      hand,
    });
  }
  let activePlayerIndex = 0;
  let turnNumber = 0;
  while (deck.length > 0) {
    if (turnNumber === 20) {
      console.log();
      console.log("--------------------------------");
      console.log("Turn 20 reached, ending game");
      console.log(`There are ${deck.length} tiles left in the deck`);
      console.log(`There are ${board.length} sets on the board`);
      console.log(`There are ${players.length} players`);

      console.log("--------------------------------");
      console.log("Sets on board:");
      for (const set of board) {
        console.log(set.map((t) => t.toString()).join(", "));
      }
      console.log("--------------------------------");
      for (const [index, player] of players.entries()) {
        console.log(`Player ${index + 1} has ${player.hand.length} tiles left`);
        console.log(player.hand.map((t) => t.toString()).join(", "));
        console.log("--------------------------------");
      }
      break;
    }
    const activePlayer = players[activePlayerIndex]!;
    const numberOfSetsOnBoardBeforePlay = board.length;

    if (!activePlayer.melded) {
      const { hand: updatedHand, board: updatedBoard } = findBestMeldingPlay({
        board,
        hand: activePlayer.hand,
      });
      if (updatedBoard.length > numberOfSetsOnBoardBeforePlay) {
        console.log(`Player ${activePlayerIndex + 1} melded`);
        board = updatedBoard;
        activePlayer.hand = updatedHand;
        activePlayer.melded = true;
      } else {
        console.log(`Player ${activePlayerIndex + 1} did not meld`);
        activePlayer.hand.push(deck.pop()!);
      }
    } else {
      const { hand: updatedHand, board: updatedBoard } = findBestPlay({
        board,
        hand: activePlayer.hand,
      });
      if (updatedBoard.length > numberOfSetsOnBoardBeforePlay) {
        board = updatedBoard;
        activePlayer.hand = updatedHand;
        console.log(`Player ${activePlayerIndex + 1} played`);
      } else {
        console.log(`Player ${activePlayerIndex + 1} did not play`);
        activePlayer.hand.push(deck.pop()!);
      }
    }

    if (activePlayer.hand.length === 0) {
      console.log(
        `Player ${activePlayerIndex + 1} has no tiles left after turn ${turnNumber}`,
      );
      break;
    }

    activePlayerIndex = (activePlayerIndex + 1) % NUMBER_OF_PLAYERS;
    if (activePlayerIndex === 0) {
      turnNumber++;
    }
  }
};

main();
