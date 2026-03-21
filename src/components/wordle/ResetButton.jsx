import './WordleButton.css';

export const ResetButton = ({ onClick }) => {
  return (
    <button 
      className="wordle-button" 
      onClick={onClick}
    >
      Restart Game
    </button>
  )
}