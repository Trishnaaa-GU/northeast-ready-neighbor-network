// Tiny IndexedDB key-value store with a localStorage fallback. Browser-only: call from effects/handlers.
const DB_NAME = "northeast-connect";
const STORE = "kv";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

const hasIdb = () => typeof indexedDB !== "undefined";

export async function idbGet<T>(key: string): Promise<T | undefined> {
  try {
    if (!hasIdb()) throw new Error("no idb");
    const db = await openDb();
    return await new Promise<T | undefined>((resolve, reject) => {
      const req = db.transaction(STORE, "readonly").objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  } catch {
    const raw = localStorage.getItem(`nc:${key}`);
    return raw ? (JSON.parse(raw) as T) : undefined;
  }
}

export async function idbSet<T>(key: string, value: T): Promise<void> {
  try {
    if (!hasIdb()) throw new Error("no idb");
    const db = await openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    localStorage.setItem(`nc:${key}`, JSON.stringify(value));
  }
}
