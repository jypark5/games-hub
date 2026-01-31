import twoZeroFourEightIcon from '../assets/2048-icon.png';
import './GameCard.css';

export const GameCard = () => {
  return (
    <div className="game-card">
      <img className="game-icon" src={twoZeroFourEightIcon} alt="" />
      <h2 className="game-name">2048</h2>
      <p className="game-description">description of the game rnadom word fd ls fi d</p>
    </div>
  );
}