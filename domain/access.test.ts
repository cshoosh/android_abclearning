import { canAccessAnimal, canAccessLetter, canAccessMiniGame, gridColumns, hasEarnedSticker, holdOpensParentGate } from './access';

describe('content access', () => {
  test('free alphabet stops at F; premium opens all letters', () => {
    expect(canAccessLetter(5, false)).toBe(true);
    expect(canAccessLetter(6, false)).toBe(false);
    expect(canAccessLetter(25, true)).toBe(true);
  });
  test('free plan has a small animal set and one mini-game', () => {
    expect(canAccessAnimal(5, false)).toBe(true);
    expect(canAccessAnimal(6, false)).toBe(false);
    expect(canAccessMiniGame(0, false)).toBe(true);
    expect(canAccessMiniGame(1, false)).toBe(false);
    expect(canAccessMiniGame(2, true)).toBe(true);
  });
});
describe('play helpers', () => {
  test('uses more columns at tablet sizes while keeping phone grid at two', () => {
    expect(gridColumns(360)).toBe(2);
    expect(gridColumns(800)).toBe(3);
    expect(gridColumns(1280)).toBe(4);
  });
  test('only reports earned stickers that are actually in local progress', () => {
    expect(hasEarnedSticker(['Bear'], 'Bear')).toBe(true);
    expect(hasEarnedSticker(['Bear'], 'Cat')).toBe(false);
  });
  test('parent gate requires a deliberate three-second hold', () => {
    expect(holdOpensParentGate(2999)).toBe(false);
    expect(holdOpensParentGate(3000)).toBe(true);
  });
});
