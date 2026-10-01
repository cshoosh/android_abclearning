import type { Progress } from '../types/progress';
import { alphabet, animals } from '../data/content';

export function buildReward(state: Progress, activity: string, letter?: string): Progress {
  const target = letter?.replace(/^ur:/, '');
  const requestedAnimal = animals.some(item => item.name === target)
    ? target
    : alphabet.find(item => item.upper === target)?.animal;
  const availableAnimals = animals.slice(0, state.premium ? animals.length : 6);
  const preferred = availableAnimals.find(item => item.name === requestedAnimal && !state.stickers.includes(item.name));
  const nextAvailable = availableAnimals.find(item => !state.stickers.includes(item.name));
  const sticker = preferred?.name ?? nextAvailable?.name;
  const stickers = sticker ? [...state.stickers, sticker] : state.stickers;
  const activities = state.activities.includes(activity) ? state.activities : [...state.activities, activity];
  const tracedLetters = activity === 'trace' && letter && !state.tracedLetters.includes(letter)
    ? [...state.tracedLetters, letter]
    : state.tracedLetters;
  return { ...state, stars: state.stars + 1, stickers, activities, tracedLetters };
}
