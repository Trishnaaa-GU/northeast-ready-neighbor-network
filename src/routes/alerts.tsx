import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TriangleAlert, CircleCheck } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { ALERTS, NE_STATES, SEVERITY_ORDER, type NEState, type Severity } from "@/data/alerts";
import { PageHeader } from "@/components/app/PageHeader";
import { AlertCard } from "@/components/app/AlertCard";
import { AlertsUpdated } from "@/components/app/AlertsUpdated";
import { DemoNote } from "@/components/app/DemoNote";
import { SampleAlertsNote } from "@/components/app/SampleDataTag";
import { SeverityBadge } from "@/components/app/SeverityBadge";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Disaster alerts for North East India — Northeast Connect" },
      { name: "description", content: "Red, orange and yellow alerts for Assam, Arunachal, Nagaland, Meghalaya, Manipur, Mizoram, Tripura and Sikkim." },
      { property: "og:title", content: "Disaster alerts for North East India" },
      { property: "og:description", content: "Flood, landslide and earthquake alerts by state, readable offline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { t } = useApp();
  const [state, setState] = useState<NEState | "all">("all");

  const list = useMemo(
    () =>
      ALERTS.filter((a) => state === "all" || a.state === state).sort(
        (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.issuedAt.localeCompare(a.issuedAt),
      ),
    [state],
  );

  const counts = (["red", "orange", "yellow"] as Severity[]).map((s) => ({ s, n: list.filter((a) => a.severity === s).length }));
  const chip = (active: boolean) =>
    active
      ? "h-11 shrink-0 rounded-full bg-primary px-4 text-base font-bold text-primary-foreground"
      : "h-11 shrink-0 rounded-full border bg-card px-4 text-base font-bold text-foreground";

  return (
    <div className="animate-in fade-in space-y-4 duration-300">
      <PageHeader icon={TriangleAlert} title={t("alerts.title")} />
      <AlertsUpdated showButton />

      <div role="group" aria-label={t("alerts.filter")} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button type="button" aria-pressed={state === "all"} onClick={() => setState("all")} className={chip(state === "all")}>
          {t("alerts.allStates")}
        </button>
        {NE_STATES.map((s) => (
          <button key={s} type="button" aria-pressed={state === s} onClick={() => setState(s)} className={chip(state === s)}>
            {s}
          </button>
        ))}
      </div>

      {list.length > 0 && (
        <div className="flex flex-wrap gap-3 text-sm">
          {counts.filter((c) => c.n > 0).map(({ s, n }) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <SeverityBadge severity={s} /> × {n}
            </span>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-8 text-center">
          <CircleCheck className="h-10 w-10 text-success" aria-hidden />
          <p className="text-lg font-bold">{t("alerts.none")}</p>
          <p className="text-base text-muted-foreground">Stay prepared. Check your emergency kit and safety guides.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((a) => (
            <li key={a.id}>
              <AlertCard alert={a} />
            </li>
          ))}
        </ul>
      )}
      <DemoNote />
      <footer>
        <SampleAlertsNote />
      </footer>
    </div>
  );
}
