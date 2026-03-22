import { Row } from './Row';
import { ResetButton } from'./ResetButton';
import { GiveUpButton } from'./GiveUpButton';
import { useEffect, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
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
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isGameOver || isAnimating) return;

      const key = event.key;

      if (key === 'Enter') {
        if (currentGuess.length === NUM_LETTERS) {
          if (wordsArrayFull.includes(currentGuess)) {
            setGuesses(prev => [...prev, currentGuess]);
            setCurrentGuess("");
          } else {
            toast.error("Not in word list :(");
          }
        }
        // setIsAnimating(true);
        // if (animationTimerRef.current) {
        //   clearTimeout(animationTimerRef.current);
        // }

        animationTimerRef.current = setTimeout(() => {
          setIsAnimating(false);
          animationTimerRef.current = null;
        }, NUM_LETTERS * 300);
      }

      if (key === 'Backspace') {
        setCurrentGuess(prev => prev.slice(0, -1));
      }

      if (/^[a-zA-Z]$/.test(key) && currentGuess.length < NUM_LETTERS) {
        setCurrentGuess(prev => prev.concat(key));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guesses, currentGuess, solution, isGameOver, isAnimating]);

  useEffect(() => {
    if (guesses.length === 0) return;

    const latestGuess = guesses[guesses.length - 1];

    const timer = setTimeout(() => {
      // Win
      if (latestGuess.toLowerCase() === solution.toLowerCase()) {
        setIsGameOver(true);
        setTimeout(() => {
          toast.success("You win!");
        }, (NUM_LETTERS) * 300);
        return;
      }
      // Loss
      else if (guesses.length === NUM_GUESSES) {
        setIsGameOver(true);
        toast.info(`${solution.toUpperCase()}`);
      }
    }, 5);

    return () => clearTimeout(timer);

  }, [guesses, solution]);

  useEffect(() => {
    // Cleaning up timer when component unmounts
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  const revealSolution = (event) => {
    if (event && event.currentTarget) {
      event.currentTarget.blur();
    }
    toast.info(`Solution is "${solution.toUpperCase()}"`)
  }

  const resetGame = (event) => {
    if (event && event.currentTarget) {
      event.currentTarget.blur();
    }

    setGuesses([]);
    setCurrentGuess("");
    setIsGameOver(false);
    setSolution(getRandomWord(wordsArrayFull));

    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    setGameKey(prev => prev + 1); // Force remount
  }

  console.log("Current Guesses Array:", guesses);

  return (
    <div className="wordle-container">
      <div key={gameKey} className="wordle-grid">
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

      <ToastContainer 
        position="top-center"
        autoClose={1000}
        hideProgressBar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        theme="light"
      />

      <div className="buttons-container">
        <GiveUpButton onClick={revealSolution}/>
        <ResetButton onClick={resetGame}/>
      </div>
    </div>
  );
}