import { alphabet as englishAlphabet, type Letter } from './content';
import type { AppLanguage } from '../localization';

// Urdu has no uppercase/lowercase distinction, so both fields contain the
// same character. The example word and picture are native Urdu vocabulary.
export const urduAlphabet: Letter[] = [
  ['ا', 'انار', '🍎'], ['آ', 'آم', '🥭'], ['ب', 'بکری', '🐐'], ['پ', 'پتنگ', '🪁'],
  ['ت', 'تتلی', '🦋'], ['ٹ', 'ٹماٹر', '🍅'], ['ث', 'ثمر', '🍇'], ['ج', 'جہاز', '✈️'],
  ['چ', 'چڑیا', '🐦'], ['ح', 'حلوہ', '🍬'], ['خ', 'خرگوش', '🐰'], ['د', 'درخت', '🌳'],
  ['ڈ', 'ڈبہ', '📦'], ['ذ', 'ذہین', '🧠'], ['ر', 'رکشہ', '🛺'], ['ڑ', 'گاڑی', '🚗'],
  ['ز', 'زرافہ', '🦒'], ['ژ', 'ژالہ', '🌨️'], ['س', 'سیب', '🍎'], ['ش', 'شیر', '🦁'],
  ['ص', 'صابن', '🧼'], ['ض', 'ضد', '😠'], ['ط', 'طوطا', '🦜'], ['ظ', 'ظرف', '🏺'],
  ['ع', 'عینک', '👓'], ['غ', 'غبارہ', '🎈'], ['ف', 'فانوس', '🏮'], ['ق', 'قلم', '✏️'],
  ['ک', 'کتاب', '📚'], ['گ', 'گلاب', '🌹'], ['ل', 'لیموں', '🍋'], ['م', 'مچھلی', '🐟'],
  ['ن', 'ناک', '👃'], ['و', 'وردی', '🧥'], ['ہ', 'ہاتھی', '🐘'], ['ی', 'یاقوت', '💎'],
  ['ے', 'گھوڑے', '🐴'],
].map(([upper, word, emoji]) => ({ upper, lower: upper, word, emoji }));

export function getLearningLetters(language: AppLanguage): readonly Letter[] {
  return language === 'ur' ? urduAlphabet : englishAlphabet;
}

/** Spoken Urdu letter names and vowel marks help the device voice pronounce examples clearly. */
export function getSpokenLetterName(letter: Letter, language: AppLanguage): string {
  if (language === 'ur' && letter.upper === 'آ') return 'اَلِف مَدّہ';
  return letter.upper;
}

export function getSpokenLearningWord(word: string, language: AppLanguage): string {
  if (language !== 'ur') return word;
  if (word === 'پتنگ') return 'پَتَنگ';
  if (word === 'تتلی') return 'تِتلی';
  return word;
}
