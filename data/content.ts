export type Letter = { upper: string; lower: string; word: string; emoji: string; animal?: string };
export const alphabet: Letter[] = [
  ['A','a','Apple','🍎','Alligator'],['B','b','Ball','⚽','Bear'],['C','c','Cat','🐱','Cat'],['D','d','Dog','🐶','Dog'],['E','e','Elephant','🐘','Elephant'],['F','f','Frog','🐸','Frog'],['G','g','Giraffe','🦒','Giraffe'],['H','h','House','🏠','Hippo'],['I','i','Ice cream','🍦','Iguana'],['J','j','Jellyfish','🪼','Jaguar'],['K','k','Kite','🪁','Koala'],['L','l','Lion','🦁','Lion'],['M','m','Monkey','🐵','Monkey'],['N','n','Nest','🪺','Newt'],['O','o','Owl','🦉','Owl'],['P','p','Panda','🐼','Panda'],['Q','q','Queen','👑','Quail'],['R','r','Rabbit','🐰','Rabbit'],['S','s','Sun','☀️','Snake'],['T','t','Turtle','🐢','Turtle'],['U','u','Umbrella','☂️','Unicorn'],['V','v','Violin','🎻','Vulture'],['W','w','Whale','🐳','Whale'],['X','x','Xylophone','🎼','Fox'],['Y','y','Yo-yo','🪀','Yak'],['Z','z','Zebra','🦓','Zebra'],
].map(([upper,lower,word,emoji,animal]) => ({upper,lower,word,emoji,animal}));
export const animals = [
  ['Lion','🦁','#FFE2A7'],['Elephant','🐘','#D8EEFF'],['Monkey','🐵','#FAD8BA'],['Panda','🐼','#E7E9FF'],['Giraffe','🦒','#FFF0B8'],['Zebra','🦓','#E7F4F0'],['Bear','🐻','#F4DDCB'],['Rabbit','🐰','#FCE1EE'],['Cat','🐱','#FFE4CF'],['Dog','🐶','#E6E6FF'],['Penguin','🐧','#D9F1FF'],['Frog','🐸','#DAF8D8'],['Fox','🦊','#FFE1CC'],['Owl','🦉','#E8DFFF'],['Dolphin','🐬','#D6F5FF'],['Turtle','🐢','#D8F3C9'],
].map(([name,emoji,color]) => ({name,emoji,color}));
export const colorsAndShapes = [
  {name:'Red',emoji:'🔴',color:'#FF7777'},{name:'Blue',emoji:'🔵',color:'#67C5F0'},{name:'Yellow',emoji:'🟡',color:'#FFD34F'},{name:'Green',emoji:'🟢',color:'#69CB89'},{name:'Orange',emoji:'🟠',color:'#FF9956'},{name:'Purple',emoji:'🟣',color:'#AA8BEF'},{name:'Pink',emoji:'💗',color:'#F28EB5'},
  {name:'Circle',emoji:'⚪',color:'#D8ECF5'},{name:'Square',emoji:'🟦',color:'#70C5EB'},{name:'Triangle',emoji:'🔺',color:'#FF9B60'},{name:'Star',emoji:'⭐',color:'#FFD34F'},{name:'Rectangle',emoji:'🟪',color:'#A98AEF'},{name:'Heart',emoji:'❤️',color:'#FF7E7E'},
];
export const activities = [
  {id:'learn',title:'Learn ABC',subtitle:'Letters & words',emoji:'🔤',color:'#FAD35C',route:'/learn'},
  {id:'trace',title:'Trace Letters',subtitle:'Draw with a finger',emoji:'✍️',color:'#B39BF2',route:'/tracing'},
  {id:'animals',title:'Animal Sounds',subtitle:'Meet animal friends',emoji:'🦁',color:'#80D8A0',route:'/animals'},
  {id:'find',title:'Find the Letter',subtitle:'Listen and tap',emoji:'🔎',color:'#77CDED',route:'/find-letter'},
  {id:'match',title:'Match Game',subtitle:'Pair letters & animals',emoji:'🧩',color:'#FFA979',route:'/matching'},
  {id:'colors',title:'Colors & Shapes',subtitle:'See, say and play',emoji:'🎨',color:'#F49CC4',route:'/colors-shapes'},
  {id:'games',title:'Mini Games',subtitle:'Three playful games',emoji:'🎈',color:'#91C8F7',route:'/games'},
  {id:'stickers',title:'Sticker Book',subtitle:'Your animal friends',emoji:'⭐',color:'#A8D881',route:'/stickers'},
];
