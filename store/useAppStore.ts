import { create } from 'zustand';
import { initialProgress, Progress, readProgress, writeProgress } from '../services/progress';
import { buildReward } from '../domain/rewards';
import { clearPlayProgress } from '../domain/progress';

type AppState = Progress & { hydrated: boolean; parentUnlocked: boolean; unlockParent: () => void; lockParent: () => void; hydrate: () => Promise<void>; patch: (values: Partial<Progress>) => void; reward: (activity: string, letter?: string) => void; reset: () => void };
export const useAppStore = create<AppState>((set,get) => ({
  ...initialProgress, hydrated: false, parentUnlocked:false,
  unlockParent:()=>set({parentUnlocked:true}), lockParent:()=>set({parentUnlocked:false}),
  hydrate: async () => { const value = await readProgress().catch(() => initialProgress); set({ ...value, hydrated: true }); },
  patch: values => { const next = { ...get(), ...values }; set(values); void writeProgress(toProgress(next)).catch(() => undefined); },
  reward: (activity, letter) => {
    const next = buildReward(get(), activity, letter);
    set(next); void writeProgress(next).catch(() => undefined);
  },
  reset: () => { const next = { ...get(), ...clearPlayProgress(get()), hydrated: true }; set(next); void writeProgress(toProgress(next)).catch(() => undefined); },
}));

function toProgress(state: AppState): Progress {
  const { hydrated: _hydrated, parentUnlocked: _parentUnlocked, unlockParent: _unlock, lockParent: _lock, hydrate: _hydrate, patch: _patch, reward: _reward, reset: _reset, ...progress } = state;
  return progress;
}
