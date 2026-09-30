import type { Progress } from '../types/progress';
import { alphabet, animals } from '../data/content';

export function buildReward(state: Progress, activity: string, letter?: string): Progress {
  const requestedAnimal = alphabet.find(item => item.upper === letter)?.animal;
  const sticker = animals.find(item => item.name === requestedAnimal)?.name ?? animals[state.stars % animals.length].name;
  const stickers = state.stickers.includes(sticker) ? state.stickers : [...state.stickers, sticker];
  const activities = state.activities.includes(activity) ? state.activities : [...state.activities, activity];
  const tracedLetters = activity === 'trace' && letter && !state.tracedLetters.includes(letter)
    ? [...state.tracedLetters, letter]
    : state.tracedLetters;
  return { ...state, stars: state.stars + 1, stickers, activities, tracedLetters };
}
