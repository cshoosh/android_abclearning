import { Progress } from '../types/progress';

export function clearPlayProgress(progress: Progress): Progress {
  return { ...progress, stars: 0, viewedLetters: [], tracedLetters: [], activities: [], stickers: [] };
}
