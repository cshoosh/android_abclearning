export type UiSound = 'pop' | 'success' | 'bubble-pop' | 'balloon-pop';

type Listener = (sound: UiSound) => void;
const listeners = new Set<Listener>();

export function playUiSound(sound: UiSound) {
  listeners.forEach(listener => listener(sound));
}

export function subscribeUiSounds(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
