import { NUM_LETTERS } from '../../helpers/wordleLogic';
import { Row } from './Row';
import { useEffect, useState } from 'react';
import sixLetterListFullRaw from '../../assets/six-letter-words.txt?raw';

const NUM_GUESSES = 7;

export const Wordle = () => {
  const [solution] = useState(() => {
    const wordsArrayFull = sixLetterListFullRaw.split('\n').map(word => word.trim())
    const randomIndex = Math.floor(Math.random() * wordsArrayFull.length);
    return wordsArrayFull[randomIndex];
  });
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      if (key === 'Enter') {
        if (currentGuess.length === NUM_LETTERS) {
          setGuesses([...guesses, currentGuess]);
          setCurrentGuess("");
        }
        if (guesses.length === NUM_GUESSES - 1) {
          alert(`The answer was ${solution}`);
        }
      }

      if (key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1));
      }

      if (/^[a-zA-Z]$/.test(key) && currentGuess.length < NUM_LETTERS) {
        setCurrentGuess(currentGuess.concat(key));
      }
    }

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