#!/bin/bash

# Card image checker script
# Run this from the project root: ./check-cards.sh

CARDS_DIR="client/src/assets/cards"
MISSING=0

echo "🎴 Checking for card images in $CARDS_DIR..."
echo ""

# Check card back
if [ -f "$CARDS_DIR/back.png" ]; then
  echo "✓ Card back found"
else
  echo "✗ Missing: back.png"
  ((MISSING++))
fi

echo ""

# Check all suits
SUITS=("cups" "coins" "swords" "clubs")
for suit in "${SUITS[@]}"; do
  echo "Checking $suit:"
  for value in {1..10}; do
    if [ -f "$CARDS_DIR/${suit}_${value}.png" ]; then
      echo "  ✓ ${suit}_${value}.png"
    else
      echo "  ✗ Missing: ${suit}_${value}.png"
      ((MISSING++))
    fi
  done
  echo ""
done

if [ $MISSING -eq 0 ]; then
  echo "🎉 All 41 card images found!"
else
  echo "⚠️  Missing $MISSING image(s)"
  echo ""
  echo "See CARD_IMAGES_GUIDE.md for naming conventions"
fi
