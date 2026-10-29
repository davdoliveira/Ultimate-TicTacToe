import React from 'react';
import Square from './Square.js';
import generate3x3 from './gameLogic.js';

/** Um tabuleiro pequeno (3x3). */
export default function Board({ squares, result, active, onClick }) {
  return generate3x3('board', (i) => (
    <Square
      key={i}
      value={squares[i]}
      result={result}
      active={active}
      onClick={() => onClick(i)}
    />
  ));
}
