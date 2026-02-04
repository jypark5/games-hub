import { Link } from "react-router-dom";
import { GameCard } from "./GameCard";
import './Games.css';
import './GameCard.css';

export const Games = ({ gamesInfo }) => {
  return (
    <div className="game-selection-grid">
      {gamesInfo.map((gameInfo) => {
        return (
          <Link to={gameInfo.path} class="game-card-link">
            <GameCard 
              key={gameInfo.id}
              icon={gameInfo.icon}
              name={gameInfo.name}
              description={gameInfo.description}
            />
          </Link>
        );
      })}
    </div>
  );
}