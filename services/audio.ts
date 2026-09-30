import * as Speech from 'expo-speech';
let lastSpoken = 0;
export function speak(text: string, enabled = true) {
  if (!enabled) return;
  const now = Date.now(); if (now - lastSpoken < 180) return;
  lastSpoken = now;
  void Speech.stop();
  void Speech.speak(text, { language: 'en-US', rate: 0.82, pitch: 1.12 });
}
