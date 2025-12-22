import React from 'react';
import './Card.css';

const Card = ({ card, onClick, disabled, showBack = false }) => {
  // Generate the path to the card image
  const getCardImagePath = () => {
    if (showBack) {
      return require('./assets/cards/back.png');
    }
    try {
      return require(`./assets/cards/${card.suit}_${card.value}.png`);
    } catch (err) {
      // Fallback if image doesn't exist
      return null;
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
        8: 'J',
        9: 'K',
        10: 'Q'
      };
      return displays[value];
    };

    const getSuitSymbol = (suit) => {
      const symbols = {
        cups: '🏆',
        coins: '🪙',
        swords: '⚔️',
        clubs: '🌿'
      };
      return symbols[suit];
    };

    const getSuitColor = (suit) => {
      return suit === 'cups' || suit === 'coins' ? '#d4af37' : '#2c3e50';
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
