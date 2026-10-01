import * as SQLite from 'expo-sqlite';
import { getLocales } from 'expo-localization';
import { getSupportedLanguages, normalizeAppLanguage } from '../localization';
import { initialProgress, Progress } from '../types/progress';
export { initialProgress } from '../types/progress';
export type { Progress } from '../types/progress';
const dbPromise = SQLite.openDatabaseAsync('abc-kids.db');
let ready: Promise<void> | undefined;
function deviceProgress(): Progress {
  const deviceLanguageCodes = getLocales()
    .map(({ languageCode }) => languageCode)
    .filter((code): code is string => Boolean(code));
  const locale = getLocales()[0];
  const regionCode = locale?.regionCode ?? locale?.languageRegionCode;
  const language = normalizeAppLanguage(getSupportedLanguages(regionCode).find(code => deviceLanguageCodes.includes(code)) ?? 'en');
  return { ...initialProgress, language };
}
export async function initProgressDb() {
  if (!ready) ready = (async () => {
    const db = await dbPromise;
    await db.execAsync('CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY NOT NULL, payload TEXT NOT NULL);');
    const row = await db.getFirstAsync<{payload:string}>('SELECT payload FROM app_state WHERE id=1');
    if (!row) await db.runAsync('INSERT INTO app_state (id,payload) VALUES (1,?)', JSON.stringify(deviceProgress()));
  })();
  return ready;
}
export async function readProgress(): Promise<Progress> {
  await initProgressDb(); const db = await dbPromise;
  const row = await db.getFirstAsync<{payload:string}>('SELECT payload FROM app_state WHERE id=1');
  try {
    if (!row) return deviceProgress();
    const saved = JSON.parse(row.payload) as Partial<Progress>;
    return { ...deviceProgress(), ...saved, language: normalizeAppLanguage(saved.language ?? deviceProgress().language) };
  } catch { return deviceProgress(); }
}
export async function writeProgress(value: Progress) {
  await initProgressDb(); const db = await dbPromise;
  await db.runAsync('INSERT OR REPLACE INTO app_state (id,payload) VALUES (1,?)', JSON.stringify(value));
}
