export const NUM_LETTERS = 6

export const checkWord = (guess, solution) => {
  const result = Array(NUM_LETTERS).fill("grey");
  const solutionUpper = solution.toUpperCase();
  const solutionLetters = solutionUpper.split("");
  const guessUpper = guess.toUpperCase()

  for (const index in guessUpper) {
    if (guessUpper[index] === solutionUpper[index]) {
      result[index] = "green";
    }
  }

  for (const index in guessUpper) {
    if (result[index] !== "green") {
      const matchingIndex = solutionLetters.indexOf(guessUpper[index]);

      if (matchingIndex !== -1) {
        result[index] = "yellow"

        // duplicate letter handling, ensuring only the correct number of letters
        // are marked yellow
        solutionLetters[index] = null;
      }
    }
  }
  
  return result;
}