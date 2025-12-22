const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: true, // Allow all origins in development
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store active game rooms
const gameRooms = new Map();

// Generate a random 6-character room code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Make sure code doesn't already exist
  if (gameRooms.has(code)) {
    return generateRoomCode();
  }
  return code;
}

// Initialize a new game state
function createGameState() {
  const suits = ['coppe', 'denari', 'spade', 'bastoni'];
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // 1=Ace, 8=Jack, 9=Knight, 10=King
  
  // Create deck
  let deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  
  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  
  // Deal 3 cards to each player
  const player1Hand = deck.splice(0, 3);
  const player2Hand = deck.splice(0, 3);
  
  // Set trump card (bottom of deck)
  const trumpCard = deck[deck.length - 1];
  
  return {
    deck,
    trumpCard,
    player1Hand,
    player2Hand,
    player1Score: 0,
    player2Score: 0,
    currentTrick: [],
    currentPlayer: 1,
    lastTrickWinner: null,
    gameOver: false
  };
}

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Create a new room
  socket.on('createRoom', () => {
    const roomCode = generateRoomCode();
    const gameState = createGameState();
    
    gameRooms.set(roomCode, {
      player1: socket.id,
      player2: null,
      gameState,
      player1Name: 'Player 1',
      player2Name: 'Player 2'
    });
    
    socket.join(roomCode);
    socket.emit('roomCreated', { roomCode, playerNumber: 1 });
    console.log(`Room created: ${roomCode}`);
  });

  // Join an existing room
  socket.on('joinRoom', (roomCode) => {
    const room = gameRooms.get(roomCode);
    
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }
    
    if (room.player2) {
      socket.emit('error', 'Room is full');
      return;
    }
    
    room.player2 = socket.id;
    socket.join(roomCode);
    
    socket.emit('roomJoined', { roomCode, playerNumber: 2 });
    
    // Notify both players that the game is starting
    io.to(roomCode).emit('gameStart', {
      player1Name: room.player1Name,
      player2Name: room.player2Name
    });
    
    // Send initial game state to both players
    sendGameStateToPlayers(roomCode);
    
    console.log(`Player joined room: ${roomCode}`);
  });

  // Handle card play
  socket.on('playCard', ({ roomCode, card }) => {
    const room = gameRooms.get(roomCode);
    if (!room) return;
    
    const playerNumber = room.player1 === socket.id ? 1 : 2;
    const gameState = room.gameState;
    
    // Validate it's this player's turn
    if (gameState.currentPlayer !== playerNumber) {
      socket.emit('error', 'Not your turn');
      return;
    }
    
    // Add card to current trick
    gameState.currentTrick.push({ card, player: playerNumber });
    
    // Remove card from player's hand
    const hand = playerNumber === 1 ? gameState.player1Hand : gameState.player2Hand;
    const cardIndex = hand.findIndex(c => c.suit === card.suit && c.value === card.value);
    if (cardIndex !== -1) {
      hand.splice(cardIndex, 1);
    }
    
    // Check if trick is complete
    if (gameState.currentTrick.length === 2) {
      // Determine winner and award points
      const winner = determineTrickWinner(gameState.currentTrick, gameState.trumpCard.suit);
      const points = calculateTrickPoints(gameState.currentTrick);
      
      if (winner === 1) {
        gameState.player1Score += points;
      } else {
        gameState.player2Score += points;
      }
      
      gameState.lastTrickWinner = winner;
      gameState.currentPlayer = winner;
      
      // Draw cards if deck has cards
      if (gameState.deck.length > 0) {
        // Winner draws first
        if (winner === 1) {
          gameState.player1Hand.push(gameState.deck.shift());
          if (gameState.deck.length > 0) {
            gameState.player2Hand.push(gameState.deck.shift());
          }
        } else {
          gameState.player2Hand.push(gameState.deck.shift());
          if (gameState.deck.length > 0) {
            gameState.player1Hand.push(gameState.deck.shift());
          }
        }
      }
      
      // Clear trick after a delay
      setTimeout(() => {
        gameState.currentTrick = [];
        
        // Check if game is over
        if (gameState.player1Hand.length === 0 && gameState.player2Hand.length === 0) {
          gameState.gameOver = true;
        }
        
        sendGameStateToPlayers(roomCode);
      }, 2000);
    } else {
      // Switch to other player
      gameState.currentPlayer = playerNumber === 1 ? 2 : 1;
    }
    
    sendGameStateToPlayers(roomCode);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    
    // Remove from any rooms
    for (let [roomCode, room] of gameRooms.entries()) {
      if (room.player1 === socket.id || room.player2 === socket.id) {
        io.to(roomCode).emit('playerDisconnected');
        gameRooms.delete(roomCode);
      }
    }
  });
});

// Send game state to players (each gets their own hand only)
function sendGameStateToPlayers(roomCode) {
  const room = gameRooms.get(roomCode);
  if (!room) return;
  
  const { gameState, player1, player2 } = room;
  
  // Send to player 1
  io.to(player1).emit('gameState', {
    myHand: gameState.player1Hand,
    opponentHandSize: gameState.player2Hand.length,
    myScore: gameState.player1Score,
    opponentScore: gameState.player2Score,
    trumpCard: gameState.trumpCard,
    deckSize: gameState.deck.length,
    currentTrick: gameState.currentTrick,
    isMyTurn: gameState.currentPlayer === 1,
    gameOver: gameState.gameOver,
    playerNumber: 1
  });
  
  // Send to player 2
  io.to(player2).emit('gameState', {
    myHand: gameState.player2Hand,
    opponentHandSize: gameState.player1Hand.length,
    myScore: gameState.player2Score,
    opponentScore: gameState.player1Score,
    trumpCard: gameState.trumpCard,
    deckSize: gameState.deck.length,
    currentTrick: gameState.currentTrick,
    isMyTurn: gameState.currentPlayer === 2,
    gameOver: gameState.gameOver,
    playerNumber: 2
  });
}

// Determine who won the trick
function determineTrickWinner(trick, trumpSuit) {
  const [first, second] = trick;
  
  // If second card is trump and first isn't, second wins
  if (second.card.suit === trumpSuit && first.card.suit !== trumpSuit) {
    return second.player;
  }
  
  // If first card is trump and second isn't, first wins
  if (first.card.suit === trumpSuit && second.card.suit !== trumpSuit) {
    return first.player;
  }
  
  // If both trump or both same suit, higher value wins
  if (first.card.suit === second.card.suit) {
    return getCardStrength(first.card) > getCardStrength(second.card) ? first.player : second.player;
  }
  
  // Different suits, no trump - first card wins
  return first.player;
}

// Get card strength for comparison
function getCardStrength(card) {
  const strengths = {
    1: 11,  // Ace
    3: 10,  // Three
    10: 4,  // King
    9: 3,   // Knight
    8: 2,   // Jack
    7: 0,
    6: 0,
    5: 0,
    4: 0,
    2: 0
  };
  return strengths[card.value] || 0;
}

// Calculate points in a trick
function calculateTrickPoints(trick) {
  const pointValues = {
    1: 11,  // Ace
    3: 10,  // Three
    10: 4,  // King
    9: 3,   // Knight
    8: 2,   // Jack
    7: 0,
    6: 0,
    5: 0,
    4: 0,
    2: 0
  };
  
  return trick.reduce((sum, { card }) => sum + (pointValues[card.value] || 0), 0);
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
