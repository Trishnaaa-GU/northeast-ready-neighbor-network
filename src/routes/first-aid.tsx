import { createFileRoute } from "@tanstack/react-router";
import { Cross, ChevronDown, Phone, Ban } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { FIRST_AID } from "@/data/firstAid";
import { PageHeader } from "@/components/app/PageHeader";

export const Route = createFileRoute("/first-aid")({
  head: () => ({
    meta: [
      { title: "First aid guides: bleeding, fractures, hypothermia, drowning — Northeast Connect" },
      { name: "description", content: "Offline first aid steps for bleeding, broken bones, extreme cold and drowning." },
      { property: "og:title", content: "Offline first aid guides — Northeast Connect" },
      { property: "og:description", content: "Simple first aid steps that work with no internet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FirstAidPage,
});

function FirstAidPage() {
  const { t } = useApp();
  return (
    <div className="animate-in fade-in space-y-4 duration-300">
      <PageHeader icon={Cross} title={t("firstAid.title")}>
        These steps help until trained help arrives.
      </PageHeader>
      <a href="tel:108" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-sos text-lg font-bold text-sos-foreground">
        <Phone className="h-5 w-5" aria-hidden /> Ambulance 108 · Emergency 112
      </a>
      <ul className="space-y-3">
        {FIRST_AID.map((g, idx) => (
          <li key={g.id}>
            <details open={idx === 0} className="group overflow-hidden rounded-2xl border bg-card shadow-tile">
              <summary className="flex min-h-16 cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sos-soft text-sos">
                  <g.icon className="h-6 w-6" aria-hidden />
                </span>
                <span className="flex-1 text-lg font-bold">{t(g.titleKey)}</span>
                <ChevronDown className="h-6 w-6 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
              </summary>
              <div className="space-y-3 border-t px-4 py-4">
                <p className="rounded-lg bg-sos-soft p-3 text-base font-bold text-sos">{g.urgent}</p>
                <ol className="space-y-2.5">
                  {g.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 text-base leading-snug">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                      <span className="pt-1">{s}</span>
                    </li>
                  ))}
                </ol>
                <ul className="space-y-1.5 rounded-lg bg-muted p-3">
                  {g.dont.map((d, i) => (
                    <li key={i} className="flex gap-2 text-base">
                      <Ban className="mt-0.5 h-5 w-5 shrink-0 text-sos" aria-hidden />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
