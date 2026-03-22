const STORAGE_KEY = 'games-hub:wordle:v1';

export function loadWordlePersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (typeof parsed.solution !== 'string' || !Array.isArray(parsed.guesses)) return null;
    return {
      solution: parsed.solution,
      guesses: parsed.guesses,
      isGameOver: Boolean(parsed.isGameOver),
      gameKey: typeof parsed.gameKey === 'number' ? parsed.gameKey : 0,
    };
  } catch {
    return null;
  }
}

export function saveWordlePersistedState(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        solution: state.solution,
        guesses: state.guesses,
        isGameOver: state.isGameOver,
        gameKey: state.gameKey,
      }),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function clearWordlePersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const SYNC_META_KEY = 'games-hub:wordle:last-cloud-sync';

export function getLastSyncedWordleSignature() {
  try {
    return localStorage.getItem(SYNC_META_KEY);
  } catch {
    return null;
  }
}

export function setLastSyncedWordleSignature(signature) {
  try {
    if (signature == null) localStorage.removeItem(SYNC_META_KEY);
    else localStorage.setItem(SYNC_META_KEY, signature);
  } catch {
    // ignore
  }
}

export function buildWordleResultSignature({ solution, guesses, isWin }) {
  return JSON.stringify({
    solution: solution.toLowerCase(),
    guesses: guesses.map((g) => g.toLowerCase()),
    isWin,
  });
}
