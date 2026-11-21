import { describe, expect, it } from "vitest";
import { isAlertsStale } from "@/lib/alerts-freshness";
import { markAllSynced, pendingCount, type QueueItem } from "@/lib/queue";
import { buildIncidentMessage, smsHref } from "@/lib/messages";

describe("alerts freshness", () => {
  const updated = "2026-11-20T09:00:00+05:30";
  it("is not stale 23 hours after the last update", () => {
    expect(isAlertsStale(updated, new Date("2026-11-21T08:00:00+05:30"))).toBe(false);
  });
  it("is stale 25 hours after the last update", () => {
    expect(isAlertsStale(updated, new Date("2026-11-21T10:00:00+05:30"))).toBe(true);
  });
});

describe("offline queue sync", () => {
  const items: QueueItem[] = [
    { id: "a", kind: "incident", createdAt: "2026-11-21T01:00:00Z", status: "pending", incidentType: "flood", severity: "serious", description: "Water rising" },
    { id: "b", kind: "checkin", createdAt: "2026-11-21T02:00:00Z", status: "synced", syncedAt: "2026-11-21T02:05:00Z", message: "I am SAFE." },
  ];
  it("marks pending items as synced when the connection returns", () => {
    const out = markAllSynced(items, new Date("2026-11-21T03:00:00Z"));
    expect(out[0]?.status).toBe("synced");
    expect(out[0]?.syncedAt).toBe("2026-11-21T03:00:00.000Z");
    expect(pendingCount(out)).toBe(0);
  });
  it("leaves already-synced items unchanged", () => {
    const out = markAllSynced(items, new Date("2026-11-21T03:00:00Z"));
    expect(out[1]?.syncedAt).toBe("2026-11-21T02:05:00Z");
  });
});

describe("SMS report", () => {
  it("pre-fills the message with GPS coordinates", () => {
    const msg = buildIncidentMessage({
      typeLabel: "Landslide",
      severityLabel: "Serious",
      description: "Road blocked",
      createdAt: "2026-11-21T03:00:00Z",
      location: { lat: 27.58612, lng: 91.85934 },
    });
    expect(msg).toContain("27.58612, 91.85934");
    const href = smsHref(msg);
    expect(href.startsWith("sms:?&body=")).toBe(true);
    expect(decodeURIComponent(href.split("body=")[1] ?? "")).toBe(msg);
  });
});
