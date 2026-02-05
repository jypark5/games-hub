import './Row.css';
import { NUM_LETTERS, checkWord } from "../../helpers/wordleLogic";

export const Row = ({ guess, solution }) => {
  const tiles = []

  for (let i = 0; i < NUM_LETTERS; i++) {
    if (guess[i]) {
      tiles.push(guess[i].toUpperCase());
    } else {
      tiles.push("");
    }
  }

  return (
    <div className="row">
      {tiles.map((letter, index) => {
        return (
          <div
            key={index}
            className="cell"
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}