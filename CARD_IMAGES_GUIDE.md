# Adding Card Images to Briscola

## Required Images

You need **41 images** total:
- 40 card images (4 suits × 10 cards each)
- 1 card back image

## File Naming Convention

Save your images with these exact names in `client/src/assets/cards/`:

### Coppe (Cups) - 10 cards
- `1_coppe.jpg` - Asso di Coppe (Ace of Cups)
- `2_coppe.jpg` - Due di Coppe
- `3_coppe.jpg` - Tre di Coppe
- `4_coppe.jpg` - Quattro di Coppe
- `5_coppe.jpg` - Cinque di Coppe
- `6_coppe.jpg` - Sei di Coppe
- `7_coppe.jpg` - Sette di Coppe
- `8_coppe.jpg` - Fante di Coppe (Jack)
- `9_coppe.jpg` - Cavallo di Coppe (Knight)
- `10_coppe.jpg` - Re di Coppe (King)

### Denari (Coins) - 10 cards
- `1_denari.jpg` - Asso di Denari
- `2_denari.jpg` - Due di Denari
- `3_denari.jpg` - Tre di Denari
- `4_denari.jpg` - Quattro di Denari
- `5_denari.jpg` - Cinque di Denari
- `6_denari.jpg` - Sei di Denari
- `7_denari.jpg` - Sette di Denari
- `8_denari.jpg` - Fante di Denari
- `9_denari.jpg` - Cavallo di Denari
- `10_denari.jpg` - Re di Denari

### Spade (Swords) - 10 cards
- `1_spade.jpg` - Asso di Spade
- `2_spade.jpg` - Due di Spade
- `3_spade.jpg` - Tre di Spade
- `4_spade.jpg` - Quattro di Spade
- `5_spade.jpg` - Cinque di Spade
- `6_spade.jpg` - Sei di Spade
- `7_spade.jpg` - Sette di Spade
- `8_spade.jpg` - Fante di Spade
- `9_spade.jpg` - Cavallo di Spade
- `10_spade.jpg` - Re di Spade

### Bastoni (Clubs) - 10 cards
- `1_bastoni.jpg` - Asso di Bastoni
- `2_bastoni.jpg` - Due di Bastoni
- `3_bastoni.jpg` - Tre di Bastoni
- `4_bastoni.jpg` - Quattro di Bastoni
- `5_bastoni.jpg` - Cinque di Bastoni
- `6_bastoni.jpg` - Sei di Bastoni
- `7_bastoni.jpg` - Sette di Bastoni
- `8_bastoni.jpg` - Fante di Bastoni
- `9_bastoni.jpg` - Cavallo di Bastoni
- `10_bastoni.jpg` - Re di Bastoni

### Card Back
- `back.png` - The back design (shows on opponent's cards)

## Naming Pattern

```
{value}_{suit}.jpg
```

Where:
- **value**: 1-10
- **suit**: coppe, denari, spade, bastoni

The code will try `.jpg` first, then fall back to `.png` if not found.

## Image Specifications

- **Format**: JPG or PNG
- **Recommended size**: 240px × 360px (or any 2:3 ratio)
- **Quality**: High-resolution for sharp rendering

## After Adding Images

1. Place all images in `client/src/assets/cards/`
2. Restart your React development server
3. The game will automatically use the images!

## Fallback Behavior

If images are not found, the game will automatically fall back to emoji/text-based cards with Italian letters (F=Fante, C=Cavallo, R=Re), so you can add images gradually.

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
