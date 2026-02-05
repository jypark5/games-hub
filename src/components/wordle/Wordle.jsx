import { NUM_LETTERS } from '../../helpers/wordleLogic';
import { Row } from './Row';
import { useState } from 'react';

const NUM_GUESSES = 7;

export const Wordle = () => {

  const [solution] = useState("castle");

  const [guesses, setGuesses] = useState(["fishes", "cashew"]);

  // const [currentGuess, setCurrentGuess] = useState("word");

  return (
    <div className="wordle-grid">
      {
        [...Array(NUM_GUESSES)].map((_, index) => {

          return (
            <Row 
              key={index}
              guess={guesses[index] || ""}
              solution={solution}
            />
          );
        })
      }
    </div>
  );
}