import { initialProgress } from '../types/progress';
import { clearPlayProgress } from './progress';

describe('clear play progress', () => {
  test('clears activity history and rewards while keeping premium, profile and settings', () => {
    const next = clearPlayProgress({ ...initialProgress, premium: true, onboarded: true, nickname: 'Sam', stars: 8, stickers: ['Bear'], viewedLetters: ['A'] });
    expect(next.stars).toBe(0);
    expect(next.stickers).toEqual([]);
    expect(next.viewedLetters).toEqual([]);
    expect(next.premium).toBe(true);
    expect(next.onboarded).toBe(true);
    expect(next.nickname).toBe('Sam');
  });
});
