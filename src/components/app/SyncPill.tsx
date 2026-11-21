import { CheckCircle2, CloudUpload } from "lucide-react";
import type { SyncStatus } from "@/lib/queue";
import { useApp } from "@/lib/app-state";

export function SyncPill({ status }: { status: SyncStatus }) {
  const { t } = useApp();
  return status === "pending" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-0.5 text-sm font-bold text-accent-foreground">
      <CloudUpload className="h-4 w-4" aria-hidden />
      {t("sync.pending")}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-success-soft px-2.5 py-0.5 text-sm font-bold text-success">
      <CheckCircle2 className="h-4 w-4" aria-hidden />
      {t("sync.synced")}
    </span>
  );
}
