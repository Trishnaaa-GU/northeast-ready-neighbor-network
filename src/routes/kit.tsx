import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Backpack, Check, RotateCcw } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { KIT_GROUPS } from "@/data/kit";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/kit")({
  head: () => ({
    meta: [
      { title: "Emergency kit checklist — Northeast Connect" },
      { name: "description", content: "Check off water, food, torch, medicines and documents for your emergency bag. Saved on your phone." },
      { property: "og:title", content: "Emergency kit checklist — Northeast Connect" },
      { property: "og:description", content: "A disaster go-bag checklist for the hills and plains of North East India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: KitPage,
});

const KIT_KEY = "nc:kit";
const TOTAL = KIT_GROUPS.reduce((n, g) => n + g.items.length, 0);

function KitPage() {
  const { t } = useApp();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      setChecked(JSON.parse(localStorage.getItem(KIT_KEY) ?? "{}"));
    } catch {
      setChecked({});
    }
  }, []);

  const update = (next: Record<string, boolean>) => {
    setChecked(next);
    localStorage.setItem(KIT_KEY, JSON.stringify(next));
  };

  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / TOTAL) * 100);

  return (
    <div className="animate-in fade-in space-y-5 duration-300">
      <PageHeader icon={Backpack} title={t("kit.title")}>
        Keep one bag ready for each family. Check it every 6 months.
      </PageHeader>

      <div className="rounded-2xl border bg-card p-4 shadow-tile">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold">
            {done}/{TOTAL} <span className="text-base font-normal text-muted-foreground">{t("kit.packed")}</span>
          </p>
          <button
            type="button"
            onClick={() => update({})}
            disabled={done === 0}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg border px-3 text-sm font-bold text-primary disabled:opacity-40"
          >
            <RotateCcw className="h-4 w-4" aria-hidden /> {t("kit.reset")}
          </button>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={TOTAL} aria-valuenow={done} aria-label="Kit packed">
          <div className="h-full bg-success transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        {done === TOTAL && <p className="mt-2 font-bold text-success">Your kit is ready. Well done.</p>}
      </div>

      {KIT_GROUPS.map((g) => (
        <section key={g.id} aria-labelledby={`g-${g.id}`}>
          <h2 id={`g-${g.id}`} className="mb-2 text-lg font-bold text-primary">
            {g.title}
          </h2>
          <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
            {g.items.map((item) => {
              const on = Boolean(checked[item.id]);
              return (
                <li key={item.id}>
                  <label className="flex min-h-16 cursor-pointer items-center gap-3 px-4 py-3 active:bg-muted">
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => update({ ...checked, [item.id]: !on })}
                      className="peer sr-only"
                    />
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-input bg-card text-success-foreground transition-colors peer-checked:border-success peer-checked:bg-success peer-focus-visible:outline-3 peer-focus-visible:outline-ring">
                      {on && <Check className="h-5 w-5" aria-hidden />}
                    </span>
                    <span className={on ? "text-base text-muted-foreground line-through" : "text-base"}>{item.label}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
