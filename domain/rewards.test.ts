import { initialProgress } from '../types/progress';
import { buildReward } from './rewards';

describe('local reward system', () => {
  test('a completed activity adds a star and relevant sticker', () => {
    const next = buildReward(initialProgress, 'trace', 'B');
    expect(next.stars).toBe(1);
    expect(next.stickers).toContain('Bear');
    expect(next.tracedLetters).toContain('B');
    expect(next.activities).toContain('trace');
  });
  test('repeat play keeps sticker and activity lists unique', () => {
    const first = buildReward(initialProgress, 'match', 'C');
    const second = buildReward(first, 'match', 'C');
    expect(second.stars).toBe(2);
    expect(second.stickers.filter(item => item === 'Cat')).toHaveLength(1);
    expect(second.activities.filter(item => item === 'match')).toHaveLength(1);
  });
});
