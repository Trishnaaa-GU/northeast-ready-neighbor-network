import { createFileRoute } from "@tanstack/react-router";
import { Phone, PhoneCall, ShieldAlert } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { NATIONAL_HELPLINES, STATE_CONTROL_ROOMS } from "@/data/helplines";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/helplines")({
  head: () => ({
    meta: [
      { title: "Emergency helplines — 112, ambulance, disaster control rooms | Northeast Connect" },
      { name: "description", content: "Tap to call 112, 108, 1078 and state disaster control rooms across North East India." },
      { property: "og:title", content: "Emergency helplines for North East India" },
      { property: "og:description", content: "One-tap calling for national and state emergency numbers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelplinesPage,
});

function HelplinesPage() {
  const { t } = useApp();
  const [primary, ...rest] = NATIONAL_HELPLINES;

  return (
    <div className="animate-in fade-in space-y-5 duration-300">
      <PageHeader icon={Phone} title={t("helplines.title")} />

      {primary && (
        <a
          href={`tel:${primary.number}`}
          className="flex items-center gap-4 rounded-2xl bg-gradient-sos p-5 text-sos-foreground shadow-sos active:scale-[0.99]"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sos-foreground text-sos">
            <PhoneCall className="h-8 w-8" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block text-4xl font-bold">{primary.number}</span>
            <span className="block text-lg font-bold">{primary.name}</span>
            <span className="block text-sm opacity-95">{primary.note}</span>
          </span>
        </a>
      )}

      <section aria-labelledby="national">
        <h2 id="national" className="mb-2 text-xl font-bold">
          {t("helplines.national")}
        </h2>
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {rest.map((h) => (
            <li key={h.number}>
              <a href={`tel:${h.number}`} className="flex min-h-16 items-center gap-4 px-4 py-3 active:bg-muted">
                <span className="w-16 text-2xl font-bold text-primary">{h.number}</span>
                <span className="flex-1">
                  <span className="block text-base font-bold">{h.name}</span>
                  <span className="block text-sm text-muted-foreground">{h.note}</span>
                </span>
                <span className="inline-flex h-11 items-center gap-1.5 rounded-lg bg-primary px-3 font-bold text-primary-foreground">
                  <Phone className="h-4 w-4" aria-hidden />
                  {t("common.call")}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="state">
        <h2 id="state" className="mb-2 text-xl font-bold">
          {t("helplines.state")}
        </h2>
        <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
          {STATE_CONTROL_ROOMS.map((r) => (
            <li key={r.state}>
              <a href={`tel:${r.number}`} className="flex min-h-16 items-center gap-3 px-4 py-3 active:bg-muted">
                <span className="flex-1">
                  <span className="block text-base font-bold">{r.state}</span>
                  <span className="block text-sm text-muted-foreground">{r.office}</span>
                  <span className="mt-1 inline-flex items-center gap-1 rounded bg-caution-soft px-1.5 py-0.5 text-xs font-bold text-caution-foreground">
                    <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                    {t("helplines.verify")}
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-xl font-bold text-primary">{r.number}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
