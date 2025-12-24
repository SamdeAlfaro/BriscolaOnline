import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Card from './Card';
import './Game.css';

const Game = () => {
  const [gameState, setGameState] = useState('menu');
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [playerNumber, setPlayerNumber] = useState(null);
  const [error, setError] = useState('');
  
  // Phase states
  const [phase, setPhase] = useState('waiting');
  const [diceRolling, setDiceRolling] = useState(false);
  const [dice1, setDice1] = useState(1);
  const [dice2, setDice2] = useState(1);
  const [diceMessage, setDiceMessage] = useState('');
  const [shuffling, setShuffling] = useState(false);
  const [cutting, setCutting] = useState(false);
  const [canCut, setCanCut] = useState(false);
  const [cutPosition, setCutPosition] = useState(50);
  const [cutAnimating, setCutAnimating] = useState(false);
  
  // Game state
  const [myHand, setMyHand] = useState([]);
  const [opponentHandSize, setOpponentHandSize] = useState(0);
  const [trumpCard, setTrumpCard] = useState(null);
  const [deckSize, setDeckSize] = useState(0);
  const [currentTrick, setCurrentTrick] = useState([]);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [lastTrickWinner, setLastTrickWinner] = useState(null);
  
  // Animation states
  const [trickWinnerMessage, setTrickWinnerMessage] = useState('');
  const [showTrickWinner, setShowTrickWinner] = useState(false);
  const [animatingCardDraw, setAnimatingCardDraw] = useState(false);
  const [drawnCard, setDrawnCard] = useState(null);
  
  // Counting animation states
  const [counting, setCounting] = useState(false);
  const [myPile, setMyPile] = useState([]);
  const [opponentPile, setOpponentPile] = useState([]);
  const [currentCountIndex, setCurrentCountIndex] = useState(0);
  const [myCountedScore, setMyCountedScore] = useState(0);
  const [opponentCountedScore, setOpponentCountedScore] = useState(0);
  const [finalWinner, setFinalWinner] = useState('');

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

    socket.on('playerNumberUpdate', ({ playerNumber }) => {
      setPlayerNumber(playerNumber);
    });

    socket.on('startDiceRoll', () => {
      setGameState('diceRoll');
      setDiceRolling(true);
      
      // Animate dice rolling
      const interval = setInterval(() => {
        setDice1(Math.floor(Math.random() * 6) + 1);
        setDice2(Math.floor(Math.random() * 6) + 1);
      }, 100);
      
      // Store interval so we can clear it when real values arrive
      window.diceInterval = interval;
    });

    socket.on('diceRolled', ({ dice1, dice2, dealer, message }) => {
      // Stop the animation immediately
      if (window.diceInterval) {
        clearInterval(window.diceInterval);
        window.diceInterval = null;
      }
      
      // Set the actual rolled values
      setDice1(dice1);
      setDice2(dice2);
      setDiceMessage(message);
      setDiceRolling(false);
    });

    socket.on('startShuffle', () => {
      setGameState('shuffling');
      setShuffling(true);
    });

    socket.on('yourTurnToCut', () => {
      setShuffling(false);
      setGameState('cutting');
      setCutting(true);
      setCanCut(true);
      
      // Animate cut line moving - smoother bounce
      let position = 50; // Start in middle
      let direction = 1;
      const interval = setInterval(() => {
        position += direction * 1; // Slower movement
        if (position >= 85) {
          position = 85;
          direction = -1;
        } else if (position <= 15) {
          position = 15;
          direction = 1;
        }
        setCutPosition(position);
      }, 30); // Faster updates for smoother animation
      
      // Store interval to clear it later
      window.cutInterval = interval;
    });

    socket.on('opponentCutting', () => {
      setShuffling(false);
      setGameState('cutting');
      setCutting(true);
      setCanCut(false);
    });

    socket.on('deckCut', ({ cutPosition }) => {
      if (window.cutInterval) {
        clearInterval(window.cutInterval);
      }
      setCutPosition(cutPosition);
      setCutAnimating(true);
      
      setTimeout(() => {
        setCutAnimating(false);
        setCutting(false);
      }, 1000);
    });

    socket.on('startDealing', () => {
      setGameState('dealing');
    });

    socket.on('gameStart', () => {
      setGameState('playing');
      setPhase('playing');
    });

    socket.on('gameState', (state) => {
      setMyHand(state.myHand);
      setOpponentHandSize(state.opponentHandSize);
      setTrumpCard(state.trumpCard);
      setDeckSize(state.deckSize);
      setCurrentTrick(state.currentTrick);
      setIsMyTurn(state.isMyTurn);
      setGameOver(state.gameOver);
      setPhase(state.phase || 'playing');
      setLastTrickWinner(state.lastTrickWinner);
    });

    socket.on('trickComplete', ({ winner, points }) => {
      const didIWin = winner === playerNumber;
      setTrickWinnerMessage(
        didIWin 
          ? `You won! +${points} ${points === 1 ? 'point' : 'points'}` 
          : `Opponent won. +${points} ${points === 1 ? 'point' : 'points'}`
      );
      setShowTrickWinner(true);
      
      setTimeout(() => {
        setShowTrickWinner(false);
      }, 2500);
    });

    socket.on('drawCard', ({ card, fromDeck }) => {
      setAnimatingCardDraw(true);
      setDrawnCard(card);
      
      setTimeout(() => {
        setAnimatingCardDraw(false);
        setDrawnCard(null);
      }, 800);
    });

    socket.on('opponentDrawCard', () => {
      // Just visual feedback that opponent is drawing
    });

    socket.on('startCounting', ({ player1Pile, player2Pile }) => {
      const pile = playerNumber === 1 ? player1Pile : player2Pile;
      const oppPile = playerNumber === 1 ? player2Pile : player1Pile;
      
      setMyPile(pile);
      setOpponentPile(oppPile);
      setCounting(true);
      setGameState('counting');
      setCurrentCountIndex(0);
      setMyCountedScore(0);
      setOpponentCountedScore(0);
    });

    socket.on('error', (message) => {
      setError(message);
    });

    socket.on('playerDisconnected', () => {
      alert('Other player disconnected');
      window.location.reload();
    });

    return () => {
      // Clean up intervals
      if (window.diceInterval) {
        clearInterval(window.diceInterval);
      }
      if (window.cutInterval) {
        clearInterval(window.cutInterval);
      }
      
      socket.off('roomCreated');
      socket.off('roomJoined');
      socket.off('playerNumberUpdate');
      socket.off('startDiceRoll');
      socket.off('diceRolled');
      socket.off('startShuffle');
      socket.off('yourTurnToCut');
      socket.off('opponentCutting');
      socket.off('deckCut');
      socket.off('startDealing');
      socket.off('gameStart');
      socket.off('gameState');
      socket.off('trickComplete');
      socket.off('drawCard');
      socket.off('opponentDrawCard');
      socket.off('startCounting');
      socket.off('error');
      socket.off('playerDisconnected');
    };
  }, [playerNumber]);

  // Counting animation effect
  useEffect(() => {
    if (!counting || currentCountIndex >= Math.max(myPile.length, opponentPile.length)) {
      if (counting && currentCountIndex >= Math.max(myPile.length, opponentPile.length)) {
        // Finished counting, determine winner
        setTimeout(() => {
          if (myCountedScore > opponentCountedScore) {
            setFinalWinner('You Win! 🎉');
          } else if (myCountedScore < opponentCountedScore) {
            setFinalWinner('You Lose 😔');
          } else {
            setFinalWinner('Draw! 🤝');
          }
          
          setTimeout(() => {
            setGameState('gameOver');
          }, 2000);
        }, 1000);
      }
      return;
    }

    const timer = setTimeout(() => {
      // Add points for current cards
      if (currentCountIndex < myPile.length) {
        const card = myPile[currentCountIndex];
        const points = getCardPoints(card);
        setMyCountedScore(prev => prev + points);
      }
      
      if (currentCountIndex < opponentPile.length) {
        const card = opponentPile[currentCountIndex];
        const points = getCardPoints(card);
        setOpponentCountedScore(prev => prev + points);
      }
      
      setCurrentCountIndex(prev => prev + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [counting, currentCountIndex, myPile, opponentPile, myCountedScore, opponentCountedScore]);

  // FIXED: Correct point values for Italian cards
  // 1=Asso(Ace), 3=Tre(Three), 10=Re(King), 9=Cavallo(Queen/Knight), 8=Fante(Jack)
  const getCardPoints = (card) => {
    const pointValues = {
      1: 11,   // Asso (Ace): 11 points
      3: 10,   // Tre (Three): 10 points
      10: 4,   // Re (King): 4 points
      9: 3,    // Cavallo (Queen/Knight): 3 points
      8: 2,    // Fante (Jack): 2 points
      7: 0,
      6: 0,
      5: 0,
      4: 0,
      2: 0
    };
    return pointValues[card.value] || 0;
  };

  const createRoom = () => {
    socket.emit('createRoom');
  };

  const joinRoom = () => {
    if (inputCode.trim()) {
      socket.emit('joinRoom', inputCode.toUpperCase());
    }
  };

  const handleCut = () => {
    if (canCut && !cutAnimating) {
      if (window.cutInterval) {
        clearInterval(window.cutInterval);
      }
      socket.emit('cutDeck', { roomCode, cutPosition });
      setCanCut(false);
    }
  };

  const playCard = (card) => {
    if (isMyTurn && !gameOver && phase === 'playing') {
      socket.emit('playCard', { roomCode, card });
    }
  };

  const cancelRoom = () => {
    socket.disconnect();
    window.location.reload();
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
        <button onClick={cancelRoom} className="btn-cancel">
          Cancel Room
        </button>
      </div>
    );
  }

  if (gameState === 'diceRoll') {
    return (
      <div className="dice-roll-screen">
        <h1>Rolling dice to determine dealer...</h1>
        <div className="dice-container">
          <div className={`dice ${diceRolling ? 'rolling' : ''}`}>
            <div className="dice-face">{dice1}</div>
          </div>
          <div className={`dice ${diceRolling ? 'rolling' : ''}`}>
            <div className="dice-face">{dice2}</div>
          </div>
        </div>
        {diceMessage && (
          <div className="dice-message">{diceMessage}</div>
        )}
      </div>
    );
  }

  if (gameState === 'shuffling') {
    return (
      <div className="shuffle-screen">
        <h1>Shuffling deck...</h1>
        <div className="shuffle-animation">
          <div className="deck-shuffle">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="shuffle-card" style={{ animationDelay: `${i * 0.1}s` }}>
                🂠
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cutting) {
    return (
      <div className="cutting-screen">
        <h1>{canCut ? 'Cut the deck!' : 'Opponent is cutting the deck...'}</h1>
        <div className="cut-container">
          <div className="deck-to-cut">
            <div className="deck-visual">
              {[...Array(40)].map((_, i) => (
                <div 
                  key={i} 
                  className="stacked-card"
                  style={{ 
                    top: `${i * 0.5}px`,
                    left: `${i * 0.3}px`
                  }}
                />
              ))}
            </div>
            <div 
              className={`cut-line ${cutAnimating ? 'cutting' : ''}`}
              style={{ left: `${cutPosition}%` }}
            />
          </div>
          {canCut && (
            <button onClick={handleCut} className="cut-button">
              CUT HERE!
            </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'dealing') {
    return (
      <div className="dealing-screen">
        <h1>Dealing cards...</h1>
        <div className="dealing-animation">
          <div className="dealer-deck">🂠</div>
        </div>
      </div>
    );
  }

  if (gameState === 'counting') {
    return (
      <div className="counting-screen">
        <h1>Counting Points...</h1>
        <div className="counting-container">
          <div className="counting-section">
            <h2>Your Cards</h2>
            <div className="counting-score">{myCountedScore}</div>
            <div className="cards-display">
              {myPile.slice(0, currentCountIndex).map((card, i) => (
                <div key={i} className="counted-card">
                  <Card card={card} disabled={true} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="counting-section">
            <h2>Opponent's Cards</h2>
            <div className="counting-score">{opponentCountedScore}</div>
            <div className="cards-display">
              {opponentPile.slice(0, currentCountIndex).map((card, i) => (
                <div key={i} className="counted-card">
                  <Card card={card} disabled={true} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {finalWinner && (
          <div className="final-winner-announcement">
            <h1>{finalWinner}</h1>
            <p>Final Score: {myCountedScore} - {opponentCountedScore}</p>
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="game-over-screen">
        <div className="game-over">
          <h2>{finalWinner}</h2>
          <p className="final-score">Final Score: You {myCountedScore} - {opponentCountedScore} Opponent</p>
          <button onClick={() => window.location.reload()}>New Game</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game-header">
        <div className="room-info">Room: {roomCode}</div>
      </div>

      {showTrickWinner && (
        <div className="trick-winner-overlay">
          <div className="trick-winner-message">
            {trickWinnerMessage}
          </div>
        </div>
      )}

      <div className="game-board">
        <div className="opponent-area">
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
        </div>

        <div className="play-area">
          <div className="deck-area">
            <div className="deck-stack">
              {deckSize > 0 && (
                <>
                  <div className="deck-pile">
                    {[...Array(Math.min(deckSize, 10))].map((_, i) => (
                      <div 
                        key={i} 
                        className="deck-card"
                        style={{ 
                          top: `-${i * 2}px`,
                          left: `${i * 0.5}px`
                        }}
                      >
                        <Card 
                          card={{ suit: 'coppe', value: 1 }} 
                          showBack={true} 
                          disabled={true}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="deck-count">{deckSize}</div>
                </>
              )}
            </div>
            
            {trumpCard && deckSize > 0 && (
              <div className="trump-card-holder">
                <Card card={trumpCard} disabled={true} />
              </div>
            )}
          </div>

          <div className="current-trick">
            {currentTrick.length > 0 && (
              <>
                <div className={`trick-card ${currentTrick[0].player === playerNumber ? 'my-card' : 'opponent-card'}`}>
                  <Card card={currentTrick[0].card} disabled={true} />
                </div>
                {currentTrick.length === 2 && (
                  <div className={`trick-card ${currentTrick[1].player === playerNumber ? 'my-card' : 'opponent-card'}`}>
                    <Card card={currentTrick[1].card} disabled={true} />
                  </div>
                )}
              </>
            )}
          </div>

          {isMyTurn && !gameOver && phase === 'playing' && (
            <div className="turn-indicator">Your Turn!</div>
          )}
          
          {animatingCardDraw && drawnCard && (
            <div className="card-draw-animation">
              <Card card={drawnCard} disabled={true} />
            </div>
          )}
        </div>

        <div className="player-area">
          <div className="my-hand">
            {myHand.map((card, index) => (
              <Card
                key={`${card.suit}-${card.value}-${index}`}
                card={card}
                onClick={() => playCard(card)}
                disabled={!isMyTurn || gameOver || phase !== 'playing'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;