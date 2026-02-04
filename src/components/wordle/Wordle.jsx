import { WORD_LENGTH } from '../../helpers/wordleLogic';

const NUM_GUESSES = 7;

export const Wordle = () => {
  return (
    <div className="wordle-grid">
      {
        [...Array(NUM_GUESSES)].map((_, index) => {
          <Row 
            key={index}
            length={WORD_LENGTH}
            guess={"fishes"}
          />
        })
      }
    </div>
  );
}