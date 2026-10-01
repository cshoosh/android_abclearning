import { getLocales } from 'expo-localization';

export const languageMetadata = {
  en: { label: 'English', nativeLabel: 'English', direction: 'ltr', speechLocale: 'en-US' },
  ur: { label: 'Urdu', nativeLabel: 'اردو', direction: 'rtl', speechLocale: 'ur-PK' },
} as const;
export type AppLanguage = keyof typeof languageMetadata;
function deviceRegionCode(): string | null | undefined {
  const locale = getLocales()[0];
  return locale?.regionCode ?? locale?.languageRegionCode;
}
export function getSupportedLanguages(regionCode: string | null | undefined = deviceRegionCode()): AppLanguage[] {
  return regionCode?.toUpperCase() === 'PK' ? ['en', 'ur'] : ['en'];
}
export function getLanguageOptions(regionCode?: string | null): Array<{ code: AppLanguage; label: string; nativeLabel: string; direction: string; speechLocale: string }> {
  return getSupportedLanguages(regionCode).map(code => ({ code, ...languageMetadata[code] }));
}
export function normalizeAppLanguage(language: unknown): AppLanguage {
  if (language === 'ur' && getSupportedLanguages().includes('ur')) return 'ur';
  return 'en';
}

const urdu: Record<string, string> = {
  'HELLO, LITTLE EXPLORER': 'سلام، ننھے دوست!',
  'Welcome to ABC Friends!': 'ABC Friends میں خوش آمدید!',
  'Let’s Learn!': 'آؤ سیکھیں!',
  'A happy little world of letters and animals.': 'حروف اور جانوروں کی پیاری سی دنیا۔',
  'Choose a friend': 'اپنا دوست چنیں',
  'Pick an animal to be your little buddy.': 'اپنا جانور دوست چنیں۔',
  'Sound on?': 'آواز سنیں؟',
  'You can change this later with a grown-up.': 'یہ ترتیب بعد میں بڑے بدل سکتے ہیں۔',
  'Next': 'اگلا',
  'Let’s play!': 'چلو کھیلیں!',
  'Sound on': 'آواز چلائیں',
  'Sound off': 'آواز بند کریں',
  'Welcome': 'خوش آمدید',
  'Pick a game to play': 'کھیل چنیں',
  'Tap a picture and let’s play.': 'تصویر چھوئیں اور کھیلیں۔',
  '🔊 Tap me to hear a hello!': '🔊 سلام سننے کے لیے مجھے چھوئیں!',
  'Learn ABC': 'اردو حروف سیکھیں',
  'Letters & words': 'حروف اور لفظ',
  'Trace Letters': 'حروف پر انگلی پھیریں',
  'Draw with a finger': 'انگلی سے بنائیں',
  'Animal Sounds': 'جانوروں کی آوازیں',
  'Meet animal friends': 'جانور دوستوں سے ملیں',
  'Meet A to Z animal friends': 'الف سے ے تک جانور دوستوں سے ملیں',
  'Listen and tap': 'سنیں اور چھوئیں',
  'Match Game': 'جوڑ ملائیں',
  'Pair letters & animals': 'حروف اور جانور ملائیں',
  'Colors & Shapes': 'رنگ اور شکلیں',
  'See, say and play': 'دیکھیں، بولیں، کھیلیں',
  'Mini Games': 'چھوٹے کھیل',
  'Eight changing mini-games': 'آٹھ بدلتے ہوئے چھوٹے کھیل',
  'Sticker Book': 'اسٹیکر کتاب',
  'Your animal friends': 'آپ کے جانور دوست',
  'Feed a hungry friend': 'بھوک دوست کو کھانا دیں',
  'Find where friends live': 'دوستوں کا گھر ڈھونڈیں',
  'Find the animal twins': 'ایک جیسے جانور ڈھونڈیں',
  'Parent': 'والدین',
  'Grown-ups only area': 'صرف بڑوں کے لیے',
  'Hi,': 'سلام،',
  'Parent Dashboard': 'والدین کا صفحہ',
  'Family controls': 'گھر والوں کی ترتیبات',
  'Premium': 'پریمیم',
  '⭐ Premium active': '⭐ پریمیم فعال ہے',
  'Unlock every activity': 'سب سرگرمیاں کھولیں',
  'Progress': 'کارکردگی',
  'See activities and stars': 'سرگرمیاں اور ستارے دیکھیں',
  'Settings': 'ترتیبات',
  'Sound, profile and reset': 'آواز، پروفائل اور ری سیٹ',
  'Privacy & help': 'رازداری اور مدد',
  'Privacy, terms and support': 'رازداری، شرائط اور مدد',
  'Done ✕': 'مکمل ✕',
  'Little explorer': 'ننھا ایکسپلورر',
  'stars ·': 'ستارے ·',
  'activities': 'سرگرمیاں',
  'ABC Friends · Version 1.0.0': 'ABC Friends · ورژن 1.0.0',
  'ABC Friends Premium': 'ABC Friends پریمیم',
  'Child Progress': 'بچے کی سرگرمیاں',
  'Letters explored': 'دیکھے گئے حروف',
  'Letters traced': 'لکھے گئے حروف',
  'Activities played': 'کھیلی گئی سرگرمیاں',
  'Stars earned': 'حاصل ستارے',
  'Progress is stored on this device. It is a play summary, not an educational assessment.': 'سرگرمیاں اسی ڈیوائس میں محفوظ ہیں۔ یہ کھیل کا خلاصہ ہے، تعلیمی جانچ نہیں۔',
  'App language': 'ایپ کی زبان',
  'Language': 'زبان',
  'Close': 'بند کریں',
  'Opens language choices': 'زبان منتخب کرنے کے لیے کھولیں',
  'Choose app language': 'ایپ کی زبان چنیں',
  'Choose the language for this app.': 'ایپ کے لیے زبان چنیں۔',
  'English': 'English',
  'Urdu': 'اردو',
  'Child profile': 'بچے کا پروفائل',
  'Optional nickname': 'اختیاری پیارا نام',
  'Optional child nickname': 'بچے کا پیارا نام',
  'Sound controls': 'آواز کی ترتیبات',
  'Voice': 'بولنے کی آواز',
  'Music': 'موسیقی',
  'Sound effects': 'آواز کے اثرات',
  'ON': 'آن',
  'OFF': 'آف',
  'Turn voice off': 'بولنے کی آواز بند کریں',
  'Turn voice on': 'بولنے کی آواز چلائیں',
  'Reset all progress': 'ساری سرگرمیاں مٹائیں',
  'Reset this device?': 'ڈیوائس کی سرگرمیاں مٹائیں؟',
  'This clears stars, stickers and activity progress. Your profile and Premium access will stay.': 'اس سے ستارے، اسٹیکرز اور سرگرمیاں مٹ جائیں گی۔ پروفائل اور پریمیم برقرار رہیں گے۔',
  'Cancel': 'منسوخ',
  'Reset progress': 'سرگرمیاں مٹائیں',
  'Resetting progress does not cancel a store subscription or purchase.': 'سرگرمیاں مٹانے سے خریداری یا سبسکرپشن منسوخ نہیں ہوتی۔',
  'Please wait…': 'ذرا انتظار کریں…',
  'Child profile and activity stay on this device.': 'بچے کا پروفائل اور سرگرمیاں اسی ڈیوائس پر محفوظ رہتی ہیں۔',
  'Grown-ups': 'والدین',
  'Parent Gate': 'والدین کا دروازہ',
  'For a grown-up: press and hold the button for 3 seconds.': 'والدین: بٹن کو 3 سیکنڈ تک دبا کر رکھیں۔',
  'Hold…': 'دبائے رکھیں…',
  'Hold here': 'یہاں دبائیں',
  'Opening parent area…': 'والدین کا صفحہ کھل رہا ہے…',
  'Children can keep enjoying the activities.': 'بچے سرگرمیوں سے لطف اندوز ہوتے رہیں۔',
  'Privacy & Help': 'رازداری اور مدد',
  'Privacy-first by design': 'رازداری ہماری ترجیح',
  'No child account is required. A child’s optional nickname, avatar, settings, and learning progress stay on this device.': 'بچے کے لیے اکاؤنٹ بنانا ضروری نہیں۔ بچے کا اختیاری نام، اوتار، ترتیبات اور سیکھنے کی پیش رفت اسی ڈیوائس پر رہتی ہے۔',
  'No child account, precise location, contacts, recordings, camera access, behavioral ads or chat. Learning and progress work offline. Purchases and family settings are behind the Parent Gate.': 'بچے کا اکاؤنٹ، درست مقام، رابطے، ریکارڈنگ، کیمرہ، ذاتی اشتہارات یا چیٹ نہیں۔ سیکھنے اور سرگرمیوں کے لیے انٹرنیٹ ضروری نہیں۔ خریداری اور گھر والوں کی ترتیبات والدین کے حصے میں ہیں۔',
  'Read Privacy Policy': 'رازداری کی پالیسی پڑھیں',
  'Email privacy support': 'رازداری کے لیے ای میل کریں',
  'Terms of use': 'استعمال کی شرائط',
  'Contact support': 'مدد سے رابطہ کریں',
  'Find the Letter': 'حرف تلاش کریں',
  'Can you find...': 'کیا آپ ڈھونڈ سکتے ہیں؟',
  '🔊 Listen again': '🔊 دوبارہ سنیں',
  'You found it! ⭐ 🎉': 'مل گیا! ⭐ 🎉',
  'Play again': 'دوبارہ کھیلیں',
  'You found it! Great job!': 'مل گیا! بہت خوب!',
  'Try another one!': 'ایک اور کوشش کریں!',
  "Oopsie! That's okay! Let's try again!": 'ارے! کوئی بات نہیں! چلو دوبارہ کوشش کریں!',
  'Match the Friend': 'جانور سے جوڑیں',
  'Which animal starts with this letter?': 'اس حرف سے کس جانور کا نام شروع ہوتا ہے؟',
  'Tap the animal whose name starts with this letter': 'اس حرف سے شروع ہونے والا جانور چنیں',
  '🔊 Listen': '🔊 سنیں',
  'Tap the matching animal': 'صحیح جانور کو چھوئیں',
  'A perfect match!': 'بالکل صحیح جوڑ!',
  'Keep looking!': 'تلاش جاری رکھیں!',
  '⭐ Well matched! ⭐': '⭐ خوب جوڑا! ⭐',
  'Next match': 'اگلا جوڑ',
  'Trace a Letter': 'حرف بنائیں',
  'ABC': 'بڑے حروف',
  'abc': 'چھوٹے حروف',
  'Wonderful tracing!': 'بہت خوب حرف بنایا!',
  'Start at the little star ⭐': 'چھوٹے ستارے سے شروع کریں ⭐',
  'Trace anywhere on the big letter. Little lines are okay!': 'بڑے حرف پر انگلی پھیریں۔ چھوٹی لکیریں بھی ٹھیک ہیں!',
  'Trace the whole letter to fill it in!': 'حرف کو مکمل رنگنے کے لیے اس کی پوری شکل پر انگلی پھیریں!',
  'Trace the big letter with your finger to earn a star!': 'ستارہ حاصل کرنے کے لیے بڑے حرف پر انگلی پھیریں!',
  'You earned a star! Trace the next letter.': 'آپ نے ستارہ حاصل کیا! اگلا حرف بنائیں۔',
  'Follow the letter shape. Little lines are okay!': 'حرف کی شکل کے ساتھ انگلی پھیریں۔ چھوٹی لکیریں بھی ٹھیک ہیں!',
  'Clear': 'صاف کریں',
  'Animal Friends': 'جانور دوست',
  'Tap a friend to hear their sound!': 'جانور کی آواز سننے کے لیے اسے چھوئیں!',
  'Tap an animal with 🔊 to hear its sound!': '🔊 والے جانور کو چھو کر اس کی آواز سنیں!',
  'More friends': 'مزید دوست',
  'More letters are waiting!': 'مزید حروف آپ کے منتظر ہیں!',
  'Ask a grown-up to open the Parent area.': 'والدین سے کہیں کہ مزید حروف کھول دیں۔',
  'For grown-ups': 'والدین کے لیے',
  'Back': 'واپس',
  'Your little collection': 'آپ کا پیارا مجموعہ',
  'Locked': 'بند',
  'Keep playing to earn animal stickers! 🐾': 'کھیلتے رہیں اور جانوروں کے اسٹیکر جیتیں! 🐾',
  'Colors': 'رنگ',
  'Shapes': 'شکلیں',
  'Tap each one and say it together!': 'ہر چیز کو چھوئیں اور نام ساتھ بولیں!',
  'More to explore': 'اور بھی ہے',
  'That’s': 'یہ ہے',
  'Red': 'سرخ', 'Blue': 'نیلا', 'Yellow': 'پیلا', 'Green': 'سبز', 'Orange': 'نارنجی', 'Purple': 'جامنی', 'Pink': 'گلابی',
  'Circle': 'دائرہ', 'Square': 'مربع', 'Triangle': 'تکون', 'Star': 'ستارہ', 'Rectangle': 'مستطیل', 'Heart': 'دل',
  'Alligator': 'الیگیٹر', 'Hippo': 'دریائی گھوڑا', 'Iguana': 'آئیگوانا', 'Jaguar': 'جیگوار', 'Koala': 'کوآلا', 'Newt': 'نیوٹ', 'Quail': 'بٹیر', 'Snake': 'سانپ', 'Unicorn': 'یونیکورن', 'Vulture': 'گدھ', 'Whale': 'وہیل', 'X-ray fish': 'ایکس رے مچھلی', 'Yak': 'یاک',
  'Lion': 'شیر', 'Elephant': 'ہاتھی', 'Monkey': 'بندر', 'Panda': 'پانڈا', 'Giraffe': 'زرافہ', 'Zebra': 'زیبرا', 'Bear': 'ریچھ', 'Rabbit': 'خرگوش', 'Cat': 'بلی', 'Dog': 'کتا', 'Penguin': 'پینگوئن', 'Frog': 'مینڈک', 'Fox': 'لومڑی', 'Owl': 'الو', 'Dolphin': 'ڈولفن', 'Turtle': 'کچھوا', 'Cow': 'گائے', 'Sheep': 'بھیڑ',
  'Jungle': 'گھنا جنگل', 'Ocean': 'سمندر', 'Farm': 'کھیت', 'Home': 'گھر',
  'Forest': 'درختوں والا جنگل', 'Pond': 'تالاب', 'Savanna': 'ساوانا', 'Grassland': 'گھاس کا میدان', 'Mountains': 'پہاڑ',
  'Count & Feed': 'گنیں اور کھلائیں',
  'Can you feed': 'کیا آپ کھانا دے سکتے ہیں؟',
  'Tap': 'چھوئیں',
  'apples': 'سیب', 'magic apples': 'جادوئی سیب', 'bananas': 'کیلے', 'bamboo': 'بانس', 'carrots': 'گاجریں',
  'pieces of meat': 'گوشت کے ٹکڑے', 'fish': 'مچھلی', 'berries': 'بیریاں', 'bones': 'ہڈیاں', 'leaves': 'پتے',
  'bugs': 'کیڑے', 'grass': 'گھاس', 'leafy greens': 'سبز پتوں والی سبزیاں', 'eucalyptus leaves': 'یوکلپٹس کے پتے',
  'worms': 'کیچوے', 'mice': 'چوہے', 'seeds': 'بیج', 'krill': 'کرل', 'fish flakes': 'مچھلی کی خوراک',
  'Add one piece of meat': 'گوشت کا ایک ٹکڑا ڈالیں', 'Add one banana': 'ایک کیلا ڈالیں', 'Add bamboo': 'بانس ڈالیں', 'Add one carrot': 'ایک گاجر ڈالیں',
  '🔊 Hear it': '🔊 سنیں',
  'Tap to feed!': 'کھلانے کے لیے چھوئیں!',
  'Yum yum! ⭐': 'مزے دار! ⭐',
  'Feed another friend': 'دوسرے دوست کو کھلائیں',
  'Grown-up tip: count real snacks together after the game.': 'والدین کے لیے: کھیل کے بعد اصلی کھانے ساتھ گنیں۔',
  'Animal Homes': 'جانوروں کے گھر',
  'Where does this friend live?': 'اس دوست کا گھر کہاں ہے؟',
  'FRIEND': 'دوست',
  'OF': 'میں سے',
  'Hear': 'سنیں:',
  'Next friend': 'اگلا دوست',
  'All friends found a home! ⭐': 'سب دوستوں کو گھر مل گیا! ⭐',
  'Memory Match': 'یادداشت کا کھیل',
  'Find two of the same animal!': 'ایک جیسے دو جانور ڈھونڈیں!',
  'Animal pairs': 'جانوروں کے جوڑے',
  ' of ': ' میں سے ',
  'Turn over animal card': 'جانور کا کارڈ پلٹیں',
  'You found every friend! ⭐': 'آپ نے سب جانور ڈھونڈ لیے! ⭐',
  'Meet new animals': 'نئے جانوروں سے ملیں',
  'Take turns with a grown-up: “What do you think is under this card?”': 'والدین کے ساتھ باری لیں: “آپ کے خیال میں کارڈ کے نیچے کیا ہے؟”',
  'You found the': 'آپ نے ڈھونڈ لیا:',
  'twins!': 'کی جوڑی!',
  'Two different friends. Try again!': 'یہ دونوں الگ ہیں۔ دوبارہ کوشش کریں!',
  'You found every animal pair!': 'آپ نے سب جانوروں کی جوڑیاں ڈھونڈ لیں!',
  'More animal names': 'مزید جانور',
  'stars': 'ستارے',
  'sticker book': 'اسٹیکر کتاب',
  'Find the letter ': 'حرف تلاش کریں: ',
  'Hear the letter ': 'حرف سنیں: ',
  'Hear the letter and word again': 'حرف اور لفظ دوبارہ سنیں',
  'Hear the letter and animal': 'حرف اور جانور سنیں',
  'Hear this letter and word again': 'حرف اور لفظ دوبارہ سنیں',
  'Pop the balloon with...': 'صحیح حرف والا غبارہ پھوڑیں!',
  'Put the animal puzzle together!': 'جانور کی پہیلی پوری کریں!',
  'Tap the bubble with...': 'صحیح حرف والا بلبلہ چھوئیں!',
  'Balloon Pop': 'غبارے پھوڑیں',
  'Animal Match': 'جانور سے حرف ملائیں',
  'First Letter': 'پہلا حرف',
  'Color Pop': 'رنگ چنیں',
  'Shape Hunt': 'شکل ڈھونڈیں',
  'Count the Stars': 'ستارے گنیں',
  'Count': 'گنتی',
  'Listen to the question': 'سوال سنیں',
  'Which letter starts this word?': 'اس لفظ کا پہلا حرف کون سا ہے؟',
  'Which letter starts this animal’s name?': 'اس جانور کے نام کا پہلا حرف کون سا ہے؟',
  'Pick the name of this color': 'اس رنگ کا نام چنیں',
  'Pick the name of this shape': 'اس شکل کا نام چنیں',
  'How many stars?': 'کتنے ستارے ہیں؟',
  'Animal Puzzle': 'جانور کی پہیلی',
  'Letter Bubbles': 'حروف کے بلبلے',
  'Puzzle': 'پہیلی',
  'Bubbles': 'بلبلے',
  'Balloons': 'غبارے',
  'Hooray! You did it!': 'واہ! آپ نے کر دکھایا!',
  'Look for the animal!': 'جانور تلاش کریں!',
  'Keep trying!': 'کوشش جاری رکھیں!',
  'Super play! ⭐': 'زبردست کھیل! ⭐',
  'All 26 letters and tracing': 'تمام 26 حروف اور لکھنے کی مشق',
  '16 animal friends': '16 جانور دوست',
  '26 animal friends': '26 جانور دوست',
  'All games, colors and shapes': 'تمام کھیل، رنگ اور شکلیں',
  'Every sticker': 'تمام اسٹیکر',
  'No advertising': 'اشتہارات نہیں',
  'Open the whole jungle': 'پوری جنگل کی دنیا کھولیں',
  'A one-time purchase · local development mock': 'ایک بار کی خریداری · آزمائشی ورژن',
  'Premium is active on this device ⭐': 'اس ڈیوائس پر پریمیم فعال ہے ⭐',
  'Try Premium': 'پریمیم آزمائیں',
  'Restore purchases': 'خریداری بحال کریں',
  'Back to parent area': 'والدین کے صفحے پر واپس',
  'Development preview: real store purchases need a verified Google Play Billing setup before release.': 'آزمائشی ورژن: ریلیز سے پہلے Google Play خریداریوں کی تصدیق کا انتظام درکار ہے۔',
  'All set!': 'سب تیار ہے!',
  'Not available': 'دستیاب نہیں',
  'Getting our jungle ready…': 'ہماری جنگل کی دنیا تیار ہو رہی ہے…',
  'Tap a letter, picture or animal friend': 'حرف، تصویر یا جانور دوست کو چھوئیں',
  'Finish an activity to earn a star and a sticker reward.': 'سرگرمی مکمل کریں اور ستارہ اور اسٹیکر انعام پائیں۔',
  'Ask a grown-up': 'والدین سے کہیں',
  'Play letter challenge': 'حروف کا کھیل کھیلیں',
  'Play Count & Feed': 'گنیں اور کھلائیں',
  'COLLECTED ✓': 'حاصل کیا ✓',
  'NOT YET': 'ابھی نہیں',
  'Stickers collected': 'حاصل کیے گئے اسٹیکر',
  'Sticker collection progress': 'اسٹیکر جمع کرنے کی پیش رفت',
  'More animal stickers are waiting for a grown-up to unlock.': 'مزید جانوروں کے اسٹیکر والدین کے کھولنے کے منتظر ہیں۔',
  'Premium animal': 'پریمیم جانور',
  'More to explore, locked': 'مزید دیکھیں، بند ہے',
  'Animal puzzle piece': 'جانور کی پہیلی کا ٹکڑا',
  'Hear the counting prompt': 'گنتی کی ہدایت سنیں',
  'Press and hold to enter parent area': 'والدین کے حصے میں جانے کے لیے دبا کر رکھیں',
  'Choose buddy': 'دوست چنیں',
  'A friendly lion mascot': 'دوستانہ شیر کا کردار',
  'Your purchase could not be completed right now.': 'خریداری ابھی مکمل نہیں ہو سکی۔',
  'Please try again': 'دوبارہ کوشش کریں',
  'Purchases are not configured yet.': 'خریداری کی سہولت ابھی تیار نہیں۔',
  'Premium is ready on this device.': 'اس ڈیوائس پر پریمیم تیار ہے۔',
  'Your development purchase was restored.': 'آزمائشی خریداری بحال ہو گئی۔',
  'No verified purchase was found.': 'تصدیق شدہ خریداری نہیں ملی۔',
  'Email address': 'ای میل ایڈریس',
  'letters': 'حروف',
  'Hello': 'سلام',
  'friend': 'دوست',
  'Let’s learn and play together.': 'آئیں ساتھ سیکھیں اور کھیلیں۔',
  'Give': 'دیں',
  'Yummy!': 'مزے دار!',
  'Yes!': 'ہاں!',
  'Let’s try another home.': 'چلیں، دوسرا گھر آزمائیں۔',
};

