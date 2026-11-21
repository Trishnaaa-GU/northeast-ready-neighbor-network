import { useEffect, useState } from "react";
import { Clock, RefreshCw, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { isAlertsStale } from "@/lib/alerts-freshness";
import { formatTime } from "@/lib/messages";

export function AlertsUpdated({ showButton = false }: { showButton?: boolean }) {
  const { t, alertsUpdatedAt, refreshAlerts, online } = useApp();
  // Time-dependent UI renders only after hydration so server and client agree.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, [alertsUpdatedAt]);

  const stale = now ? isAlertsStale(alertsUpdatedAt, now) : false;

  return (
    <div className={stale ? "rounded-xl border-2 border-warning bg-warning-soft p-3" : "rounded-xl border bg-card p-3"}>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
        <span className="font-bold">{t("alerts.lastUpdated")}:</span>
        <time dateTime={alertsUpdatedAt}>{now ? formatTime(alertsUpdatedAt) : ""}</time>
        {showButton && (
          <button
            type="button"
            disabled={!online}
            onClick={() => {
              if (refreshAlerts()) toast.success("Alerts checked. No new alerts since the last update.");
            }}
            className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-lg border bg-card px-3 font-bold text-primary disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            {t("alerts.check")}
          </button>
        )}
      </div>
      {stale && (
        <p className="mt-2 flex gap-2 text-sm font-bold text-warning-foreground">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          {t("alerts.stale")}
        </p>
      )}
    </div>
  );
}
