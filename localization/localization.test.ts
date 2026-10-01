import { isRTL, speechLocale, translateLearningWord, translateText } from '.';
import { alphabet, animals } from '../data/content';
import { getLearningLetters } from '../data/learningLetters';

describe('language support', () => {
  it('keeps English as the safe fallback and translates Urdu interface strings', () => {
    expect(translateText('Animal Homes', 'en')).toBe('Animal Homes');
    expect(translateText('Animal Homes', 'ur')).toBe('جانوروں کے گھر');
    expect(translateText('🎵  Music', 'ur')).toBe('🎵  موسیقی');
    expect(translateText('A newly added English label', 'ur')).toBe('A newly added English label');
  });

  it('translates dynamic prompts and preserves the English learning word alongside Urdu', () => {
    expect(translateText('Can you feed Lion?', 'ur')).toContain('شیر');
    expect(translateText('Tap 3 bananas!', 'ur')).toContain('3');
    expect(translateLearningWord('Apple', 'ur')).toBe('سیب');
    expect(translateLearningWord('Cat', 'ur')).toBe('بلی');
    expect(translateText('Pop the balloon with the letter Z', 'ur')).toContain('Z');
    expect(translateText('Tap the lowercase letter for A', 'ur')).toContain('A');
    expect(translateText('Tap the animal called Fox', 'ur')).toContain('لومڑی');
  });

  it('covers home, sticker, activity, and parent status copy that was previously missed', () => {
    for (const text of [
      'Language',
      'Eight changing mini-games',
      'Which letter starts this word?',
      'Which letter starts this animal’s name?',
      'Trace the big letter with your finger to earn a star!',
      'You earned a star! Trace the next letter.',
      'Follow the letter shape. Little lines are okay!',
      'Pick the name of this color',
      'Pick the name of this shape',
      'How many stars?',
      'Choose app language',
      'Close',
      'Opens language choices',
      'Getting our jungle ready…',
      'Finish an activity to earn a star and a sticker reward.',
      'Find B in Find the Letter. Tap it to earn the Bear sticker.',
      'Play Count & Feed for a star and a surprise sticker. Keep playing to collect Lion.',
      'COLLECTED ✓',
      'Turn voice off',
      'ON',
      'OFF',
      'Hear the letter Z',
      '4 stars',
      'That’s Red! 🌈',
    ]) {
      expect(translateText(text, 'ur')).not.toBe(text);
    }
  });

  it('translates every alphabet example word and animal currently in the app', () => {
    for (const item of alphabet) expect(translateLearningWord(item.word, 'ur')).not.toBe(item.word);
    for (const animal of animals) expect(translateText(animal.name, 'ur')).not.toBe(animal.name);
  });

  it('selects a native Urdu alphabet and Urdu example vocabulary in Urdu mode', () => {
    const urduLetters = getLearningLetters('ur');
    expect(urduLetters.length).toBe(37);
    expect(urduLetters[0]).toMatchObject({ upper: 'ا', lower: 'ا', word: 'انار' });
    expect(new Set(urduLetters.map(letter => letter.upper)).size).toBe(urduLetters.length);
    expect(getLearningLetters('en')[0].upper).toBe('A');
    expect(translateText('Learn ABC', 'ur')).toBe('اردو حروف سیکھیں');
  });

  it('provides direction and speech metadata for each supported language', () => {
    expect(isRTL('ur')).toBe(true);
    expect(isRTL('en')).toBe(false);
    expect(speechLocale('ur')).toBe('ur-PK');
    expect(speechLocale('en')).toBe('en-US');
  });
});
