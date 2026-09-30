export const FREE_LETTER_COUNT = 6;
export function canAccessLetter(index: number, premium: boolean): boolean { return premium || index < FREE_LETTER_COUNT; }
export function canAccessAnimal(index: number, premium: boolean): boolean { return premium || index < FREE_LETTER_COUNT; }
export function canAccessMiniGame(index: number, premium: boolean): boolean { return premium || index === 0; }
export function gridColumns(width: number): number { return width >= 1000 ? 4 : width >= 600 ? 3 : 2; }
export function hasEarnedSticker(stickers: readonly string[], animal: string): boolean { return stickers.includes(animal); }
export function holdOpensParentGate(durationMs: number): boolean { return durationMs >= 3000; }
