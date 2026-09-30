import * as SQLite from 'expo-sqlite';
import { initialProgress, Progress } from '../types/progress';
export { initialProgress } from '../types/progress';
export type { Progress } from '../types/progress';
const dbPromise = SQLite.openDatabaseAsync('abc-kids.db');
let ready: Promise<void> | undefined;
export async function initProgressDb() {
  if (!ready) ready = (async () => {
    const db = await dbPromise;
    await db.execAsync('CREATE TABLE IF NOT EXISTS app_state (id INTEGER PRIMARY KEY NOT NULL, payload TEXT NOT NULL);');
    const row = await db.getFirstAsync<{payload:string}>('SELECT payload FROM app_state WHERE id=1');
    if (!row) await db.runAsync('INSERT INTO app_state (id,payload) VALUES (1,?)', JSON.stringify(initialProgress));
  })();
  return ready;
}
export async function readProgress(): Promise<Progress> {
  await initProgressDb(); const db = await dbPromise;
  const row = await db.getFirstAsync<{payload:string}>('SELECT payload FROM app_state WHERE id=1');
  try { return row ? { ...initialProgress, ...JSON.parse(row.payload) } : initialProgress; }
  catch { return initialProgress; }
}
export async function writeProgress(value: Progress) {
  await initProgressDb(); const db = await dbPromise;
  await db.runAsync('INSERT OR REPLACE INTO app_state (id,payload) VALUES (1,?)', JSON.stringify(value));
}
