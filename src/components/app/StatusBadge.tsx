import { Wifi, WifiOff } from "lucide-react";
import { useApp } from "@/lib/app-state";

export function StatusBadge() {
  const { online, t } = useApp();
  return (
    <span
      role="status"
      aria-live="polite"
      className={
        online
          ? "inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-sm font-bold text-success"
          : "inline-flex items-center gap-1.5 rounded-full bg-warning px-3 py-1 text-sm font-bold text-warning-foreground"
      }
    >
      {online ? <Wifi className="h-4 w-4" aria-hidden /> : <WifiOff className="h-4 w-4" aria-hidden />}
      {online ? t("status.online") : t("status.offline")}
    </span>
  );
}
