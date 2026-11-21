import { MapPin } from "lucide-react";
import type { Alert } from "@/data/alerts";
import { formatTime } from "@/lib/messages";
import { SeverityBadge, SEVERITY_BORDER } from "./SeverityBadge";
import { useHydrated } from "@tanstack/react-router";

export function AlertCard({ alert }: { alert: Alert }) {
  const hydrated = useHydrated();
  return (
    <article className={`rounded-xl border border-l-8 bg-card p-4 shadow-tile ${SEVERITY_BORDER[alert.severity]}`}>
      <div className="flex flex-wrap items-center gap-2">
        <SeverityBadge severity={alert.severity} />
        <span className="text-sm font-bold text-primary">{alert.state}</span>
        <time className="ml-auto text-sm text-muted-foreground" dateTime={alert.issuedAt}>
          {hydrated ? formatTime(alert.issuedAt) : ""}
        </time>
      </div>
      <h3 className="mt-2 text-lg leading-snug font-bold">{alert.title}</h3>
      <p className="mt-1 flex gap-1.5 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        {alert.area}
      </p>
      <p className="mt-2 text-base">{alert.detail}</p>
      <p className="mt-2 rounded-lg bg-secondary p-3 text-base font-bold text-secondary-foreground">{alert.advice}</p>
    </article>
  );
}
