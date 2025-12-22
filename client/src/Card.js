import React from 'react';
import './Card.css';

const Card = ({ card, onClick, disabled, showBack = false }) => {
  // Generate the path to the card image
  const getCardImagePath = () => {
    if (showBack) {
      try {
        return require('./assets/cards/back.png');
      } catch (err) {
        return null;
      }
    }
    try {
      // Use format: 1_spade.jpg, 2_denari.jpg, etc.
      return require(`./assets/cards/${card.value}_${card.suit}.jpg`);
    } catch (err) {
      // Try PNG as fallback
      try {
        return require(`./assets/cards/${card.value}_${card.suit}.png`);
      } catch (err2) {
        return null;
      }
    }
  };

  const imagePath = getCardImagePath();

  // Fallback rendering if no image is available
  if (!imagePath) {
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
      return symbols[suit];
    };

    const getSuitColor = (suit) => {
      return suit === 'coppe' || suit === 'denari' ? '#d4af37' : '#2c3e50';
    };

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
      />
    </div>
  );
};

export default Card;
