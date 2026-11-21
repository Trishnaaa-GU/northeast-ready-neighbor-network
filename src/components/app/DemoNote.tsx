import { Info } from "lucide-react";
import { useApp } from "@/lib/app-state";

export function DemoNote() {
  const { t } = useApp();
  return (
    <p className="flex gap-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      {t("common.demo")}
    </p>
  );
}
