import * as Speech from 'expo-speech';
import { AppLanguage, speechLocale, translateText } from '../localization';
let latestSpeechRequest = 0;
let availableVoices: Promise<Speech.Voice[]> | undefined;
let cachedUrduVoice: string | undefined;

type SpeechStyle = 'default' | 'encouraging';

async function getUrduVoice(): Promise<string | undefined> {
  availableVoices ??= Speech.getAvailableVoicesAsync().catch(() => []);
  const voices = await availableVoices;
  const urduVoices = voices.filter(voice => voice.language.toLowerCase().replace('_', '-').startsWith('ur-') || voice.language.toLowerCase() === 'ur');
  urduVoices.sort((a, b) => {
    const rank = (voice: Speech.Voice) =>
      (voice.language.toLowerCase().replace('_', '-') === 'ur-pk' ? 2 : 0) + (voice.quality === Speech.VoiceQuality.Enhanced ? 1 : 0);
    return rank(b) - rank(a);
  });
  return urduVoices[0]?.identifier;
}

export function speak(text: string, enabled = true, language: AppLanguage = 'en', style: SpeechStyle = 'default') {
  if (!enabled) return;

  const requestId = ++latestSpeechRequest;
  const phrase = translateText(text, language);
  const options = {
    language: speechLocale(language),
    rate: style === 'encouraging' ? 0.98 : 0.82,
    pitch: style === 'encouraging' ? 1.24 : 1.12,
    useApplicationAudioSession: false,
  };

  // Stop any previous utterance, but do not wait for the native stop or Urdu voice
  // lookup before starting this one. Both waits made taps feel sluggish.
  void Speech.stop().catch(() => undefined);
  if (language === 'ur' && !cachedUrduVoice) {
    void getUrduVoice().then(voice => {
      cachedUrduVoice = voice;
    }).catch(() => undefined);
  }
  if (requestId === latestSpeechRequest) {
    Speech.speak(phrase, { ...options, ...(language === 'ur' && cachedUrduVoice ? { voice: cachedUrduVoice } : {}) });
  }
}
