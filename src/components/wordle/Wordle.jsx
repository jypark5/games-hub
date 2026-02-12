import { Row } from './Row';
import { useEffect, useState, useRef } from 'react';
import { getRandomWord } from '../../helpers/wordleLogic';
import sixLetterListFullRaw from '../../assets/six-letter-words.txt?raw';
import './Wordle.css';

const NUM_GUESSES = 7;
export const NUM_LETTERS = 6;

export const Wordle = () => {
  const wordsArrayFull = sixLetterListFullRaw.split('\n').map(word => word.trim());
  const [solution] = useState(() => {
    return getRandomWord(wordsArrayFull);
  });
  // const [solution] = useState("Castle");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [message, setMessage] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const timerRef = useRef(null);

  const showMessage = (msg) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setMessage(msg);
    timerRef.current = setTimeout(() => {
      setMessage("");
      timerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isGameOver) return;

      const key = event.key;

      if (key === 'Enter') {
        if (currentGuess.length === NUM_LETTERS) {
          if (wordsArrayFull.includes(currentGuess)) {
            setGuesses([...guesses, currentGuess]);
            setCurrentGuess("");
            if (currentGuess.toLowerCase() === solution.toLowerCase()) {
              setIsGameOver(true);
              showMessage("You win!");
              return;
            }
          } else {
            showMessage("Not in word list :(");
          }
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
    <div className="wordle-container">
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
      {message && <div className="wordle-message">
        {message}
      </div>}
    </div>
  );
}