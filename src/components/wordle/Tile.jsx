import { useEffect, useState } from 'react';
import './Tile.css';

export const Tile = ({ letter, status, isEntered, index, skipFlipAnimation = false }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showStatus, setShowStatus] = useState(() => Boolean(skipFlipAnimation && isEntered));

  useEffect(() => {
    if (!isEntered) return;
    if (skipFlipAnimation) return;

    const delay = index * 300;

    const flipTimer = setTimeout(() => {
      setIsFlipping(true);
    }, delay);

    const colorTimer = setTimeout(() => {
      setShowStatus(true);
    }, delay + 300); // halfway through flip

    return () => {
      clearTimeout(flipTimer);
      clearTimeout(colorTimer);
    };
  }, [isEntered, index, skipFlipAnimation]);

  return (
    <div
      className={`tile 
        ${isFlipping ? 'flip' : ''} 
        ${showStatus ? status : ''}
      `}
    >
      {letter}
    </div>
  );
};