import './WordleButton.css';

export const GiveUpButton = ({ onClick }) => {
  return (
    <button 
      className="wordle-button"
      onClick={onClick}
    >
      Reveal Solution
    </button>
  )
}