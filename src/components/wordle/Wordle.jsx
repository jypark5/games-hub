import { Row } from './Row';
import { ResetButton } from'./ResetButton';
import { GiveUpButton } from'./GiveUpButton';
import { useEffect, useState, useRef } from 'react';
import { getRandomWord } from '../../helpers/wordleLogic';
import sixLetterListFullRaw from '../../assets/six-letter-words.txt?raw';
import './Wordle.css';

const NUM_GUESSES = 7;
export const NUM_LETTERS = 6;
const wordsArrayFull = sixLetterListFullRaw.split('\n').map(word => word.trim());

export const Wordle = () => {
  const [solution, setSolution] = useState(() => {
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
          } else {
            showMessage("Not in word list :(");
          }
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
  }, [guesses, currentGuess, solution, isGameOver]);

  useEffect(() => {
    if (guesses.length === 0) return;

    const latestGuess = guesses[guesses.length - 1];

    const timer = setTimeout(() => {
      // Win
      if (latestGuess.toLowerCase() === solution.toLowerCase()) {
        setIsGameOver(true);
        showMessage("You win!");
        return;
      }
      // Loss
      else if (guesses.length === NUM_GUESSES) {
        setIsGameOver(true);
        showMessage(`${solution.toUpperCase()}`);
      }
    }, 5);

    return () => clearTimeout(timer);

  }, [guesses, solution]);

  const revealSolution = () => {
    showMessage(`Solution is "${solution.toUpperCase()}"`)
  }

  const resetGame = (event) => {
    if (event && event.currentTarget) {
      event.currentTarget.blur();
    }

    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
    setSolution(getRandomWord(wordsArrayFull));
  }

  console.log("Current Guesses Array:", guesses);

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
      <div className="buttons-container">
        <GiveUpButton onClick={revealSolution}/>
        <ResetButton onClick={resetGame}/>
      </div>
    </div>
  );
}