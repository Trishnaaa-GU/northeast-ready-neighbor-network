import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen, Phone, Tent, Megaphone, ShieldCheck, Cross, Backpack, ChevronRight, MessageSquareWarning,
  Loader2, CloudUpload, CheckCircle2, TriangleAlert,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import type { TKey } from "@/lib/i18n";
import { ALERTS, SEVERITY_ORDER } from "@/data/alerts";
import { SampleDataTag, SampleAlertsNote } from "@/components/app/SampleDataTag";
import { SeverityBadge } from "@/components/app/SeverityBadge";
import { AlertsUpdated } from "@/components/app/AlertsUpdated";
import { useGeolocation } from "@/hooks/use-geolocation";
import { buildSosMessage, smsHref } from "@/lib/messages";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northeast Connect — Emergency help that works offline" },
      { name: "description", content: "Call 112, see alerts, find shelters and report incidents in North East India, even with no internet." },
      { property: "og:title", content: "Northeast Connect — Emergency help that works offline" },
      { property: "og:description", content: "SOS, alerts, safety guides, shelters and first aid for floods, landslides and earthquakes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Home,
});

const TILES = [
  { to: "/guides", key: "tile.guides", icon: BookOpen, tone: "bg-secondary text-primary" },
  { to: "/helplines", key: "tile.helplines", icon: Phone, tone: "bg-secondary text-primary" },
  { to: "/shelters", key: "tile.shelters", icon: Tent, tone: "bg-secondary text-primary" },
  { to: "/report", key: "tile.report", icon: Megaphone, tone: "bg-warning-soft text-accent-foreground" },
  { to: "/safe", key: "tile.safe", icon: ShieldCheck, tone: "bg-success-soft text-success" },
  { to: "/first-aid", key: "tile.firstAid", icon: Cross, tone: "bg-sos-soft text-sos" },
] as const satisfies readonly { to: string; key: TKey; icon: unknown; tone: string }[];

const topAlert = [...ALERTS].sort(
  (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.issuedAt.localeCompare(a.issuedAt),
)[0];

function Home() {
  const { t, pending, queue, offlineReady } = useApp();
  const { locate } = useGeolocation();
  const [sending, setSending] = useState(false);

  const sendSos = async () => {
    setSending(true);
    const loc = await locate();
    setSending(false);
    window.location.href = smsHref(buildSosMessage(new Date().toISOString(), loc));
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6 duration-300">
      <section aria-labelledby="sos-title" className="rounded-2xl bg-gradient-sos p-5 text-sos-foreground shadow-sos">
        <h1 id="sos-title" className="font-display text-2xl leading-tight font-bold">
          {t("sos.title")}
        </h1>
        <p className="mt-1 text-base opacity-95">{t("sos.subtitle")}</p>
        <a
          href="tel:112"
          className="animate-sos-pulse mt-4 flex h-20 items-center justify-center gap-3 rounded-xl bg-sos-foreground text-3xl font-bold text-sos transition-transform active:scale-[0.98]"
        >
          <Phone className="h-8 w-8" aria-hidden />
          {t("sos.call")}
        </a>
        <button
          type="button"
          onClick={sendSos}
          disabled={sending}
          className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-xl border-2 border-sos-foreground/70 px-4 text-lg font-bold transition-colors active:bg-sos-foreground/10 disabled:opacity-80"
        >
          {sending ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <MessageSquareWarning className="h-5 w-5" aria-hidden />}
          {sending ? "Getting location…" : t("sos.sms")}
        </button>
      </section>

      {topAlert && (
        <section aria-label={t("home.latestAlert")} className="space-y-2">
          <Link
            to="/alerts"
            className="block rounded-xl border-2 border-sos bg-sos-soft p-4 transition-transform active:scale-[0.99]"
          >
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-sos" aria-hidden />
              <span className="text-sm font-bold text-sos uppercase">{t("home.latestAlert")}</span>
              <SeverityBadge severity={topAlert.severity} />
              <SampleDataTag />
            </div>
            <p className="mt-2 text-lg leading-snug font-bold">{topAlert.title}</p>
            <p className="text-sm text-muted-foreground">
              {topAlert.state} · {topAlert.area}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-base font-bold text-primary">
              {t("home.seeAll")} ({ALERTS.length}) <ChevronRight className="h-4 w-4" aria-hidden />
            </span>
          </Link>
          <AlertsUpdated />
          <SampleAlertsNote />
        </section>
      )}

      <section aria-labelledby="quick-help">
        <h2 id="quick-help" className="mb-3 text-xl font-bold">
          {t("home.quickHelp")}
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TILES.map(({ to, key, icon: Icon, tone }) => (
            <li key={to}>
              <Link
                to={to}
                className="flex min-h-32 flex-col items-start justify-between gap-3 rounded-2xl border bg-card p-4 shadow-tile transition-transform active:scale-[0.97]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span className="text-lg leading-tight font-bold">{t(key)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Link to="/kit" className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-tile">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Backpack className="h-7 w-7" aria-hidden />
        </span>
        <span className="flex-1">
          <span className="block text-lg font-bold">{t("tile.kit")}</span>
          <span className="block text-sm text-muted-foreground">Water, food, torch, documents — check what you have packed.</span>
        </span>
        <ChevronRight className="h-6 w-6 text-muted-foreground" aria-hidden />
      </Link>

      {queue.length > 0 && (
        <Link to="/report" className="flex items-center gap-3 rounded-xl border bg-card p-4">
          {pending > 0 ? (
            <CloudUpload className="h-6 w-6 text-accent-foreground" aria-hidden />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-success" aria-hidden />
          )}
          <span className="flex-1 text-base">
            {pending > 0 ? (
              <>
                <b>{pending}</b> {t("home.outbox").toLowerCase()} · {t("sync.pending")}
              </>
            ) : (
              <>
                {queue.length} · {t("sync.synced")}
              </>
            )}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden />
        </Link>
      )}

      {offlineReady && (
        <p className="flex items-center justify-center gap-2 text-sm font-bold text-success">
          <CheckCircle2 className="h-4 w-4" aria-hidden />
          {t("common.offlineReady")}
        </p>
      )}
    </div>
  );
}
