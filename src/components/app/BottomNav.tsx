import { Link } from "@tanstack/react-router";
import { BookOpen, Home, Megaphone, Phone, TriangleAlert } from "lucide-react";
import { useApp } from "@/lib/app-state";
import type { TKey } from "@/lib/i18n";

const ITEMS = [
  { to: "/", key: "nav.home", icon: Home, exact: true },
  { to: "/alerts", key: "nav.alerts", icon: TriangleAlert, exact: false },
  { to: "/guides", key: "nav.guides", icon: BookOpen, exact: false },
  { to: "/report", key: "nav.report", icon: Megaphone, exact: false },
  { to: "/helplines", key: "nav.helplines", icon: Phone, exact: false },
] as const satisfies readonly { to: string; key: TKey; icon: unknown; exact: boolean }[];

export function BottomNav() {
  const { t, pending } = useApp();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t bg-card pb-safe">
      <ul className="mx-auto grid max-w-2xl grid-cols-5">
        {ITEMS.map(({ to, key, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="group relative flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-xs font-bold text-muted-foreground data-[status=active]:text-primary"
            >
              <span className="flex h-8 w-12 items-center justify-center rounded-full transition-colors group-data-[status=active]:bg-secondary">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="leading-none">{t(key)}</span>
              {to === "/report" && pending > 0 && (
                <span className="absolute top-1.5 right-[22%] min-w-5 rounded-full bg-warning px-1 text-center text-[0.7rem] leading-5 text-warning-foreground">
                  {pending}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
