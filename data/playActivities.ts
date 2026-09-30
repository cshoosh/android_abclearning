export const homeChoices = [
  { id: 'jungle', name: 'Jungle', emoji: '🌴' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊' },
  { id: 'farm', name: 'Farm', emoji: '🚜' },
  { id: 'home', name: 'Home', emoji: '🏠' },
] as const;

export const animalHomeRounds = [
  { animal: 'Lion', emoji: '🦁', home: 'jungle' },
  { animal: 'Monkey', emoji: '🐵', home: 'jungle' },
  { animal: 'Dolphin', emoji: '🐬', home: 'ocean' },
  { animal: 'Turtle', emoji: '🐢', home: 'ocean' },
  { animal: 'Cow', emoji: '🐮', home: 'farm' },
  { animal: 'Sheep', emoji: '🐑', home: 'farm' },
  { animal: 'Cat', emoji: '🐱', home: 'home' },
  { animal: 'Dog', emoji: '🐶', home: 'home' },
] as const;

export const memoryAnimals = [
  { name: 'Lion', emoji: '🦁' },
  { name: 'Elephant', emoji: '🐘' },
  { name: 'Monkey', emoji: '🐵' },
  { name: 'Panda', emoji: '🐼' },
  { name: 'Giraffe', emoji: '🦒' },
  { name: 'Turtle', emoji: '🐢' },
  { name: 'Rabbit', emoji: '🐰' },
  { name: 'Dolphin', emoji: '🐬' },
] as const;

export const countRounds = [
  { friend: 'Lion', friendEmoji: '🦁', food: 'apples', foodEmoji: '🍎', target: 2 },
  { friend: 'Monkey', friendEmoji: '🐵', food: 'bananas', foodEmoji: '🍌', target: 3 },
  { friend: 'Panda', friendEmoji: '🐼', food: 'bamboo', foodEmoji: '🎋', target: 4 },
  { friend: 'Rabbit', friendEmoji: '🐰', food: 'carrots', foodEmoji: '🥕', target: 3 },
] as const;
