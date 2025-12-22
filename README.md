# Briscola Online

A real-time multiplayer Briscola card game built with React and Socket.io.

## Features

- Simple room-based matchmaking with 6-character codes
- Real-time gameplay using WebSockets
- Full Briscola rules implementation
- Clean, responsive UI

## Project Structure

```
briscola-game/
├── server/          # Node.js + Socket.io backend
│   ├── server.js    # Main server file with game logic
│   └── package.json
└── client/          # React frontend
    ├── src/
    │   ├── Game.js       # Main game component
    │   ├── Card.js       # Card display component
    │   ├── socket.js     # Socket.io connection
    │   └── ...
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. **Install server dependencies:**
```bash
cd server
npm install
```

2. **Install client dependencies:**
```bash
cd ../client
npm install
```

### Running the Game

You need to run both the server and client:

1. **Start the server (Terminal 1):**
```bash
cd server
npm start
```
Server will run on `http://localhost:3001`

2. **Start the client (Terminal 2):**
```bash
cd client
npm start
```
Client will open in browser at `http://localhost:3000`

## How to Play

1. **Player 1:**
   - Click "Create Room"
   - Share the 6-character room code with your friend

2. **Player 2:**
   - Enter the room code
   - Click "Join Room"

3. **Gameplay:**
   - Each player starts with 3 cards
   - Players take turns playing one card
   - The highest card of the leading suit wins the trick (unless trump is played)
   - Trump suit beats all other suits
   - Winner of each trick leads the next trick
   - After each trick, players draw from the deck (winner draws first)
   - Game ends when all cards are played
   - Player with the most points wins!

## Briscola Scoring

- Ace (1): 11 points
- Three (3): 10 points
- King (10): 4 points
- Knight (9): 3 points
- Jack (8): 2 points
- All other cards: 0 points

Total points in deck: 120
To win: Score more than 60 points

## Tech Stack

**Frontend:**
- React
- Socket.io-client
- CSS3

**Backend:**
- Node.js
- Express
- Socket.io

## Development

### Server Development
```bash
cd server
npm run dev  # Uses nodemon for auto-restart
```

### Modifying Game Rules

Game logic is in `server/server.js`:
- `createGameState()`: Initial game setup
- `determineTrickWinner()`: Trick winning logic
- `calculateTrickPoints()`: Point calculation
- `getCardStrength()`: Card ranking

## Deployment

### Deploy Server
- Railway, Render, or fly.io (free tiers available)
- Set PORT environment variable
- Update CORS origins

### Deploy Client
- Vercel or Netlify
- Update `SOCKET_URL` in `client/src/socket.js` to your server URL

### Environment Variables

**Client:**
- Update `SOCKET_URL` in `socket.js` to your deployed server URL

**Server:**
- Update CORS origin in `server.js` to your deployed client URL

## Future Enhancements

- [ ] Add AI opponent for single player
- [ ] Game history/statistics
- [ ] Custom room names
- [ ] Chat functionality
- [ ] Sound effects
- [ ] Better mobile responsiveness
- [ ] Reconnection handling
- [ ] Spectator mode

## Troubleshooting

**"Room not found" error:**
- Make sure room code is entered correctly (case-sensitive)
- Room codes are only valid while the creator is connected

**Connection issues:**
- Check that both server and client are running
- Verify server URL in `client/src/socket.js`
- Check browser console for errors

**Game not starting:**
- Both players must be in the room
- Refresh the page and try creating a new room

## License

MIT
