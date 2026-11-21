import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { GUIDES, type Guide, type Phase } from "@/data/guides";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "Safety guides: flood, landslide, earthquake, cloudburst — Northeast Connect" },
      { name: "description", content: "Simple step-by-step guides for what to do before, during and after a disaster. Works offline." },
      { property: "og:title", content: "Disaster safety guides — Northeast Connect" },
      { property: "og:description", content: "Before, during and after: flood, landslide, earthquake and cloudburst." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: GuidesPage,
});

const PHASES: { id: Phase; tone: string }[] = [
  { id: "before", tone: "bg-secondary text-secondary-foreground" },
  { id: "during", tone: "bg-sos text-sos-foreground" },
  { id: "after", tone: "bg-success text-success-foreground" },
];

function GuidesPage() {
  const { t } = useApp();
  const [active, setActive] = useState<Guide["id"]>("flood");
  const guide = GUIDES.find((g) => g.id === active) ?? GUIDES[0]!;

  return (
    <div className="animate-in fade-in space-y-5 duration-300">
      <PageHeader icon={BookOpen} title={t("guides.title")} />

      <div role="tablist" aria-label={t("guides.title")} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {GUIDES.map((g) => {
          const selected = g.id === active;
          return (
            <button
              key={g.id}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="guide-panel"
              onClick={() => setActive(g.id)}
              className={
                selected
                  ? "flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl bg-primary p-3 text-lg font-bold text-primary-foreground shadow-tile"
                  : "flex min-h-20 flex-col items-center justify-center gap-1.5 rounded-xl border bg-card p-3 text-lg font-bold text-foreground"
              }
            >
              <g.icon className="h-7 w-7" aria-hidden />
              {t(g.titleKey)}
            </button>
          );
        })}
      </div>

      <section id="guide-panel" role="tabpanel" key={guide.id} className="animate-in fade-in slide-in-from-bottom-1 space-y-4 duration-200">
        <p className="text-base text-muted-foreground">{guide.summary}</p>
        {PHASES.map(({ id, tone }) => (
          <div key={id} className="overflow-hidden rounded-2xl border bg-card shadow-tile">
            <h2 className={`px-4 py-2.5 text-lg font-bold ${tone}`}>
              {t(`phase.${id}`)} · {t(guide.titleKey)}
            </h2>
            <ol className="divide-y">
              {guide.phases[id].map((step, i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="pt-1.5 text-base leading-snug">
                    <b className="mr-1 text-primary">{i + 1}.</b>
                    {step.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>
    </div>
  );
}
