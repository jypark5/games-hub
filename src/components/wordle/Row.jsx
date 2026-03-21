import './Row.css';
import { checkWord } from '../../helpers/wordleLogic';
import { NUM_LETTERS } from './Wordle';
import { Tile } from './Tile';

export const Row = ({ guess, solution, isEntered }) => {
  let statuses = [];

  if (guess.length === NUM_LETTERS && isEntered) {
    statuses = checkWord(guess, solution);
  }

  return (
    <div className="row">
      {[...Array(NUM_LETTERS)].map((_, index) => {
        const letter = guess[index] ? guess[index].toUpperCase() : "";
        const status = statuses[index] || "";

        return (
          <Tile
            key={index}
            letter={letter}
            status={status}
            isEntered={isEntered}
            index={index}
          />
        );
      })}
    </div>
  );
}