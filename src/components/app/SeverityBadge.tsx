import type { Severity } from "@/data/alerts";
import { useApp } from "@/lib/app-state";

const STYLES: Record<Severity, string> = {
  red: "bg-sos text-sos-foreground",
  orange: "bg-warning text-warning-foreground",
  yellow: "bg-caution text-caution-foreground",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { t } = useApp();
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-sm font-bold uppercase tracking-wide ${STYLES[severity]}`}>
      <span className="h-2 w-2 rounded-full bg-current opacity-80" aria-hidden />
      {t(`sev.${severity}`)}
    </span>
  );
}

export const SEVERITY_BORDER: Record<Severity, string> = {
  red: "border-l-sos",
  orange: "border-l-warning",
  yellow: "border-l-caution",
};
