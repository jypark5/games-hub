import { Row } from './Row';
import { ResetButton } from'./ResetButton';
import { GiveUpButton } from'./GiveUpButton';
import { useEffect, useMemo, useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getRandomWord } from '../../helpers/wordleLogic';
import sixLetterListFullRaw from '../../assets/six-letter-words.txt?raw';
import { useAuth } from '../../hooks/useAuth';
import {
  loadWordlePersistedState,
  saveWordlePersistedState,
  buildWordleResultSignature,
  getLastSyncedWordleSignature,
  setLastSyncedWordleSignature,
} from '../../lib/wordleStorage';
import { submitGameResult } from '../../lib/submitGameResult';
import './Wordle.css';
import { Keyboard } from './keyboard/Keyboard';

const NUM_GUESSES = 7;
export const NUM_LETTERS = 6;
const wordsArrayFull = sixLetterListFullRaw.split('\n').map(word => word.trim());

export const Wordle = () => {
  const { user, supabase, configured } = useAuth();
  const persisted = loadWordlePersistedState();
  const [solution, setSolution] = useState(() => {
    return persisted?.solution ?? getRandomWord(wordsArrayFull);
  });
  const [guesses, setGuesses] = useState(() => persisted?.guesses ?? []);
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(() => persisted?.isGameOver ?? false);
  const [gameKey, setGameKey] = useState(() => persisted?.gameKey ?? 0);
  const [skipFlipForRowCount, setSkipFlipForRowCount] = useState(
    () => persisted?.guesses?.length ?? 0,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimerRef = useRef(null);
  const cloudSyncAttemptRef = useRef(null);

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

  const getGuessStatusesForKeyboard = (guess, currentSolution) => {
    // Mirrors the logic in `checkWord` but keeps Wordle -> helper dependencies simple
    // so this file doesn't need to import `checkWord` (which would create a cycle).
    const result = Array(NUM_LETTERS).fill('grey');
    const solutionUpper = currentSolution.toUpperCase();
    const solutionLetters = solutionUpper.split('');
    const guessUpper = guess.toUpperCase();

    for (const index in guessUpper) {
      if (guessUpper[index] === solutionUpper[index]) {
        result[index] = 'green';
        solutionLetters[index] = null;
      }
    }

    for (const index in guessUpper) {
      if (result[index] !== 'green') {
        const matchingIndex = solutionLetters.indexOf(guessUpper[index]);
        if (matchingIndex !== -1) {
          result[index] = 'yellow';
          solutionLetters[matchingIndex] = null;
        }
      }
    }

    return result;
  };

  const keyboardLetterStatuses = useMemo(() => {
    const map = {};

    for (const guess of guesses) {
      if (!guess || guess.length !== NUM_LETTERS) continue;
      const statuses = getGuessStatusesForKeyboard(guess, solution);

      for (let i = 0; i < NUM_LETTERS; i += 1) {
        const letter = guess[i].toUpperCase();
        const status = statuses[i];

        if (status === 'green') map[letter] = 'green';
        else if (status === 'yellow' && map[letter] !== 'green') map[letter] = 'yellow';
        else if (status === 'grey' && map[letter] == null) map[letter] = 'grey';
      }
    }

    return map;
  }, [guesses, solution]);

  const handleKeyboardKeyPress = (key) => {
    if (isGameOver || isAnimating) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== NUM_LETTERS) {
        toast.error('Not enough letters :(');
        return;
      }
      if (wordsArrayFull.includes(currentGuess)) {
        setGuesses((prev) => [...prev, currentGuess]);
        setCurrentGuess('');
      } else {
        toast.error('Not in word list :(');
      }

      animationTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
        animationTimerRef.current = null;
      }, NUM_LETTERS * 300);
      return;
    }

    if (key === 'BACKSPACE') {
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(key) && currentGuess.length < NUM_LETTERS) {
      setCurrentGuess((prev) => prev.concat(key.toLowerCase()));
    }
  };

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

  useEffect(() => {
    saveWordlePersistedState({ solution, guesses, isGameOver, gameKey });
  }, [solution, guesses, isGameOver, gameKey]);

  useEffect(() => {
    if (!isGameOver || !user || !supabase || !configured) return;

    const lastGuess = guesses[guesses.length - 1];
    const won =
      Boolean(lastGuess) && lastGuess.toLowerCase() === solution.toLowerCase();
    const signature = buildWordleResultSignature({
      solution,
      guesses,
      isWin: won,
    });

    if (getLastSyncedWordleSignature() === signature) return;
    if (cloudSyncAttemptRef.current === signature) return;
    cloudSyncAttemptRef.current = signature;

    submitGameResult(supabase, user.id, 'wordle', guesses.length, {
      won,
      num_letters: NUM_LETTERS,
      max_guesses: NUM_GUESSES,
      guesses: guesses.map((g) => g.toLowerCase()),
    }).then(({ error }) => {
      if (!error) {
        setLastSyncedWordleSignature(signature);
      } else {
        cloudSyncAttemptRef.current = null;
        console.error('Failed to save Wordle result:', error.message);
      }
    });
  }, [isGameOver, user, supabase, configured, guesses, solution]);

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

    setSkipFlipForRowCount(0);
    setGameKey(prev => prev + 1); // Force remount
  }

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
                skipFlipAnimation={index < skipFlipForRowCount}
              />
            );
          })
        }
      </div>

      <Keyboard
        letterStatuses={keyboardLetterStatuses}
        onKeyPress={handleKeyboardKeyPress}
        disabled={isGameOver || isAnimating}
      />

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