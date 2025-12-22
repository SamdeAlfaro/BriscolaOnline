# Adding Card Images to Briscola

## Required Images

You need **41 images** total:
- 40 card images (4 suits × 10 cards each)
- 1 card back image

## File Naming Convention

Save your images with these exact names in `client/src/assets/cards/`:

### Cups (Coppe) - 10 cards
- `cups_1.png` - Ace of Cups
- `cups_2.png` - Two of Cups
- `cups_3.png` - Three of Cups
- `cups_4.png` - Four of Cups
- `cups_5.png` - Five of Cups
- `cups_6.png` - Six of Cups
- `cups_7.png` - Seven of Cups
- `cups_8.png` - Jack of Cups (Fante)
- `cups_9.png` - Knight of Cups (Cavallo)
- `cups_10.png` - King of Cups (Re)

### Coins (Denari) - 10 cards
- `coins_1.png` - Ace of Coins
- `coins_2.png` - Two of Coins
- `coins_3.png` - Three of Coins
- `coins_4.png` - Four of Coins
- `coins_5.png` - Five of Coins
- `coins_6.png` - Six of Coins
- `coins_7.png` - Seven of Coins
- `coins_8.png` - Jack of Coins
- `coins_9.png` - Knight of Coins
- `coins_10.png` - King of Coins

### Swords (Spade) - 10 cards
- `swords_1.png` - Ace of Swords
- `swords_2.png` - Two of Swords
- `swords_3.png` - Three of Swords
- `swords_4.png` - Four of Swords
- `swords_5.png` - Five of Swords
- `swords_6.png` - Six of Swords
- `swords_7.png` - Seven of Swords
- `swords_8.png` - Jack of Swords
- `swords_9.png` - Knight of Swords
- `swords_10.png` - King of Swords

### Clubs (Bastoni) - 10 cards
- `clubs_1.png` - Ace of Clubs
- `clubs_2.png` - Two of Clubs
- `clubs_3.png` - Three of Clubs
- `clubs_4.png` - Four of Clubs
- `clubs_5.png` - Five of Clubs
- `clubs_6.png` - Six of Clubs
- `clubs_7.png` - Seven of Clubs
- `clubs_8.png` - Jack of Clubs
- `clubs_9.png` - Knight of Clubs
- `clubs_10.png` - King of Clubs

### Card Back
- `back.png` - The back design (shows on opponent's cards)

## Image Specifications

- **Format**: PNG recommended (with transparency if desired)
- **Recommended size**: 240px × 360px (or any 2:3 ratio)
- **Quality**: High-resolution for sharp rendering

## Where to Find Card Images

### Option 1: Download Italian Card Deck Images
Search for "Italian playing cards PNG" or "Carte napoletane PNG"

Popular sources:
- Wikimedia Commons (free, public domain)
- OpenGameArt.org (free game assets)
- Freepik (some free options)

### Option 2: Use a Card Deck Generator
- PlayingCards.io
- Custom card deck services

### Option 3: Scan Physical Cards
If you have an Italian card deck, you can scan them yourself!

## Quick Batch Rename Tips

If you download a full deck but the names don't match:

### On Mac/Linux:
```bash
# Example: rename files from "cup-1.png" to "cups_1.png"
for i in {1..10}; do
  mv "cup-$i.png" "cups_$i.png"
done
```

### On Windows (PowerShell):
```powershell
# Example: rename files
1..10 | ForEach-Object { 
  Rename-Item "cup-$_.png" "cups_$_.png" 
}
```

## After Adding Images

1. Place all images in `client/src/assets/cards/`
2. Restart your React development server
3. The game will automatically use the images!

## Fallback Behavior

If images are not found, the game will automatically fall back to the emoji/text-based cards, so you can add images gradually.

## Testing

To test if images are loading:
1. Open browser dev tools (F12)
2. Go to Console tab
3. Look for any 404 errors for missing images
4. Check the Network tab to see which images loaded

## Adjusting Card Size

If you want larger/smaller cards, edit `Card.css`:

```css
.card {
  width: 120px;   /* Change from 80px */
  height: 180px;  /* Change from 120px */
}
```

Keep the 2:3 width-to-height ratio for best results!
