import {
  calculateWinner,
  canPlay,
  createInitialGame,
  getBoardResult,
  isBoardActive,
  playMove,
} from './gameLogic.js';

// Aplica uma jogada e falha o teste se for inválida.
function play(game, outer, inner) {
  const next = playMove(game, outer, inner);
  expect(next).not.toBeNull();
  return { ...game, ...next };
}

// Tabuleiro cheio sem vencedor.
const DRAWN = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

describe('calculateWinner / getBoardResult', () => {
  test('deteta as 8 linhas possíveis', () => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const line of lines) {
      const cells = Array(9).fill(null);
      line.forEach((i) => (cells[i] = 'O'));
      expect(calculateWinner(cells)).toBe('O');
    }
  });

  test('três empates ("D") seguidos não contam como vitória', () => {
    expect(calculateWinner(['D', 'D', 'D', null, null, null, null, null, null])).toBeNull();
  });

  test('tabuleiro cheio sem linha é empate', () => {
    expect(calculateWinner(DRAWN)).toBeNull();
    expect(getBoardResult(DRAWN)).toBe('D');
  });

  test('tabuleiro por acabar devolve null', () => {
    expect(getBoardResult(['X', null, null, null, 'O', null, null, null, null])).toBeNull();
  });
});

describe('regras do jogo', () => {
  test('na primeira jogada pode jogar-se em qualquer tabuleiro', () => {
    const g = createInitialGame();
    for (let i = 0; i < 9; i++) expect(isBoardActive(g, i)).toBe(true);
  });

  test('a casa jogada decide o tabuleiro do adversário', () => {
    let g = createInitialGame();
    g = play(g, 0, 5); // X joga na casa 5 do tabuleiro 0
    expect(g.activeBoard).toBe(5);
    expect(g.xIsNext).toBe(false);
    expect(canPlay(g, 5, 0)).toBe(true);
    expect(canPlay(g, 4, 0)).toBe(false);
    expect(playMove(g, 4, 0)).toBeNull();
  });

  test('não se pode jogar numa casa ocupada', () => {
    let g = createInitialGame();
    g = play(g, 0, 0); // o adversário tem de jogar no tabuleiro 0
    expect(canPlay(g, 0, 0)).toBe(false); // casa já ocupada
    expect(playMove(g, 0, 0)).toBeNull();
    expect(canPlay(g, 0, 1)).toBe(true); // casa livre
  });

  test('o jogador alterna entre X e O', () => {
    let g = createInitialGame(true);
    g = play(g, 0, 0);
    expect(g.squares[0][0]).toBe('X');
    expect(g.xIsNext).toBe(false);
    g = play(g, 0, 1);
    expect(g.squares[0][1]).toBe('O');
    expect(g.xIsNext).toBe(true);
  });

  test('o estado anterior não é alterado (imutabilidade)', () => {
    const g = createInitialGame();
    playMove(g, 0, 0);
    expect(g.squares[0][0]).toBeNull();
    expect(g.xIsNext).toBe(true);
  });

  test('ganhar um tabuleiro pequeno marca-o', () => {
    let g = createInitialGame();
    g.squares[0] = ['X', 'X', null, null, 'O', null, null, 'O', null];
    g.activeBoard = 0;
    g = play(g, 0, 2); // X completa a linha 0-1-2
    expect(g.localWinners[0]).toBe('X');
    expect(g.winner).toBeNull();
  });

  test('enviar o adversário para um tabuleiro ganho dá jogada livre', () => {
    let g = createInitialGame();
    g.localWinners[4] = 'X';
    g = play(g, 0, 4); // aponta para o tabuleiro 4, que já está ganho
    expect(g.activeBoard).toBeNull();
    expect(isBoardActive(g, 4)).toBe(false); // tabuleiro ganho nunca é jogável
    expect(isBoardActive(g, 0)).toBe(true);
    expect(canPlay(g, 4, 0)).toBe(false);
  });

  test('enviar o adversário para um tabuleiro empatado dá jogada livre', () => {
    let g = createInitialGame();
    g.squares[4] = DRAWN.slice();
    g.localWinners[4] = 'D';
    g = play(g, 0, 4);
    expect(g.activeBoard).toBeNull();
    expect(isBoardActive(g, 4)).toBe(false);
  });

  test('a última casa de um tabuleiro sem vencedor marca-o como empate', () => {
    let g = createInitialGame(true);
    g.squares[8] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    g.activeBoard = 8;
    g = play(g, 8, 8);
    expect(g.localWinners[8]).toBe('D');
  });

  test('ganhar 3 tabuleiros em linha ganha o jogo e bloqueia novas jogadas', () => {
    let g = createInitialGame(true);
    g.localWinners[0] = 'X';
    g.localWinners[1] = 'X';
    g.squares[2] = ['X', 'X', null, null, 'O', null, null, 'O', null];
    g.activeBoard = 2;
    g = play(g, 2, 2);
    expect(g.localWinners[2]).toBe('X');
    expect(g.winner).toBe('X');
    expect(g.draw).toBe(false);
    for (let i = 0; i < 9; i++) expect(isBoardActive(g, i)).toBe(false);
    expect(playMove(g, 5, 0)).toBeNull();
  });

  test('empate global quando todos os tabuleiros terminam sem linha', () => {
    let g = createInitialGame(true);
    g.localWinners = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    g.squares[8] = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', null];
    g.activeBoard = 8;
    g = play(g, 8, 8);
    expect(g.localWinners[8]).toBe('D');
    expect(g.winner).toBeNull();
    expect(g.draw).toBe(true);
    expect(playMove(g, 0, 0)).toBeNull();
  });
});
