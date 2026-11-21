export const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

/** Alerts are stale when the last update is more than 24 hours before `now`. */
export function isAlertsStale(lastUpdatedIso: string, now: Date): boolean {
  const t = new Date(lastUpdatedIso).getTime();
  if (Number.isNaN(t)) return true;
  return now.getTime() - t > STALE_AFTER_MS;
}
