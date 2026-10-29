import React from 'react';

/**
 * Uma casa de um tabuleiro pequeno.
 *  - value:  'X', 'O' ou null
 *  - result: resultado do tabuleiro a que a casa pertence ('X', 'O', 'D' = empate, ou null)
 *  - active: true se o jogador da vez pode jogar neste tabuleiro
 */
export default function Square({ value, result, active, onClick }) {
  const classes = ['square'];
  if (value === 'X') classes.push('x');
  if (value === 'O') classes.push('o');
  if (result === 'X') classes.push('won-x');
  if (result === 'O') classes.push('won-o');
  if (result === 'D') classes.push('draw');
  if (active) classes.push('next-move');

  return (
    <button type="button" className={classes.join(' ')} onClick={onClick}>
      {value}
    </button>
  );
}
