import { GameCard } from "./GameCard";
import './Games.css';

export const Games = ({ gamesInfo }) => {
  return (
    <div className="game-selection-grid">
      {gamesInfo.map((gameInfo) => {
        return (
          <GameCard 
            key={gameInfo.id}
            icon={gameInfo.icon}
            name={gameInfo.name}
            description={gameInfo.description}
          />
        );
      })}
    </div>
  );
}