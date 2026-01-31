import './GameCard.css';

export const GameCard = ({ icon, name, description}) => {
  return (
    <div className="game-card">
      <img className="game-icon" src={icon} alt="" />
      <h2 className="game-name">{name}</h2>
      <p className="game-description">{description}</p>
    </div>
  );
}