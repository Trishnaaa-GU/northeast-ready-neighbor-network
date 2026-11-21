// Offline outbox: incident reports and safety check-ins wait here until a connection returns.
export type SyncStatus = "pending" | "synced";

export interface GeoPoint {
  lat: number;
  lng: number;
  accuracy?: number;
}

export interface IncidentItem {
  id: string;
  kind: "incident";
  createdAt: string;
  status: SyncStatus;
  syncedAt?: string;
  incidentType: string;
  severity: "minor" | "serious" | "critical";
  description: string;
  photo?: string;
  location?: GeoPoint;
}

export interface CheckinItem {
  id: string;
  kind: "checkin";
  createdAt: string;
  status: SyncStatus;
  syncedAt?: string;
  name?: string;
  message: string;
  location?: GeoPoint;
}

export type QueueItem = IncidentItem | CheckinItem;

/** Simulated upload: every pending item becomes synced at `now`; already-synced items are untouched. */
export function markAllSynced(items: QueueItem[], now: Date): QueueItem[] {
  return items.map((item) =>
    item.status === "pending" ? { ...item, status: "synced", syncedAt: now.toISOString() } : item,
  );
}

export function pendingCount(items: QueueItem[]): number {
  return items.filter((i) => i.status === "pending").length;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
