export const NUM_LETTERS = 6

export const checkWord = (guess, solution) => {
  const result = Array(NUM_LETTERS).fill("grey");
  const solutionLetters = solution.split("");

  for (const index in guess) {
    if (guess[index] === solution[index]) {
      result[index] = "green";
    }
  }

  for (const index in guess) {
    if (result[index] !== "green") {
      const matchingIndex = solutionLetters.indexOf(guess[index]);

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