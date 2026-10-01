import { create } from 'zustand';
import { initialProgress, Progress, readProgress, writeProgress } from '../services/progress';
import { buildReward } from '../domain/rewards';
import { clearPlayProgress } from '../domain/progress';
import { normalizeAppLanguage } from '../localization';

type StickerRewardNotice = { id: number; name: string };
type AppState = Progress & { stickerReward: StickerRewardNotice | null; clearStickerReward: (id: number) => void; hydrated: boolean; parentUnlocked: boolean; purchaseStatusChecked: boolean; unlockParent: () => void; lockParent: () => void; setVerifiedPremium: (premium: boolean) => void; setPurchaseStatusChecked: () => void; hydrate: () => Promise<void>; patch: (values: Partial<Progress>) => void; reward: (activity: string, letter?: string) => void; reset: () => void };
export const useAppStore = create<AppState>((set,get) => ({
  ...initialProgress, stickerReward: null, hydrated: false, parentUnlocked:false, purchaseStatusChecked:false,
  clearStickerReward:id=>set(state=>state.stickerReward?.id===id?{stickerReward:null}:{}),
  unlockParent:()=>set({parentUnlocked:true}), lockParent:()=>set({parentUnlocked:false}),
  setVerifiedPremium:premium=>{const next={...get(),premium};set({premium,purchaseStatusChecked:true});void writeProgress({...toProgress(next),premium:false}).catch(()=>undefined);},
  setPurchaseStatusChecked:()=>set({purchaseStatusChecked:true}),
  hydrate: async () => { const value = await readProgress().catch(() => initialProgress); set({ ...value, language: normalizeAppLanguage(value.language), premium: false, hydrated: true }); },
  patch: values => {
    const normalizedValues = values.language === undefined ? values : { ...values, language: normalizeAppLanguage(values.language) };
    const next = { ...get(), ...normalizedValues };
    set(normalizedValues);
    void writeProgress(toProgress(next)).catch(() => undefined);
  },
  reward: (activity, letter) => {
    const current = get();
    const next = buildReward(current, activity, letter);
    const sticker = next.stickers.find(name => !current.stickers.includes(name));
    set({ ...next, stickerReward: sticker ? { id: Date.now(), name: sticker } : null });
    void writeProgress(next).catch(() => undefined);
  },
  reset: () => { const next = { ...get(), ...clearPlayProgress(get()), stickerReward: null, hydrated: true }; set(next); void writeProgress(toProgress(next)).catch(() => undefined); },
}));

function toProgress(state: AppState): Progress {
  const { stickerReward: _stickerReward, clearStickerReward: _clearStickerReward, hydrated: _hydrated, parentUnlocked: _parentUnlocked, purchaseStatusChecked: _purchaseStatusChecked, unlockParent: _unlock, lockParent: _lock, setVerifiedPremium: _setPremium, setPurchaseStatusChecked: _setChecked, hydrate: _hydrate, patch: _patch, reward: _reward, reset: _reset, ...progress } = state;
  // Premium is store-verified and must never be restored from editable local storage.
  return { ...progress, premium: false };
}
