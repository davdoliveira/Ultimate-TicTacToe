import React from 'react';
import Board from './Board.js';
import generate3x3, {
  createInitialGame,
  isBoardActive,
  playMove,
} from './gameLogic.js';

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...createInitialGame(),
      player1Name: '',
      player2Name: '',
      gameStarted: false,
    };

    this.renderBoard = this.renderBoard.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleRestartClick = this.handleRestartClick.bind(this);
    this.handlePlayerNameChange = this.handlePlayerNameChange.bind(this);
  }

  /** Nome do jogador que joga com o símbolo dado (Jogador 1 = X, Jogador 2 = O). */
  getPlayerName(symbol) {
    const raw = symbol === 'X' ? this.state.player1Name : this.state.player2Name;
    return raw.trim() || (symbol === 'X' ? 'Jogador 1' : 'Jogador 2');
  }

  handleStartClick(event) {
    if (event) event.preventDefault();
    // Sorteia quem começa.
    this.setState({
      ...createInitialGame(Math.random() < 0.5),
      gameStarted: true,
    });
  }

  handleRestartClick() {
    this.setState({
      ...createInitialGame(),
      player1Name: '',
      player2Name: '',
      gameStarted: false,
    });
  }

  handlePlayerNameChange(event, playerNumber) {
    const value = event.target.value;
    if (playerNumber === 1) {
      this.setState({ player1Name: value });
    } else {
      this.setState({ player2Name: value });
    }
  }

  handleClick(outerIdx, innerIdx) {
    // Se a jogada for inválida, playMove devolve null e o estado não muda.
    this.setState((prev) => playMove(prev, outerIdx, innerIdx));
  }

  renderBoard(i) {
    return (
      <Board
        key={i}
        squares={this.state.squares[i]}
        result={this.state.localWinners[i]}
        active={isBoardActive(this.state, i)}
        onClick={(p) => this.handleClick(i, p)}
      />
    );
  }

  render() {
    const { winner, draw, xIsNext, activeBoard, gameStarted } = this.state;

    let status;
    let hint = null;
    if (winner) {
      status = `${this.getPlayerName(winner)} ganhou!`;
    } else if (draw) {
      status = 'Empate!';
    } else {
      const symbol = xIsNext ? 'X' : 'O';
      status = `Jogador seguinte: ${this.getPlayerName(symbol)} (${symbol})`;
      hint =
        activeBoard === null
          ? 'Jogada livre: escolhe qualquer tabuleiro destacado.'
          : 'Joga no tabuleiro destacado.';
    }

    return (
      <div className="game-container">
        {!gameStarted && (
          <form className="player-names" onSubmit={this.handleStartClick}>
            <input
              type="text"
              maxLength={20}
              aria-label="Nome do Jogador 1"
              value={this.state.player1Name}
              onChange={(e) => this.handlePlayerNameChange(e, 1)}
              placeholder="Jogador 1"
            />
            <input
              type="text"
              maxLength={20}
              aria-label="Nome do Jogador 2"
              value={this.state.player2Name}
              onChange={(e) => this.handlePlayerNameChange(e, 2)}
              placeholder="Jogador 2"
            />
            <button type="submit" className="btn">
              Começar jogo
            </button>
          </form>
        )}
        {gameStarted && (
          <>
            {generate3x3('game', this.renderBoard)}
            <div className="game-info">
              <div className="status" aria-live="polite">
                {status}
              </div>
              {hint && <div className="hint">{hint}</div>}
              <button type="button" className="btn" onClick={this.handleRestartClick}>
                Recomeçar
              </button>
            </div>
          </>
        )}
      </div>
    );
  }
}
