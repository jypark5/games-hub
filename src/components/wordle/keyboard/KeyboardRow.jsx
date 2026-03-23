import { Key } from './Key';

export function KeyboardRow({ keys, letterStatuses, onKeyPress, disabled }) {
  return (
    <div className="wordle-keyboard-row">
      {keys.map((key) => {
        const isBackspace = key === 'BACKSPACE';
        const isEnter = key === 'ENTER';

        const label = isBackspace ? 'BACKSPACE' : isEnter ? 'ENTER' : key;
        const status = !isBackspace && !isEnter ? letterStatuses?.[key] : undefined;

        return (
          <Key
            key={key}
            label={label}
            variant={isBackspace || isEnter ? 'wide' : 'letter'}
            status={status}
            onPress={onKeyPress}
            disabled={disabled}
            ariaLabel={
              isBackspace
                ? 'Backspace'
                : isEnter
                  ? 'Enter'
                  : `Letter ${key}`
            }
          />
        );
      })}
    </div>
  );
}

