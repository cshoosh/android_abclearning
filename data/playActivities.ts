import { alphabet, animals } from './content';

export const homeChoices = [
  { id: 'jungle', name: 'Jungle', emoji: '🌴' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊' },
  { id: 'farm', name: 'Farm', emoji: '🚜' },
  { id: 'home', name: 'Home', emoji: '🏠' },
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'pond', name: 'Pond', emoji: '🪷' },
  { id: 'savanna', name: 'Savanna', emoji: '🦓' },
  { id: 'grassland', name: 'Grassland', emoji: '🌾' },
  { id: 'mountains', name: 'Mountains', emoji: '⛰️' },
] as const;

type HabitatId = (typeof homeChoices)[number]['id'];
const habitatByAnimal: Record<string, HabitatId> = {
  Alligator: 'pond',
  Bear: 'forest',
  Cat: 'home',
  Dog: 'home',
  Elephant: 'savanna',
  Frog: 'pond',
  Giraffe: 'savanna',
  Hippo: 'pond',
  Iguana: 'jungle',
  Jaguar: 'jungle',
  Koala: 'forest',
  Lion: 'savanna',
  Monkey: 'jungle',
  Newt: 'pond',
  Owl: 'forest',
  Panda: 'forest',
  Quail: 'farm',
  Rabbit: 'grassland',
  Snake: 'jungle',
  Turtle: 'pond',
  Unicorn: 'forest',
  Vulture: 'savanna',
  Whale: 'ocean',
  'X-ray fish': 'ocean',
  Yak: 'mountains',
  Zebra: 'savanna',
};

export function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

export function createAnimalHomeRounds(previousAnimal?: string) {
  const rounds = shuffled(animals.map(({ name, emoji }) => {
    const home = habitatByAnimal[name];
    if (!home) throw new Error(`Missing habitat for ${name}`);

    const answer = homeChoices.find(choice => choice.id === home);
    if (!answer) throw new Error(`Unknown habitat ${home} for ${name}`);
    const distractors = shuffled(homeChoices.filter(choice => choice.id !== home)).slice(0, 3);

    return { animal: name, emoji, home, choices: shuffled([answer, ...distractors]) };
  }));

  if (rounds.length > 1 && rounds[0].animal === previousAnimal) {
    [rounds[0], rounds[1]] = [rounds[1], rounds[0]];
  }

  return rounds;
}

export function createMatchingRounds(previousAnimal?: string) {
  const rounds = shuffled(alphabet.flatMap(letter => {
    const animal = animals.find(item => item.name === letter.animal);
    return animal ? [{ letter, animal }] : [];
  }));

  if (rounds.length > 1 && rounds[0].animal.name === previousAnimal) {
    [rounds[0], rounds[1]] = [rounds[1], rounds[0]];
  }

  return rounds;
}

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

type FeedingFood = { food: string; foodEmoji: string; target: number };

const foodByAnimal: Record<string, FeedingFood> = {
  Alligator: { food: 'fish', foodEmoji: '🐟', target: 2 },
  Bear: { food: 'berries', foodEmoji: '🫐', target: 3 },
  Cat: { food: 'fish', foodEmoji: '🐟', target: 2 },
  Dog: { food: 'bones', foodEmoji: '🦴', target: 3 },
  Elephant: { food: 'leaves', foodEmoji: '🍃', target: 3 },
  Frog: { food: 'bugs', foodEmoji: '🐛', target: 2 },
  Giraffe: { food: 'leaves', foodEmoji: '🍃', target: 3 },
  Hippo: { food: 'grass', foodEmoji: '🌿', target: 3 },
  Iguana: { food: 'leafy greens', foodEmoji: '🥬', target: 2 },
  Jaguar: { food: 'pieces of meat', foodEmoji: '🥩', target: 2 },
  Koala: { food: 'eucalyptus leaves', foodEmoji: '🍃', target: 3 },
  Lion: { food: 'pieces of meat', foodEmoji: '🥩', target: 2 },
  Monkey: { food: 'bananas', foodEmoji: '🍌', target: 3 },
  Newt: { food: 'worms', foodEmoji: '🪱', target: 2 },
  Owl: { food: 'mice', foodEmoji: '🐭', target: 2 },
  Panda: { food: 'bamboo', foodEmoji: '🎋', target: 4 },
  Quail: { food: 'seeds', foodEmoji: '🌾', target: 3 },
  Rabbit: { food: 'carrots', foodEmoji: '🥕', target: 3 },
  Snake: { food: 'mice', foodEmoji: '🐭', target: 2 },
  Turtle: { food: 'leafy greens', foodEmoji: '🥬', target: 3 },
  Unicorn: { food: 'magic apples', foodEmoji: '🍎', target: 2 },
  Vulture: { food: 'pieces of meat', foodEmoji: '🥩', target: 2 },
  Whale: { food: 'krill', foodEmoji: '🦐', target: 3 },
  'X-ray fish': { food: 'fish flakes', foodEmoji: '🐟', target: 3 },
  Yak: { food: 'grass', foodEmoji: '🌿', target: 3 },
  Zebra: { food: 'grass', foodEmoji: '🌿', target: 3 },
};

export function createCountRounds(previousFriend?: string) {
  const rounds = animals.map(({ name, emoji }) => {
    const food = foodByAnimal[name];
    if (!food) throw new Error(`Missing feeding food for ${name}`);
    return { friend: name, friendEmoji: emoji, ...food };
  });

  for (let index = rounds.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [rounds[index], rounds[randomIndex]] = [rounds[randomIndex], rounds[index]];
  }

  if (rounds.length > 1 && rounds[0].friend === previousFriend) {
    [rounds[0], rounds[1]] = [rounds[1], rounds[0]];
  }

  return rounds;
}
