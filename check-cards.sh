#!/bin/bash

# Card image checker script
# Run this from the project root: ./check-cards.sh

CARDS_DIR="client/src/assets/cards"
MISSING=0

echo "🎴 Checking for card images in $CARDS_DIR..."
echo ""

# Check card back
if [ -f "$CARDS_DIR/back.png" ]; then
  echo "✓ Card back found (back.png)"
else
  echo "✗ Missing: back.png"
  ((MISSING++))
fi

echo ""

# Check all suits (Italian names)
SUITS=("coppe" "denari" "spade" "bastoni")
SUIT_NAMES=("Coppe (Cups)" "Denari (Coins)" "Spade (Swords)" "Bastoni (Clubs)")

for i in "${!SUITS[@]}"; do
  suit="${SUITS[$i]}"
  suit_name="${SUIT_NAMES[$i]}"
  echo "Checking $suit_name:"
  
  for value in {1..10}; do
    # Check for .jpg first, then .png
    if [ -f "$CARDS_DIR/${value}_${suit}.jpg" ]; then
      echo "  ✓ ${value}_${suit}.jpg"
    elif [ -f "$CARDS_DIR/${value}_${suit}.png" ]; then
      echo "  ✓ ${value}_${suit}.png"
    else
      echo "  ✗ Missing: ${value}_${suit}.jpg (or .png)"
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
  echo "Expected format: {value}_{suit}.jpg"
  echo "Example: 1_coppe.jpg, 2_denari.jpg, 10_spade.jpg"
  echo ""
  echo "See CARD_IMAGES_GUIDE.md for complete naming conventions"
fi
