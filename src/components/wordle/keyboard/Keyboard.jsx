import { useMemo } from 'react';
import { KeyboardRow } from './KeyboardRow';

export function Keyboard({ letterStatuses, onKeyPress, disabled }) {
  const rows = useMemo(
    () => [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
    ],
    [],
  );

  return (
    <div className="wordle-keyboard">
      {rows.map((rowKeys) => (
        <KeyboardRow
          key={rowKeys.join(',')}
          keys={rowKeys}
          letterStatuses={letterStatuses}
          onKeyPress={onKeyPress}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

