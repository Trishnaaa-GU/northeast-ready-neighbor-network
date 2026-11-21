import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { toast } from "sonner";
import { LANGS, translate, type Lang, type TKey } from "./i18n";
import { idbGet, idbSet } from "./idb";
import { markAllSynced, pendingCount, type QueueItem } from "./queue";
import { ALERTS_BUNDLED_AT } from "@/data/alerts";
import { OFFLINE_READY_KEY, setupServiceWorker } from "./pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  largeText: boolean;
  toggleLargeText: () => void;
  online: boolean;
  queue: QueueItem[];
  queueLoaded: boolean;
  addToQueue: (item: QueueItem) => Promise<void>;
  pending: number;
  alertsUpdatedAt: string;
  refreshAlerts: () => boolean;
  canInstall: boolean;
  isStandalone: boolean;
  promptInstall: () => Promise<"prompted" | "manual">;
  offlineReady: boolean;
}

const Ctx = createContext<AppState | null>(null);

function subscribeOnline(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

const SETTINGS_KEY = "nc:settings";
const ALERTS_KEY = "nc:alerts-updated";
const QUEUE_KEY = "queue";
const SYNC_DELAY_MS = 1500;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [largeText, setLargeText] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueLoaded, setQueueLoaded] = useState(false);
  const [alertsUpdatedAt, setAlertsUpdatedAt] = useState(ALERTS_BUNDLED_AT);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const queueRef = useRef<QueueItem[]>([]);

  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );

  // Load saved settings, alerts timestamp and offline flag after hydration.
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? "{}") as { lang?: Lang; largeText?: boolean };
      if (s.lang && LANGS.some((l) => l.code === s.lang)) setLangState(s.lang);
      if (s.largeText) setLargeText(true);
      const a = localStorage.getItem(ALERTS_KEY);
      if (a && new Date(a) > new Date(ALERTS_BUNDLED_AT)) setAlertsUpdatedAt(a);
      setOfflineReady(Boolean(localStorage.getItem(OFFLINE_READY_KEY)));
    } catch {
      /* corrupted settings: keep defaults */
    }
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );
    const onReady = () => setOfflineReady(true);
    window.addEventListener("nc-offline-ready", onReady);
    void setupServiceWorker();
    return () => window.removeEventListener("nc-offline-ready", onReady);
  }, []);

  useEffect(() => {
    idbGet<QueueItem[]>(QUEUE_KEY).then((items) => {
      const list = items ?? [];
      queueRef.current = list;
      setQueue(list);
      setQueueLoaded(true);
    });
  }, []);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstallEvent(null);
      setIsStandalone(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("large-text", largeText);
    document.documentElement.lang = LANGS.find((l) => l.code === lang)?.htmlLang ?? "en";
  }, [largeText, lang]);

  const persistSettings = (next: { lang: Lang; largeText: boolean }) =>
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));

  const setLang = useCallback(
    (l: Lang) => {
      setLangState(l);
      persistSettings({ lang: l, largeText });
    },
    [largeText],
  );

  const toggleLargeText = useCallback(() => {
    setLargeText((v) => {
      persistSettings({ lang, largeText: !v });
      return !v;
    });
  }, [lang]);

  const saveQueue = useCallback(async (items: QueueItem[]) => {
    queueRef.current = items;
    setQueue(items);
    await idbSet(QUEUE_KEY, items);
  }, []);

  const addToQueue = useCallback(
    async (item: QueueItem) => {
      await saveQueue([item, ...queueRef.current]);
    },
    [saveQueue],
  );

  const t = useCallback((k: TKey) => translate(lang, k), [lang]);

  // Simulated sync: once a connection is available, pending items are marked as synced.
  const pending = pendingCount(queue);
  useEffect(() => {
    if (!online || !queueLoaded || pending === 0) return;
    const timer = setTimeout(() => {
      const count = pendingCount(queueRef.current);
      if (count === 0 || !navigator.onLine) return;
      void saveQueue(markAllSynced(queueRef.current, new Date()));
      toast.success(`${count} ${count === 1 ? "item" : "items"} synced`);
    }, SYNC_DELAY_MS);
    return () => clearTimeout(timer);
  }, [online, queueLoaded, pending, saveQueue]);

  const refreshAlerts = useCallback(() => {
    if (!navigator.onLine) return false;
    const now = new Date().toISOString();
    localStorage.setItem(ALERTS_KEY, now);
    setAlertsUpdatedAt(now);
    return true;
  }, []);

  // Auto-check alerts whenever the connection comes back.
  const wasOnline = useRef(online);
  useEffect(() => {
    if (online && !wasOnline.current) refreshAlerts();
    wasOnline.current = online;
  }, [online, refreshAlerts]);

  const promptInstall = useCallback(async () => {
    if (!installEvent) return "manual" as const;
    await installEvent.prompt();
    await installEvent.userChoice.catch(() => undefined);
    setInstallEvent(null);
    return "prompted" as const;
  }, [installEvent]);

  const value = useMemo<AppState>(
    () => ({
      lang, setLang, t, largeText, toggleLargeText, online, queue, queueLoaded, addToQueue, pending,
      alertsUpdatedAt, refreshAlerts, canInstall: Boolean(installEvent), isStandalone, promptInstall, offlineReady,
    }),
    [lang, setLang, t, largeText, toggleLargeText, online, queue, queueLoaded, addToQueue, pending,
      alertsUpdatedAt, refreshAlerts, installEvent, isStandalone, promptInstall, offlineReady],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used inside AppStateProvider");
  return v;
}
