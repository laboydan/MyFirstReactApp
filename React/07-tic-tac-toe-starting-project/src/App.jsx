import { useState } from 'react';

import GameBoard from './components/GameBoard.jsx';
import GameOver from './components/GameOver.jsx';
import Log from './components/Log.jsx';
import Player from './components/Player.jsx';

import { WINNING_COMBINATIONS } from './winning-combinations.js';

/**
 * Default player names
 */
const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
};

/**
 * Initial game board state (3x3)
 */
const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

/**
 * Calculates current active player based on current game log. Player 1 (X)
 * always goes first.
 *
 * @param {string[]} gameTurns Current game log
 * @returns Current active player symbol - X or O
 */
function deriveActivePlayer(gameTurns) {
  let activePlayer = 'X';

  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    activePlayer = 'O';
  }

  return activePlayer;
}

/**
 * Calculates current state of game board based on current game log.
 *
 * @param {string[]} gameTurns Current game log
 * @returns Current state of game board
 */
function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((row) => [...row])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  return gameBoard;
}

/**
 * Calculates if a winning combination has been reached on game board. Returns
 * the name of the winner, if found, or otherwise null.
 *
 * @param {string[][]} gameBoard Current game board state
 * @param {object} players Names of current players
 * @returns Name of winning player or null
 */
function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }

  return winner;
}

/**
 * Main application function.
 *
 * @returns Renderable game board page
 */
function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  // Calculate active player
  const activePlayer = deriveActivePlayer(gameTurns);
  // Calculate current game board
  const gameBoard = deriveGameBoard(gameTurns);
  // Check for winner (Game Over)
  const winner = deriveWinner(gameBoard, players);
  // Check for draw (Game Over)
  const hasDraw = gameTurns.length === 9 && !winner;

  /**
   * Event handler for when clicking a game board square (button).
   *
   * @param {number} rowIndex Row of square
   * @param {number} colIndex Col of square
   */
  function handleSelectSquare(rowIndex, colIndex) {
    // update game log
    setGameTurns((prevTurns) => {
      const currentPlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  /**
   * Resets game board to initial state.
   */
  function handleRestart() {
    setGameTurns([]);
  }

  /**
   * Handler for updating player name state after name change.
   *
   * @param {string} symbol Player symbol
   * @param {string} newName Player new name
   */
  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, [symbol]: newName };
    });
  }

  return (
    <main>
      <div id='game-container'>
        <ol id='players' className='highlight-player'>
          <Player
            initialName={PLAYERS.X}
            symbol='X'
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol='O'
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
