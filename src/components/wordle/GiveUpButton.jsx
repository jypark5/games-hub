import './GiveUpButton.css';

export const GiveUpButton = ({ onClick }) => {
  return (
    <button 
      className="give-up-button"
      onClick={onClick}
    >
      Reveal Solution
    </button>
  )
}