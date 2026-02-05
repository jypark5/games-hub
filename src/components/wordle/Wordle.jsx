import { NUM_LETTERS } from '../../helpers/wordleLogic';
import { Row } from './Row';
import { useEffect, useState } from 'react';

const NUM_GUESSES = 7;

export const Wordle = () => {
  const [solution] = useState("castle");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (key === 'Enter') {
        if (currentGuess.length === 6) {
          setGuesses([...guesses, currentGuess]);
          setCurrentGuess("");
        }
      }

      if (key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
      }

      if (/^[a-zA-Z]$/.test(key) && currentGuess.length < 6) {
        setCurrentGuess(currentGuess.concat(key));
      }
    }

    console.log(`current guess: ${currentGuess}`);
    console.log(guesses);

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses, currentGuess]);

  return (
    <div className="wordle-grid">
      {
        [...Array(NUM_GUESSES)].map((_, index) => {

          return (
            <Row 
              key={index}
              guess={
                guesses[index] ? guesses[index] : 
                index === guesses.length ? currentGuess : 
                ""
              }
              solution={solution}
              isEntered={index < guesses.length}
            />
          );
        })
      }
    </div>
  );
}