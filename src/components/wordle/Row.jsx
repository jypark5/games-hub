import './Row.css';
import { NUM_LETTERS, checkWord } from "../../helpers/wordleLogic";

export const Row = ({ guess, solution, isEntered }) => {
  const tiles = [];

  let statuses = [];
  if (guess.length === NUM_LETTERS && isEntered) {
    statuses = checkWord(guess, solution);
  }

  for (let i = 0; i < NUM_LETTERS; i++) {
    const status = statuses[i] ? statuses[i] : "";
    const letter = guess[i] ? guess[i].toUpperCase() : "";
    tiles.push({ letter, status, isEntered });
  }


  return (
    <div className="row">
      {tiles.map((tile, index) => {
        return (
          <div
            key={index}
            className={`cell ${isEntered ? tile.status : ""}`}
          >
            {tile.letter}
          </div>
        );
      })}
    </div>
  );
}