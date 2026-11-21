import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="h-6 w-6" aria-hidden />
      </span>
      <div className="min-w-0">
        <h1 className="font-display text-2xl leading-tight font-bold text-foreground">{title}</h1>
        {children && <div className="mt-1 text-base text-muted-foreground">{children}</div>}
      </div>
    </div>
  );
}
