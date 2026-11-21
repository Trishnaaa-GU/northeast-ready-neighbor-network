// The ONLY place the offline service worker is registered. It never registers in dev,
// inside an iframe, or on Lovable preview hosts; there it removes any stale /sw.js instead.
export const APP_ROUTES = [
  "/",
  "/alerts",
  "/guides",
  "/helplines",
  "/shelters",
  "/report",
  "/safe",
  "/first-aid",
  "/kit",
] as const;

export const OFFLINE_READY_KEY = "nc:offline-ready";
const PAGES_CACHE = "nc-pages";
const PREVIEW_LABEL = /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/;
const PREVIEW_DOMAINS = [".lovable.app", ".gpt-eng.com", ".gptengineer.run"];

function isInIframe(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function isRefusedContext(): boolean {
  if (!import.meta.env.PROD) return true;
  if (isInIframe()) return true;
  const host = window.location.hostname.toLowerCase();
  const firstLabel = host.split(".")[0] ?? "";
  if (PREVIEW_DOMAINS.some((d) => host.endsWith(d))) {
    if (PREVIEW_LABEL.test(firstLabel)) return true;
    if (/^project--[a-z0-9-]+-dev$/.test(firstLabel)) return true;
  }
  if (host === "lovableproject.com" || host.endsWith(".lovableproject.com")) return true;
  if (host === "lovableproject-dev.com" || host.endsWith(".lovableproject-dev.com")) return true;
  if (host === "beta.lovable.dev" || host.endsWith(".beta.lovable.dev")) return true;
  if (new URLSearchParams(window.location.search).get("sw") === "off") return true;
  return false;
}

async function unregisterAppWorkers() {
  const regs = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    regs
      .filter((r) => {
        const url = r.active?.scriptURL ?? r.waiting?.scriptURL ?? r.installing?.scriptURL ?? "";
        return url.endsWith("/sw.js");
      })
      .map((r) => r.unregister()),
  );
}

/** Save every page's HTML so the app opens on any screen with no connection. */
async function warmPageCache() {
  if (!navigator.onLine || !("caches" in window)) return;
  const cache = await caches.open(PAGES_CACHE);
  const results = await Promise.allSettled(
    APP_ROUTES.map(async (path) => {
      const res = await fetch(path, { credentials: "same-origin", cache: "no-cache" });
      if (res.ok) await cache.put(path, res);
      return res.ok;
    }),
  );
  if (results.every((r) => r.status === "fulfilled" && r.value)) {
    localStorage.setItem(OFFLINE_READY_KEY, new Date().toISOString());
    window.dispatchEvent(new Event("nc-offline-ready"));
  }
}

export async function setupServiceWorker(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    if (isRefusedContext()) {
      await unregisterAppWorkers();
      return;
    }
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    await warmPageCache();
  } catch (err) {
    console.warn("Offline setup failed", err);
  }
}
