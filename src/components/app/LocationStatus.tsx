import { Crosshair, Loader2, MapPin, MapPinOff } from "lucide-react";
import type { useGeolocation } from "@/hooks/use-geolocation";
import { formatCoords } from "@/lib/messages";
import { useApp } from "@/lib/app-state";

export function LocationStatus({ geo }: { geo: ReturnType<typeof useGeolocation> }) {
  const { t } = useApp();
  const { state, locate } = geo;
  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex flex-wrap items-center gap-3">
        {state.status === "ok" ? (
          <MapPin className="h-6 w-6 text-success" aria-hidden />
        ) : state.status === "error" ? (
          <MapPinOff className="h-6 w-6 text-sos" aria-hidden />
        ) : (
          <MapPin className="h-6 w-6 text-muted-foreground" aria-hidden />
        )}
        <div className="min-w-0 flex-1" aria-live="polite">
          <p className="text-sm font-bold text-muted-foreground">{t("report.location")}</p>
          {state.status === "ok" && (
            <p className="text-base font-bold">
              {formatCoords(state.point)}
              {state.point.accuracy ? <span className="font-normal text-muted-foreground"> · ±{Math.round(state.point.accuracy)} m</span> : null}
            </p>
          )}
          {state.status === "locating" && <p className="text-base">Finding GPS signal…</p>}
          {state.status === "error" && <p className="text-base text-sos">{state.message}</p>}
          {state.status === "idle" && <p className="text-base">GPS works without internet.</p>}
        </div>
        <button
          type="button"
          onClick={() => void locate()}
          disabled={state.status === "locating"}
          className="inline-flex h-11 items-center gap-1.5 rounded-lg border-2 border-primary px-3 font-bold text-primary disabled:opacity-60"
        >
          {state.status === "locating" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Crosshair className="h-4 w-4" aria-hidden />}
          {t("report.getLocation")}
        </button>
      </div>
    </div>
  );
}
