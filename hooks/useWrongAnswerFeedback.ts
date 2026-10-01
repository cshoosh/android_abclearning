import { useCallback, useEffect, useRef, useState } from 'react';
import { translateText, type AppLanguage } from '../localization';
import { playWrongAnswerFeedback, WRONG_ANSWER_MESSAGE } from '../services/feedback';

const MESSAGE_DURATION_MS = 1800;

export function useWrongAnswerFeedback(voice: boolean, language: AppLanguage) {
  const [message, setMessage] = useState('');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFeedbackAt = useRef(0);

  const showWrongAnswer = useCallback(() => {
    setMessage(translateText(WRONG_ANSWER_MESSAGE, language));
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setMessage(''), MESSAGE_DURATION_MS);

    const now = Date.now();
    if (now - lastFeedbackAt.current >= 400) {
      lastFeedbackAt.current = now;
      playWrongAnswerFeedback(voice, language);
    }
  }, [language, voice]);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  return { message, showWrongAnswer };
}