const wordTranslations: Record<string, string> = {
  Apple: 'سیب', Ball: 'گیند', 'Ice cream': 'آئس کریم', House: 'گھر', Jellyfish: 'جیلی فِش', Kite: 'پتنگ', Nest: 'گھونسلا', Queen: 'ملکہ', Sun: 'سورج', Umbrella: 'چھتری', Violin: 'وائلن', Whale: 'وہیل', Xylophone: 'زائلوفون', 'Yo-yo': 'یو یو', Yak: 'یاک',
};

export function translateText(value: string, language: AppLanguage): string {
  if (language === 'en') return value;
  if (language !== 'ur') return value;
  const leading = value.match(/^\s*/)?.[0] ?? '';
  const trailing = value.match(/\s*$/)?.[0] ?? '';
  const key = value.trim();
  const exact = urdu[key] ?? wordTranslations[key];
  if (exact) return `${leading}${exact}${trailing}`;
  const decorated = key.match(/^([^A-Za-z0-9]+)([A-Za-z0-9].*)$/);
  if (decorated) {
    const translatedContent = translateText(decorated[2], language);
    if (translatedContent !== decorated[2]) return `${leading}${decorated[1]}${translatedContent}${trailing}`;
  }
  const balloonLetter = key.match(/^Pop the balloon with the letter ([A-Z])$/);
  if (balloonLetter) return `حرف ${balloonLetter[1]} والا غبارہ پھوڑیں`;
  const lowercaseLetter = key.match(/^Tap the lowercase letter for ([A-Z])$/);
  if (lowercaseLetter) return `حرف ${lowercaseLetter[1]} کا چھوٹا حرف چھوئیں`;
  const namedAnimal = key.match(/^Tap the animal called (.+)$/);
  if (namedAnimal) return `${urdu[namedAnimal[1]] ?? namedAnimal[1]} والے جانور کو چھوئیں`;
  const animalSound = key.match(/^Hear the sound of (.+)$/);
  if (animalSound) return `${urdu[animalSound[1]] ?? animalSound[1]} کی آواز سنیں`;
  const feedAction = key.match(/^Feed (.+?) (.+)$/);
  if (feedAction && urdu[feedAction[2]]) return `${urdu[feedAction[1]] ?? feedAction[1]} کو ${urdu[feedAction[2]]} کھلائیں`;
  const giveFeed = key.match(/^Give (.+?) (\d+) (.+)$/);
  if (giveFeed && urdu[giveFeed[3]]) return `${urdu[giveFeed[1]] ?? giveFeed[1]} کو ${giveFeed[2]} ${urdu[giveFeed[3]]} دیں`;
  const feedPrompt = key.match(/^Tap (\d+) (.+)!$/);
  if (feedPrompt && urdu[feedPrompt[2]]) return `چھوئیں: ${feedPrompt[1]} ${urdu[feedPrompt[2]]}!`;
  const numbered = key.match(/^(\d+) of (\d+)$/);
  if (numbered) return `${numbered[1]} میں سے ${numbered[2]}`;
  const friendCount = key.match(/^FRIEND (\d+) OF (\d+)$/);
  if (friendCount) return `دوست ${friendCount[1]} میں سے ${friendCount[2]}`;
  const stickerChallenge = key.match(/^Find ([A-Z]) in Find the Letter\. Tap it to earn the (.+) sticker\.$/);
  if (stickerChallenge) return `حرف ${stickerChallenge[1]} تلاش کریں، پھر چھو کر ${urdu[stickerChallenge[2]] ?? stickerChallenge[2]} کا اسٹیکر پائیں۔`;
  const stickerFeed = key.match(/^Play Count & Feed for a star and a surprise sticker\. Keep playing to collect (.+)\.$/);
  if (stickerFeed) return `گنیں اور کھلائیں کھیلیں، ستارہ اور سرپرائز اسٹیکر پائیں۔ ${urdu[stickerFeed[1]] ?? stickerFeed[1]} جمع کرنے کے لیے کھیلتے رہیں۔`;
  const stickerButton = key.match(/^(Ask a grown-up|Play letter challenge|Play Count & Feed) to earn (.+) sticker$/);
  if (stickerButton) return `${urdu[stickerButton[1]] ?? stickerButton[1]}، ${urdu[stickerButton[2]] ?? stickerButton[2]} کا اسٹیکر پانے کے لیے`;
  const hearFindLetter = key.match(/^Hear find ([A-Z])$/);
  if (hearFindLetter) return `حرف ${hearFindLetter[1]} تلاش کرنے کی ہدایت سنیں`;
  const hearLetter = key.match(/^Hear ([A-Z])$/);
  if (hearLetter) return `حرف ${hearLetter[1]} سنیں`;
  const hearTheLetter = key.match(/^Hear the letter ([A-Z])$/);
  if (hearTheLetter) return `حرف ${hearTheLetter[1]} سنیں`;
  const hearAny = key.match(/^Hear (.+)$/);
  if (hearAny) return `${urdu[hearAny[1]] ?? wordTranslations[hearAny[1]] ?? hearAny[1]} سنیں`;
  const letterLabel = key.match(/^Letter ([A-Z])$/);
  if (letterLabel) return `حرف ${letterLabel[1]}`;
  const homeLabel = key.match(/^(.+) home$/);
  if (homeLabel) return `${urdu[homeLabel[1]] ?? homeLabel[1]} کا گھر`;
  const hungryLabel = key.match(/^(.+) is hungry$/);
  if (hungryLabel) return hungryLabel[1] === 'Whale'
    ? 'وہیل بھوکی ہے'
    : `${urdu[hungryLabel[1]] ?? hungryLabel[1]} بھوکا ہے`;
  const plateLabel = key.match(/^Plate: (\d+) of (\d+)$/);
  if (plateLabel) return `پلیٹ: ${plateLabel[1]} میں سے ${plateLabel[2]}`;
  const addFoodLabel = key.match(/^Add one (.+)$/);
  if (addFoodLabel) return `ایک ${urdu[addFoodLabel[1]] ?? addFoodLabel[1]} ڈالیں`;
  const starCount = key.match(/^(\d+) stars$/);
  if (starCount) return `${starCount[1]} ستارے`;
  const findLetter = key.match(/^Find the letter ([A-Z])$/);
  if (findLetter) return `حرف ${findLetter[1]} تلاش کریں`;
  const feedPromptSentence = key.match(/^Can you feed (.+)\?$/);
  if (feedPromptSentence) return `کیا آپ ${urdu[feedPromptSentence[1]] ?? feedPromptSentence[1]} کو کھانا کھلا سکتے ہیں؟`;
  const promptCount = key.match(/^Give (.+) (\d+) (.+)$/);
  if (promptCount) return `${urdu[promptCount[2]] ?? promptCount[2]} ${urdu[promptCount[3]] ?? promptCount[3]} ${urdu[promptCount[1]] ?? promptCount[1]} کو دیں`;
  const matchAnimals = key.match(/^You found the (.+) twins!$/);
  if (matchAnimals) return `آپ نے ${urdu[matchAnimals[1]] ?? matchAnimals[1]} کی جوڑی ڈھونڈ لی!`;
  const numberedStars = key.match(/^(\d+) stars · (\d+) activities$/);
  if (numberedStars) return `${numberedStars[1]} ستارے · ${numberedStars[2]} سرگرمیاں`;
  const joinName = key.match(/^([A-Z]) is for (.+)$/);
  if (joinName) return `${joinName[1]} سے ${urdu[joinName[2]] ?? wordTranslations[joinName[2]] ?? joinName[2]}`;
  const hello = key.match(/^Hello (.+)! Let’s learn and play together\.$/);
  if (hello) return `سلام ${hello[1]}! آئیں ساتھ سیکھیں اور کھیلیں۔`;
  const hi = key.match(/^Hi, (.+)!$/);
  if (hi) return `سلام، ${hi[1]}!`;
  const spokenLetter = key.match(/^([A-Z])\. (.+)\.$/);
  if (spokenLetter) return `${spokenLetter[1]}۔ ${wordTranslations[spokenLetter[2]] ?? urdu[spokenLetter[2]] ?? spokenLetter[2]}۔`;
  const meetAnimalCard = key.match(/^🐾 Meet (.+) 🐾\s+🔊$/);
  if (meetAnimalCard) return `🐾 ${urdu[meetAnimalCard[1]] ?? meetAnimalCard[1]} سے ملیں 🐾  🔊`;
  const homePrompt = key.match(/^Yes! The (.+) lives in the (.+)\.$/);
  if (homePrompt) return homePrompt[1] === 'Whale'
    ? `ہاں! وہیل ${urdu[homePrompt[2]] ?? homePrompt[2]} میں رہتی ہے۔`
    : `ہاں! ${urdu[homePrompt[1]] ?? homePrompt[1]} ${urdu[homePrompt[2]] ?? homePrompt[2]} میں رہتا ہے۔`;
  const feedThanks = key.match(/^Yummy! (.+) says thank you!$/);
  if (feedThanks) return feedThanks[1] === 'Whale'
    ? 'مزے دار! وہیل شکریہ کہتی ہے!'
    : `مزے دار! ${urdu[feedThanks[1]] ?? feedThanks[1]} شکریہ کہتا ہے!`;
  const feedCelebration = key.match(/^Hooray! (.+) is full!$/);
  if (feedCelebration) return `واہ! ${urdu[feedCelebration[1]] ?? feedCelebration[1]} کا پیٹ بھر گیا!`;
  const colorAnnouncement = key.match(/^That’s (.+)! (🌈|✨)$/);
  if (colorAnnouncement) return `یہ ہے ${urdu[colorAnnouncement[1]] ?? colorAnnouncement[1]}! ${colorAnnouncement[2]}`;
  const meetAnimalSpeech = key.match(/^Meet (.+)$/);
  if (meetAnimalSpeech) return `${urdu[meetAnimalSpeech[1]] ?? meetAnimalSpeech[1]} سے ملیں`;
  return value;
}

export function isRTL(language: AppLanguage): boolean {
  return languageMetadata[language].direction === 'rtl';
}

export function speechLocale(language: AppLanguage): string {
  return languageMetadata[language].speechLocale;
}

export function translateLearningWord(value: string, language: AppLanguage): string {
  return language === 'ur' ? wordTranslations[value] ?? urdu[value] ?? value : value;
}
