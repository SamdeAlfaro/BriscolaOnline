#!/bin/bash

echo "🎴 Briscola Online - Starting..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."
echo ""

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To run the game:"
echo "  1. Open a terminal and run: cd server && npm start"
echo "  2. Open another terminal and run: cd client && npm start"
echo ""
echo "The game will open in your browser at http://localhost:3000"
