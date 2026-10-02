export type Letter = { upper: string; lower: string; word: string; emoji: string; animal?: string; animalEmoji?: string };
const englishAlphabetEntries: Array<[string, string, string, string, string, string]> = [
  ['A','a','Apple','🍎','Alligator','🐊'],['B','b','Ball','⚽','Bear','🐻'],['C','c','Cookie','🍪','Cat','🐱'],['D','d','Drum','🥁','Dog','🐶'],
  ['E','e','Egg','🥚','Elephant','🐘'],['F','f','Flower','🌼','Frog','🐸'],['G','g','Giraffe','🦒','Giraffe','🦒'],['H','h','House','🏠','Hippo','🦛'],
  ['I','i','Ice cream','🍦','Iguana','🦎'],['J','j','Jellyfish','🪼','Jaguar','🐆'],['K','k','Kite','🪁','Koala','🐨'],['L','l','Leaf','🍃','Lion','🦁'],
  ['M','m','Moon','🌙','Monkey','🐵'],['N','n','Nest','🪺','Newt','🦎'],['O','o','Orange','🍊','Owl','🦉'],['P','p','Pizza','🍕','Panda','🐼'],
  ['Q','q','Queen','👑','Quail','🐦'],['R','r','Rose','🌹','Rabbit','🐰'],['S','s','Sun','☀️','Snake','🐍'],['T','t','Train','🚂','Turtle','🐢'],
  ['U','u','Umbrella','☂️','Unicorn','🦄'],['V','v','Violin','🎻','Vulture','🦅'],['W','w','Water','💧','Whale','🐳'],['X','x','Xylophone','🎼','X-ray fish','🐟'],
  ['Y','y','Yo-yo','🪀','Yak','🐂'],['Z','z','Zoo','🦒','Zebra','🦓'],
];
export const alphabet: Letter[] = englishAlphabetEntries.map(([upper, lower, word, emoji, animal, animalEmoji]) => ({ upper, lower, word, emoji, animal, animalEmoji }));
const animalCardColors: Record<string, string> = {
  Alligator: '#DDF2D1', Bear: '#F4DDCB', Cat: '#FFE4CF', Dog: '#E6E6FF', Elephant: '#D8EEFF', Frog: '#DAF8D8',
  Giraffe: '#FFF0B8', Hippo: '#DDEBFA', Iguana: '#E2F3D2', Jaguar: '#FFE2A7', Koala: '#E8E8E8', Lion: '#FFF0B5',
  Monkey: '#FAD8BA', Newt: '#D9F2EB', Owl: '#E8DFFF', Panda: '#E7E9FF', Quail: '#FFF1D7', Rabbit: '#FCE1EE',
  Snake: '#DDF2D1', Turtle: '#D8F3C9', Unicorn: '#F1E4FF', Vulture: '#E7E4DA', Whale: '#D6F5FF',
  'X-ray fish': '#D6F5FF', Yak: '#E8DFCF', Zebra: '#E7F4F0',
};

// Keep Animal Friends in the same order and vocabulary as the English A–Z.
export const animals = alphabet.flatMap(letter => letter.animal && letter.animalEmoji
  ? [{ name: letter.animal, emoji: letter.animalEmoji, color: animalCardColors[letter.animal] ?? '#EAF2F5' }]
  : []);
export const colorsAndShapes = [
  {name:'Red',emoji:'🔴',color:'#FF7777'},{name:'Blue',emoji:'🔵',color:'#67C5F0'},{name:'Yellow',emoji:'🟡',color:'#FFD34F'},{name:'Green',emoji:'🟢',color:'#69CB89'},{name:'Orange',emoji:'🟠',color:'#FF9956'},{name:'Purple',emoji:'🟣',color:'#AA8BEF'},{name:'Pink',emoji:'💗',color:'#F28EB5'},
  {name:'Circle',emoji:'⚪',color:'#D8ECF5'},{name:'Square',emoji:'🟦',color:'#70C5EB'},{name:'Triangle',emoji:'🔺',color:'#FF9B60'},{name:'Star',emoji:'⭐',color:'#FFD34F'},{name:'Rectangle',emoji:'🟪',color:'#A98AEF'},{name:'Heart',emoji:'❤️',color:'#FF7E7E'},
];
export const activities = [
  {id:'learn',title:'Learn ABC',subtitle:'Letters & words',emoji:'🔤',color:'#FAD35C',route:'/learn'},
  {id:'trace',title:'Trace Letters',subtitle:'Draw with a finger',emoji:'✍️',color:'#B39BF2',route:'/tracing'},
  {id:'animals',title:'Animal Sounds',subtitle:'Meet A to Z animal friends',emoji:'🦁',color:'#80D8A0',route:'/animals'},
  {id:'find',title:'Find the Letter',subtitle:'Listen and tap',emoji:'🔎',color:'#77CDED',route:'/find-letter'},
  {id:'match',title:'Match Game',subtitle:'Pair letters & animals',emoji:'🧩',color:'#FFA979',route:'/matching'},
  {id:'colors',title:'Colors & Shapes',subtitle:'See, say and play',emoji:'🎨',color:'#F49CC4',route:'/colors-shapes'},
  {id:'games',title:'Mini Games',subtitle:'Eight changing mini-games',emoji:'🎈',color:'#91C8F7',route:'/games'},
  {id:'stickers',title:'Sticker Book',subtitle:'Your animal friends',emoji:'⭐',color:'#A8D881',route:'/stickers'},
  {id:'counting',title:'Count & Feed',subtitle:'Feed a hungry friend',emoji:'🍎',color:'#FFD17A',route:'/counting'},
  {id:'animal-homes',title:'Animal Homes',subtitle:'Find where friends live',emoji:'🏡',color:'#B8E8D1',route:'/animal-homes'},
  {id:'memory',title:'Memory Match',subtitle:'Find the animal twins',emoji:'🃏',color:'#D9C6FF',route:'/memory'},
];
