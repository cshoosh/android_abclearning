export type Progress = {
  onboarded: boolean; nickname: string; avatar: string; stars: number;
  viewedLetters: string[]; tracedLetters: string[]; activities: string[];
  stickers: string[]; premium: boolean; voice: boolean; music: boolean; effects: boolean;
};
export const initialProgress: Progress = {
  onboarded: false, nickname: '', avatar: '🦁', stars: 0, viewedLetters: [],
  tracedLetters: [], activities: [], stickers: [], premium: false,
  voice: true, music: false, effects: true,
};
