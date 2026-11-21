import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck, Loader2, MessageSquare, Share2, Copy, Clock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { useGeolocation } from "@/hooks/use-geolocation";
import { newId, type CheckinItem } from "@/lib/queue";
import { buildCheckinMessage, formatCoords, formatTime, smsHref, whatsappHref } from "@/lib/messages";
import { PageHeader } from "@/components/app/PageHeader";
import { SyncPill } from "@/components/app/SyncPill";

export const Route = createFileRoute("/safe")({
  head: () => ({
    meta: [
      { title: "I'm Safe check-in — Northeast Connect" },
      { name: "description", content: "One tap to tell your family you are safe, with time and location, by SMS or WhatsApp." },
      { property: "og:title", content: "I'm Safe check-in — Northeast Connect" },
      { property: "og:description", content: "Share a safety check-in with your location in one tap." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SafePage,
});

const NAME_KEY = "nc:name";

function SafePage() {
  const { t, addToQueue, queue, queueLoaded } = useApp();
  const geo = useGeolocation();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [latest, setLatest] = useState<CheckinItem | null>(null);

  useEffect(() => {
    setName(localStorage.getItem(NAME_KEY) ?? "");
  }, []);

  const checkins = queue.filter((q): q is CheckinItem => q.kind === "checkin");

  const checkIn = async () => {
    setBusy(true);
    localStorage.setItem(NAME_KEY, name.trim());
    const location = await geo.locate();
    const createdAt = new Date().toISOString();
    const item: CheckinItem = {
      id: newId(),
      kind: "checkin",
      createdAt,
      status: "pending",
      ...(name.trim() ? { name: name.trim() } : {}),
      ...(location ? { location } : {}),
      message: buildCheckinMessage({ ...(name.trim() ? { name: name.trim() } : {}), createdAt, ...(location ? { location } : {}) }),
    };
    await addToQueue(item);
    setLatest(item);
    setBusy(false);
    toast.success(location ? "Check-in saved with your location." : "Check-in saved. Location was not available.");
  };

  const share = async (msg: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ text: msg });
      } catch {
        /* user closed the share sheet */
      }
    } else {
      await navigator.clipboard?.writeText(msg);
      toast.success("Message copied.");
    }
  };

  const copy = async (msg: string) => {
    try {
      await navigator.clipboard.writeText(msg);
      toast.success("Message copied.");
    } catch {
      toast.error("Could not copy. Select the text and copy it.");
    }
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <PageHeader icon={ShieldCheck} title={t("safe.title")}>
        {t("safe.intro")}
      </PageHeader>

      <div>
        <label htmlFor="name" className="mb-1 block text-base font-bold">
          {t("safe.yourName")}
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Example: Temjen Ao"
          className="h-12 w-full rounded-xl border border-input bg-card px-3 text-base"
        />
      </div>

      <button
        type="button"
        onClick={checkIn}
        disabled={busy}
        className="flex min-h-36 w-full flex-col items-center justify-center gap-2 rounded-3xl bg-success text-success-foreground shadow-tile transition-transform active:scale-[0.98] disabled:opacity-80"
      >
        {busy ? <Loader2 className="h-12 w-12 animate-spin" aria-hidden /> : <ShieldCheck className="h-12 w-12" aria-hidden />}
        <span className="text-3xl font-bold">{t("tile.safe")}</span>
        <span className="text-base opacity-95">{busy ? "Getting your location…" : "Tap once"}</span>
      </button>

      {latest && (
        <section aria-live="polite" className="animate-in fade-in slide-in-from-bottom-2 space-y-3 rounded-2xl border-2 border-success bg-success-soft p-4 duration-300">
          <pre className="font-sans text-base whitespace-pre-wrap">{latest.message}</pre>
          <div className="grid gap-2 sm:grid-cols-2">
            <a href={smsHref(latest.message)} className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-lg font-bold text-primary-foreground">
              <MessageSquare className="h-5 w-5" aria-hidden /> {t("safe.shareSms")}
            </a>
            <a href={whatsappHref(latest.message)} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-success px-4 text-lg font-bold text-success-foreground">
              <Share2 className="h-5 w-5" aria-hidden /> {t("safe.shareWhatsapp")}
            </a>
            <button type="button" onClick={() => void share(latest.message)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 bg-card px-4 font-bold">
              <Share2 className="h-5 w-5" aria-hidden /> Share…
            </button>
            <button type="button" onClick={() => void copy(latest.message)} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 bg-card px-4 font-bold">
              <Copy className="h-5 w-5" aria-hidden /> Copy
            </button>
          </div>
          <p className="text-sm text-muted-foreground">WhatsApp needs internet. SMS works with basic mobile signal.</p>
        </section>
      )}

      <section aria-labelledby="history">
        <h2 id="history" className="mb-3 text-xl font-bold">
          {t("safe.history")}
        </h2>
        {queueLoaded && checkins.length === 0 ? (
          <p className="rounded-xl border bg-card p-5 text-center text-base text-muted-foreground">{t("safe.empty")}</p>
        ) : (
          <ul className="space-y-2">
            {checkins.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border bg-card p-3">
                <span className="inline-flex items-center gap-1 text-base font-bold">
                  <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
                  {formatTime(c.createdAt)}
                </span>
                {c.location && (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" aria-hidden />
                    {formatCoords(c.location)}
                  </span>
                )}
                <span className="ml-auto flex items-center gap-2">
                  <SyncPill status={c.status} />
                  <a href={smsHref(c.message)} className="inline-flex h-10 items-center rounded-lg border px-3 text-sm font-bold text-primary">
                    SMS
                  </a>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
