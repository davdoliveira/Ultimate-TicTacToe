import React from 'react';

/*
 * Regras do Ultimate TicTacToe (funções puras, sem React, fáceis de testar).
 *
 *  - O jogo tem 9 tabuleiros pequenos (3x3). Ambos são indexados de 0 a 8.
 *  - A casa onde jogas determina o tabuleiro onde o adversário tem de jogar.
 *  - Se esse tabuleiro já estiver terminado (ganho ou empatado), o adversário
 *    pode jogar em qualquer tabuleiro que ainda não esteja terminado.
 *  - Ganhar um tabuleiro pequeno marca-o com 'X' ou 'O'; se ficar cheio sem
 *    vencedor, é marcado com 'D' (empate) e não conta para ninguém.
 *  - Ganha quem fizer uma linha de 3 tabuleiros pequenos.
 *  - Se todos os tabuleiros terminarem sem linha, o jogo é empate.
 */

export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/** Estado inicial de um jogo novo. */
export function createInitialGame(xIsNext = true) {
  return {
    squares: Array.from({ length: 9 }, () => Array(9).fill(null)),
    localWinners: Array(9).fill(null), // null | 'X' | 'O' | 'D'
    activeBoard: null, // null = jogada livre
    xIsNext,
    winner: null, // null | 'X' | 'O'
    draw: false,
  };
}

/** Devolve 'X' ou 'O' se esse jogador tiver uma linha em `cells`, senão null. */
export function calculateWinner(cells) {
  for (const [a, b, c] of WIN_LINES) {
    const v = cells[a];
    if ((v === 'X' || v === 'O') && v === cells[b] && v === cells[c]) {
      return v;
    }
  }
  return null;
}

/** Resultado de um tabuleiro pequeno: 'X', 'O', 'D' (empate) ou null (por acabar). */
export function getBoardResult(cells) {
  const winner = calculateWinner(cells);
  if (winner) return winner;
  return cells.every((c) => c !== null) ? 'D' : null;
}

/** O tabuleiro `outerIdx` está disponível para o jogador da vez? */
export function isBoardActive(game, outerIdx) {
  if (game.winner || game.draw) return false;
  if (game.localWinners[outerIdx] !== null) return false;
  return game.activeBoard === null || game.activeBoard === outerIdx;
}

/** A jogada (tabuleiro, casa) é válida? */
export function canPlay(game, outerIdx, innerIdx) {
  return isBoardActive(game, outerIdx) && game.squares[outerIdx][innerIdx] === null;
}

/**
 * Aplica uma jogada. Devolve os campos de estado atualizados, ou null se a
 * jogada for inválida (nesse caso nada muda).
 */
export function playMove(game, outerIdx, innerIdx) {
  if (!canPlay(game, outerIdx, innerIdx)) return null;

  const player = game.xIsNext ? 'X' : 'O';

  const squares = game.squares.slice();
  const board = squares[outerIdx].slice();
  board[innerIdx] = player;
  squares[outerIdx] = board;

  const localWinners = game.localWinners.slice();
  localWinners[outerIdx] = getBoardResult(board);

  const winner = calculateWinner(localWinners);
  const draw = !winner && localWinners.every((r) => r !== null);
  const activeBoard = localWinners[innerIdx] === null ? innerIdx : null;

  return {
    squares,
    localWinners,
    activeBoard,
    xIsNext: !game.xIsNext,
    winner,
    draw,
  };
}

/** Gera uma grelha 3x3 de elementos: <div class="{className}"> com 3 <div class="{className}-row">. */
export default function generate3x3(className, generatorFunction) {
  const rows = [];
  for (let i = 0; i < 3; i++) {
    const cols = [];
    for (let j = 0; j < 3; j++) {
      cols.push(generatorFunction(i * 3 + j));
    }
    rows.push(
      <div className={`${className}-row`} key={i}>
        {cols}
      </div>
    );
  }
  return <div className={className}>{rows}</div>;
}
