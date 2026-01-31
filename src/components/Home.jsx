import { GameCard } from "./GameCard";
import './Home.css';

export const Home = () => {
  return (
    <div className="game-selection-grid">
      <GameCard />
      <GameCard />
      <GameCard />
    </div>
  );
}