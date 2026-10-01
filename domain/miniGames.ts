import { animals, colorsAndShapes } from '../data/content';
import { getLearningLetters } from '../data/learningLetters';
import { translateLearningWord, translateText, type AppLanguage } from '../localization';

export type MiniGameId = 'balloon-pop' | 'animal-match' | 'first-letter' | 'color-pop' | 'shape-hunt' | 'count-stars' | 'animal-puzzle' | 'letter-bubbles';
export type MiniGameOption = { id: string; label: string; emoji?: string; color?: string; name?: string };
export type MiniGameRound = {
  targetId: string;
  answerId: string;
  prompt: string;
  visual: { text?: string; emoji?: string; name?: string; count?: number };
  options: MiniGameOption[];
};

export const miniGames: { id: MiniGameId; title: string; tab: string; emoji: string; color: string; premium?: boolean }[] = [
  { id: 'balloon-pop', title: 'Balloon Pop', tab: 'Balloons', emoji: '🎈', color: '#DFF3FF' },
  { id: 'animal-match', title: 'Animal Match', tab: 'Animal Match', emoji: '🐾', color: '#E1F5DF' },
  { id: 'first-letter', title: 'First Letter', tab: 'First Letter', emoji: '🔤', color: '#FFF0C8' },
  { id: 'color-pop', title: 'Color Pop', tab: 'Colors', emoji: '🎨', color: '#F9E4EF' },
  { id: 'shape-hunt', title: 'Shape Hunt', tab: 'Shapes', emoji: '🔺', color: '#E8E1FF' },
  { id: 'count-stars', title: 'Count the Stars', tab: 'Count', emoji: '⭐', color: '#FFF1BD' },
  { id: 'animal-puzzle', title: 'Animal Puzzle', tab: 'Puzzle', emoji: '🧩', color: '#FFF0C8', premium: true },
  { id: 'letter-bubbles', title: 'Letter Bubbles', tab: 'Bubbles', emoji: '🫧', color: '#E8E1FF', premium: true },
];

const colors = colorsAndShapes.slice(0, 7);
const shapes = colorsAndShapes.slice(7);
const counts = Array.from({ length: 10 }, (_, index) => index + 1);

function take<T>(items: readonly T[], count: number, random: () => number): T[] {
  const pool = [...items];
  const result: T[] = [];
  while (result.length < count && pool.length) {
    const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
    result.push(pool.splice(index, 1)[0]);
  }
  return result;
}

function options<T extends { name?: string; upper?: string; lower?: string; word?: string; emoji?: string; color?: string }>(
  items: readonly T[], target: T, random: () => number, label: (item: T) => string, count = 4,
): MiniGameOption[] {
  const selected = [target, ...take(items.filter(item => item !== target), count - 1, random)];
  return take(selected, selected.length, random).map(item => ({
    id: label(item), label: label(item), emoji: item.emoji, color: item.color, name: item.name,
  }));
}

function different<T>(items: readonly T[], previousTargetId: string | undefined, getId: (item: T) => string, random: () => number): T {
  const pool = items.filter(item => getId(item) !== previousTargetId);
  return take(pool.length ? pool : items, 1, random)[0];
}

export function createMiniGameRound(gameId: MiniGameId, previousTargetId?: string, random: () => number = Math.random, language: AppLanguage = 'en'): MiniGameRound {
  const letters = getLearningLetters(language);
  const isUrdu = language === 'ur';
  if (gameId === 'balloon-pop' || gameId === 'letter-bubbles' || gameId === 'first-letter') {
    const letterPool = isUrdu && gameId !== 'balloon-pop'
      ? letters.filter(item => item.word.startsWith(item.upper))
      : letters;
    const target = different(letterPool, previousTargetId, item => item.upper, random);
    if (gameId === 'balloon-pop') return {
      targetId: target.upper,
      answerId: target.upper,
      prompt: isUrdu ? `حرف ${target.upper} والا غبارہ پھوڑیں` : `Pop the balloon with the letter ${target.upper}`,
      visual: { text: target.upper },
      options: options(letterPool, target, random, item => item.upper),
    };
    if (gameId === 'letter-bubbles') return {
      targetId: target.upper,
      answerId: isUrdu ? target.upper : target.lower,
      prompt: isUrdu ? `لفظ ${target.word} کا پہلا حرف چنیں` : `Tap the lowercase letter for ${target.upper}`,
      visual: isUrdu ? { text: target.word, emoji: target.emoji } : { text: target.upper },
      options: options(letterPool, target, random, item => isUrdu ? item.upper : item.lower),
    };
    return {
      targetId: target.upper,
      answerId: target.upper,
      prompt: isUrdu ? 'اس لفظ کا پہلا حرف کون سا ہے؟' : 'Which letter starts this word?',
      visual: { text: target.word, emoji: target.emoji, name: animals.find(animal => animal.name === target.word)?.name },
      options: options(letterPool, target, random, item => item.upper),
    };
  }

  if (gameId === 'animal-match' || gameId === 'animal-puzzle') {
    const target = different(animals, previousTargetId, item => item.name, random);
    const localizedName = isUrdu ? translateLearningWord(target.name, language) : target.name;
    const firstCharacter = localizedName[0];
    const firstLetter = letters.find(item => item.upper === firstCharacter) ?? letters[0];
    if (gameId === 'animal-match') {
      const displayName = (animal: typeof target) => isUrdu ? translateLearningWord(animal.name, language) : animal.name;
      const distractors = animals.filter(animal => displayName(animal)[0] !== firstCharacter);
      return {
        targetId: target.name,
        answerId: displayName(target),
        prompt: isUrdu ? 'اس حرف سے شروع ہونے والا جانور چنیں' : 'Tap the animal whose name starts with this letter',
        visual: { text: firstLetter.upper },
        options: options(distractors, target, random, animal => displayName(animal)),
      };
    }
    return {
      targetId: target.name,
      answerId: isUrdu ? localizedName : target.name,
      prompt: isUrdu ? `${localizedName} والے جانور کو چنیں` : `Tap the animal called ${target.name}`,
      visual: { emoji: '🧩' },
      options: options(animals, target, random, item => isUrdu ? translateLearningWord(item.name, language) : item.name),
    };
  }

  if (gameId === 'color-pop' || gameId === 'shape-hunt') {
    const items = gameId === 'color-pop' ? colors : shapes;
    const target = different(items, previousTargetId, item => item.name, random);
    const displayName = (item: typeof target) => isUrdu ? translateText(item.name, language) : item.name;
    return {
      targetId: target.name,
      answerId: displayName(target),
      prompt: gameId === 'color-pop' ? 'Pick the name of this color' : 'Pick the name of this shape',
      visual: { emoji: target.emoji },
      options: options(items, target, random, displayName),
    };
  }

  const target = different(counts, previousTargetId, String, random);
  return {
    targetId: String(target),
    answerId: String(target),
    prompt: 'How many stars?',
    visual: { count: target },
    options: options(counts, target, random, String),
  };
}
