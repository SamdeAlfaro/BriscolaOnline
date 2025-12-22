import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Card from './Card';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState('menu'); // menu, waiting, playing
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [playerNumber, setPlayerNumber] = useState(null);
  const [error, setError] = useState('');
  
  // Game state
  const [myHand, setMyHand] = useState([]);
  const [opponentHandSize, setOpponentHandSize] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [trumpCard, setTrumpCard] = useState(null);
  const [deckSize, setDeckSize] = useState(0);
  const [currentTrick, setCurrentTrick] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('roomCreated', ({ roomCode, playerNumber }) => {
      setRoomCode(roomCode);
      setPlayerNumber(playerNumber);
      setGameState('waiting');
      setError('');
    });

    socket.on('roomJoined', ({ roomCode, playerNumber }) => {
      setRoomCode(roomCode);
      setPlayerNumber(playerNumber);
      setError('');
    });

    socket.on('gameStart', () => {
      setGameState('playing');
    });

    socket.on('gameState', (state) => {
      setMyHand(state.myHand);
      setOpponentHandSize(state.opponentHandSize);
      setMyScore(state.myScore);
      setOpponentScore(state.opponentScore);
      setTrumpCard(state.trumpCard);
      setDeckSize(state.deckSize);
      setCurrentTrick(state.currentTrick);
      setIsMyTurn(state.isMyTurn);
      setGameOver(state.gameOver);
    });

    socket.on('error', (message) => {
      setError(message);
    });

    socket.on('playerDisconnected', () => {
      alert('Other player disconnected');
      window.location.reload();
    });

    return () => {
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('gameStart');
      socket.off('gameState');
      socket.off('error');
      socket.off('playerDisconnected');
    };
  }, []);

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (inputCode.trim()) {
      socket.emit('joinRoom', inputCode.toUpperCase());
    }
  };

  const playCard = (card) => {
    if (isMyTurn && !gameOver) {
      socket.emit('playCard', { roomCode, card });
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="menu">
        <h1>Briscola Online</h1>
        <div className="menu-buttons">
          <button onClick={createRoom} className="btn-primary">
            Create Room
          </button>
          <div className="join-room">
            <input
              type="text"
              placeholder="Enter room code"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button onClick={joinRoom} className="btn-secondary">
              Join Room
            </button>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    );
  }

  if (gameState === 'waiting') {
    return (
      <div className="waiting">
        <h1>Waiting for opponent...</h1>
        <div className="room-code-display">
          <p>Room Code:</p>
          <h2>{roomCode}</h2>
          <p className="room-code-instruction">Share this code with your friend!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-header">
        <div className="score">
          <h3>You: {myScore}</h3>
          <h3>Opponent: {opponentScore}</h3>
        </div>
        <div className="room-info">Room: {roomCode}</div>
      </div>

      <div className="game-board">
        {/* Opponent's hand (back of cards) */}
        <div className="opponent-hand">
          {Array(opponentHandSize).fill(0).map((_, i) => (
            <Card 
              key={i} 
              card={{ suit: 'coppe', value: 1 }} 
              showBack={true} 
              disabled={true}
            />
          ))}
        </div>

        {/* Playing area */}
        <div className="play-area">
          <div className="trump-info">
            <div className="trump-label">Trump:</div>
            {trumpCard && (
              <Card card={trumpCard} disabled={true} />
            )}
            <div className="deck-info">Deck: {deckSize}</div>
          </div>

          <div className="current-trick">
            {currentTrick.length > 0 && (
              <>
                <div className="trick-card">
                  <Card card={currentTrick[0].card} disabled={true} />
                  <div className="trick-label">
                    {currentTrick[0].player === playerNumber ? 'You' : 'Opponent'}
                  </div>
                </div>
                {currentTrick.length === 2 && (
                  <div className="trick-card">
                    <Card card={currentTrick[1].card} disabled={true} />
                    <div className="trick-label">
                      {currentTrick[1].player === playerNumber ? 'You' : 'Opponent'}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {isMyTurn && !gameOver && (
            <div className="turn-indicator">Your Turn!</div>
          )}
          {gameOver && (
            <div className="game-over">
              <h2>Game Over!</h2>
              <p>{myScore > opponentScore ? 'You Win!' : myScore < opponentScore ? 'You Lose!' : 'Tie!'}</p>
              <button onClick={() => window.location.reload()}>New Game</button>
            </div>
          )}
        </div>

        {/* Player's hand */}
        <div className="my-hand">
          {myHand.map((card, index) => (
            <Card
              key={index}
              card={card}
              onClick={() => playCard(card)}
              disabled={!isMyTurn || gameOver}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Game;
