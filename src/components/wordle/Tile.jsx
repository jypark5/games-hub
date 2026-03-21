import { useEffect, useState } from 'react';
import './Tile.css';

export const Tile = ({ letter, status, isEntered, index }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (!isEntered) return;

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
  }, [isEntered, index]);

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