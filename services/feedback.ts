import * as Haptics from 'expo-haptics';
import { speak } from './audio';
import type { AppLanguage } from '../localization';

const WRONG_ANSWER_MESSAGE = "Oopsie! That's okay! Let's try again!";

export function playWrongAnswerFeedback(voice: boolean, language: AppLanguage) {
  void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
  speak(WRONG_ANSWER_MESSAGE, voice, language, 'encouraging');
}

export { WRONG_ANSWER_MESSAGE };
