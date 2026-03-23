import backspaceIcon from '../../../assets/backspace.png';
import './Keyboard.css';

export function Key({
  label,
  variant = 'letter',
  status,
  onPress,
  disabled = false,
  ariaLabel,
}) {
  const isBackspace = label === 'BACKSPACE';
  const className = [
    'wordle-key',
    status ? `wordle-key--${status}` : '',
    variant === 'wide' ? 'wordle-key--wide' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (disabled) return;
    onPress?.(label);
  };

  const content = isBackspace ? (
    <img className="wordle-key__icon" src={backspaceIcon} alt="Backspace" />
  ) : (
    label
  );

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
    >
      {content}
    </button>
  );
}

