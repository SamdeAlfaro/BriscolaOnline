import React from 'react';
import './Card.css';

const Card = ({ card, onClick, disabled, showBack = false }) => {
  // Generate the path to the card image (from public folder)
  const getCardImagePath = () => {
    if (showBack) {
      return '/cards/back.png';
    }
    // Try jpg first, then png
    return `/cards/${card.value}_${card.suit}.jpg`;
  };

  const [imageError, setImageError] = React.useState(false);
  const imagePath = getCardImagePath();

  // Fallback rendering if no image is available
  if (imageError) {
    const getCardDisplay = (value) => {
      const displays = {
        1: 'A',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: 'F',  // Fante
        9: 'C',  // Cavallo
        10: 'R'  // Re
      };
      return displays[value];
    };

    const getSuitSymbol = (suit) => {
      const symbols = {
        coppe: '🏆',
        denari: '🪙',
        spade: '⚔️',
        bastoni: '🌿'
      };
      return symbols[suit] || '?';
    };

    const getSuitColor = (suit) => {
      return suit === 'coppe' || suit === 'denari' ? '#d4af37' : '#2c3e50';
    };

    if (showBack) {
      return (
        <div className="card card-back-placeholder">
          🂠
        </div>
      );
    }

    return (
      <div 
        className={`card ${disabled ? 'disabled' : ''}`}
        onClick={disabled ? null : onClick}
        style={{ borderColor: getSuitColor(card.suit) }}
      >
        <div className="card-value" style={{ color: getSuitColor(card.suit) }}>
          {getCardDisplay(card.value)}
        </div>
        <div className="card-suit">
          {getSuitSymbol(card.suit)}
        </div>
        <div className="card-value-bottom" style={{ color: getSuitColor(card.suit) }}>
          {getCardDisplay(card.value)}
        </div>
      </div>
    );
  }

  // Render with image
  return (
    <div 
      className={`card card-image ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? null : onClick}
    >
      <img 
        src={imagePath}
        alt={showBack ? "Card back" : `${card.suit} ${card.value}`}
        className="card-img"
        onError={() => setImageError(true)}
      />
    </div>
  );
};

export default Card;