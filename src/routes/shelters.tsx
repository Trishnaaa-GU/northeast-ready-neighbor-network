import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Tent, Search, Droplets, Stethoscope, Zap, Soup, BedDouble, MapPin, Phone } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { SHELTERS, type Shelter } from "@/data/shelters";
import { NE_STATES, type NEState } from "@/data/alerts";
import { PageHeader } from "@/components/app/PageHeader";
import { DemoNote } from "@/components/app/DemoNote";

export const Route = createFileRoute("/shelters")({
  head: () => ({
    meta: [
      { title: "Relief shelters by district — Northeast Connect" },
      { name: "description", content: "District-wise relief shelters with capacity and facilities across North East India." },
      { property: "og:title", content: "Relief shelters by district" },
      { property: "og:description", content: "Find a nearby relief camp, its capacity, water and medical help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SheltersPage,
});

const FACILITY = {
  water: { icon: Droplets, label: "Water" },
  medical: { icon: Stethoscope, label: "Medical" },
  power: { icon: Zap, label: "Power" },
  food: { icon: Soup, label: "Food" },
  blankets: { icon: BedDouble, label: "Blankets" },
} as const;

function SheltersPage() {
  const { t } = useApp();
  const [q, setQ] = useState("");
  const [state, setState] = useState<NEState | "all">("all");

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = SHELTERS.filter(
      (s) =>
        (state === "all" || s.state === state) &&
        (!needle || `${s.district} ${s.place} ${s.name} ${s.state}`.toLowerCase().includes(needle)),
    );
    const map = new Map<string, Shelter[]>();
    for (const s of filtered) {
      const key = `${s.district}, ${s.state}`;
      map.set(key, [...(map.get(key) ?? []), s]);
    }
    return [...map.entries()];
  }, [q, state]);

  return (
    <div className="animate-in fade-in space-y-4 duration-300">
      <PageHeader icon={Tent} title={t("shelters.title")} />

      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="relative block">
          <span className="sr-only">{t("shelters.search")}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("shelters.search")}
            className="h-12 w-full rounded-xl border border-input bg-card pr-3 pl-10 text-base"
          />
        </label>
        <label>
          <span className="sr-only">{t("alerts.filter")}</span>
          <select
            value={state}
            onChange={(e) => setState(e.target.value as NEState | "all")}
            className="h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-bold"
          >
            <option value="all">{t("alerts.allStates")}</option>
            {NE_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-8 text-center">
          <Tent className="h-10 w-10 text-muted-foreground" aria-hidden />
          <p className="text-lg font-bold">{t("shelters.none")}</p>
          <a href="tel:1077" className="mt-2 inline-flex h-12 items-center gap-2 rounded-lg bg-primary px-4 font-bold text-primary-foreground">
            <Phone className="h-5 w-5" aria-hidden /> 1077
          </a>
        </div>
      ) : (
        groups.map(([district, items]) => (
          <section key={district} aria-label={district}>
            <h2 className="mb-2 flex items-center gap-1.5 text-lg font-bold text-primary">
              <MapPin className="h-5 w-5" aria-hidden />
              {district}
            </h2>
            <ul className="space-y-3">
              {items.map((s) => {
                const free = s.capacity - s.occupied;
                const pct = Math.round((s.occupied / s.capacity) * 100);
                const nearlyFull = pct >= 85;
                return (
                  <li key={s.id} className="rounded-xl border bg-card p-4 shadow-tile">
                    <p className="text-lg leading-snug font-bold">{s.name}</p>
                    <p className="text-sm text-muted-foreground">{s.place}</p>
                    <div className="mt-3 flex items-baseline justify-between text-base">
                      <span>
                        {t("shelters.capacity")}: <b>{s.capacity}</b>
                      </span>
                      <span className={nearlyFull ? "font-bold text-sos" : "font-bold text-success"}>
                        {free} places free
                      </span>
                    </div>
                    <div
                      className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted"
                      role="meter"
                      aria-valuemin={0}
                      aria-valuemax={s.capacity}
                      aria-valuenow={s.occupied}
                      aria-label={`${s.occupied} of ${s.capacity} places in use`}
                    >
                      <div className={nearlyFull ? "h-full bg-sos" : "h-full bg-primary"} style={{ width: `${pct}%` }} />
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {s.facilities.map((f) => {
                        const F = FACILITY[f];
                        return (
                          <li key={f} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm font-bold text-secondary-foreground">
                            <F.icon className="h-4 w-4" aria-hidden />
                            {F.label}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
      <DemoNote />
    </div>
  );
}
