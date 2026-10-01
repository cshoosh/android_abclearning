import { createMiniGameRound, miniGames } from './miniGames';

describe('dynamic mini-game rounds', () => {
  test.each(miniGames)('$title generates four unique options with one correct answer', game => {
    const round = createMiniGameRound(game.id, undefined, () => 0.37);
    expect(round.options).toHaveLength(4);
    expect(new Set(round.options.map(option => option.id)).size).toBe(4);
    expect(round.options.filter(option => option.id === round.answerId)).toHaveLength(1);
  });

  test.each(miniGames)('$title avoids repeating the previous target when possible', game => {
    const first = createMiniGameRound(game.id, undefined, () => 0);
    const second = createMiniGameRound(game.id, first.targetId, () => 0);
    expect(second.targetId).not.toBe(first.targetId);
  });

  test('uses lowercase answer ids for lowercase letter bubbles', () => {
    const round = createMiniGameRound('letter-bubbles', undefined, () => 0);
    expect(round.answerId).toBe(round.targetId.toLowerCase());
    expect(round.options.some(option => option.id === round.answerId)).toBe(true);
  });

  test('animal matching asks for the animal name’s first letter', () => {
    const round = createMiniGameRound('animal-match', undefined, () => 0);
    expect(round.answerId).toBe(round.targetId[0]);
    expect(round.options.some(option => option.id === round.answerId)).toBe(true);
  });

  test('letter, animal, and counting rounds can use content across their full pools', () => {
    expect(createMiniGameRound('balloon-pop', undefined, () => 0.99).targetId).toBe('Z');
    expect(createMiniGameRound('animal-puzzle', undefined, () => 0.99).targetId).toBe('Turtle');
    expect(createMiniGameRound('count-stars', undefined, () => 0.99).targetId).toBe('10');
  });

  test('Urdu letter games use Urdu letters and native Urdu example words', () => {
    const balloon = createMiniGameRound('balloon-pop', undefined, () => 0, 'ur');
    const firstLetter = createMiniGameRound('first-letter', undefined, () => 0, 'ur');
    const bubbles = createMiniGameRound('letter-bubbles', undefined, () => 0, 'ur');

    expect(balloon.targetId).toBe('ا');
    expect(balloon.options.map(option => option.id)).toContain('ا');
    expect(firstLetter.visual.text).toBe('انار');
    expect(firstLetter.answerId).toBe(firstLetter.visual.text?.[0]);
    expect(bubbles.answerId).toBe(bubbles.targetId);
    expect(bubbles.options.map(option => option.label)).not.toContain('a');
  });

  test('Urdu animal matching asks for the first Urdu letter', () => {
    const round = createMiniGameRound('animal-match', undefined, () => 0, 'ur');
    expect(round.answerId).toBe('ش');
    expect(round.options.some(option => option.id === 'ش')).toBe(true);
  });
});
