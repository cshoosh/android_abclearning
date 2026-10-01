import type { AppLanguage } from '../localization';

const stickerFacts: Record<string, { en: string; ur: string }> = {
  Alligator: { en: 'Alligators use their strong tails to swim.', ur: 'الیگیٹر اپنی مضبوط دم سے تیرتا ہے۔' },
  Bear: { en: 'Bears have a very good sense of smell.', ur: 'ریچھ کی سونگھنے کی حس بہت تیز ہوتی ہے۔' },
  Cat: { en: 'A happy cat may purr softly.', ur: 'خوش بلی آہستہ سے خرخراتی ہے۔' },
  Dog: { en: 'Dogs use their noses to explore the world.', ur: 'کتا اپنی ناک سے دنیا کو پہچانتا ہے۔' },
  Elephant: { en: 'An elephant uses its trunk to pick things up.', ur: 'ہاتھی اپنی سونڈ سے چیزیں اٹھاتا ہے۔' },
  Frog: { en: 'Many frogs begin life as tadpoles in water.', ur: 'بہت سے مینڈک اپنی زندگی پانی میں ٹیڈپول بن کر شروع کرتے ہیں۔' },
  Giraffe: { en: 'A giraffe uses its long neck to reach tall leaves.', ur: 'زرافہ اپنی لمبی گردن سے اونچے پتے کھاتا ہے۔' },
  Hippo: { en: 'Hippos spend lots of time in the water.', ur: 'دریائی گھوڑا کافی وقت پانی میں گزارتا ہے۔' },
  Iguana: { en: 'Iguanas like to warm up in the sunshine.', ur: 'آئیگوانا دھوپ میں اپنے جسم کو گرم کرنا پسند کرتا ہے۔' },
  Jaguar: { en: 'A jaguar’s spots help it blend into the forest.', ur: 'جیگوار کے دھبے اسے جنگل میں چھپنے میں مدد دیتے ہیں۔' },
  Koala: { en: 'Koalas eat eucalyptus leaves.', ur: 'کوآلا یوکلپٹس کے پتے کھاتا ہے۔' },
  Lion: { en: 'A lion’s big mane frames its face.', ur: 'شیر کی بڑی ایال اس کے چہرے کے گرد ہوتی ہے۔' },
  Monkey: { en: 'Many monkeys use their hands to climb trees.', ur: 'بہت سے بندر ہاتھوں سے درختوں پر چڑھتے ہیں۔' },
  Newt: { en: 'Newts are small animals that can live in water and on land.', ur: 'نیوٹ چھوٹا جانور ہے جو پانی اور خشکی دونوں پر رہ سکتا ہے۔' },
  Owl: { en: 'An owl can turn its head to look around.', ur: 'الو اردگرد دیکھنے کے لیے اپنا سر گھما سکتا ہے۔' },
  Panda: { en: 'Giant pandas love munching on bamboo.', ur: 'جائنٹ پانڈا بانس چبانا پسند کرتا ہے۔' },
  Quail: { en: 'Quails are small birds that make their nests on the ground.', ur: 'بٹیر چھوٹا پرندہ ہے جو زمین پر گھونسلا بناتا ہے۔' },
  Rabbit: { en: 'A rabbit’s long ears help it hear quiet sounds.', ur: 'خرگوش کے لمبے کان ہلکی آوازیں سننے میں مدد دیتے ہیں۔' },
  Snake: { en: 'Snakes move by slithering along the ground.', ur: 'سانپ زمین پر بل کھا کر چلتا ہے۔' },
  Turtle: { en: 'A turtle’s shell helps protect its body.', ur: 'کچھوے کا خول اس کے جسم کی حفاظت کرتا ہے۔' },
  Unicorn: { en: 'Unicorns are magical creatures from stories.', ur: 'یونیکورن کہانیوں کی ایک جادوئی مخلوق ہے۔' },
  Vulture: { en: 'Vultures help nature by cleaning up animal remains.', ur: 'گدھ جانوروں کی باقیات صاف کرکے قدرت کی مدد کرتا ہے۔' },
  Whale: { en: 'Whales breathe air and come to the surface for a breath.', ur: 'وہیل ہوا میں سانس لیتی ہے اور سانس لینے کے لیے پانی کی سطح پر آتی ہے۔' },
  'X-ray fish': { en: 'The X-ray tetra is a tiny fish with a see-through body.', ur: 'ایکس رے ٹیٹرا چھوٹی مچھلی ہے جس کا جسم شفاف ہوتا ہے۔' },
  Yak: { en: 'A yak’s thick coat keeps it warm in the mountains.', ur: 'یاک کی گھنی کھال اسے پہاڑوں میں گرم رکھتی ہے۔' },
  Zebra: { en: 'Every zebra has its own pattern of stripes.', ur: 'ہر زیبرا کی دھاریوں کا انداز الگ ہوتا ہے۔' },
};

export function getStickerFact(animalName: string, language: AppLanguage): string {
  const fact = stickerFacts[animalName];
  return fact ? fact[language] : '';
}
