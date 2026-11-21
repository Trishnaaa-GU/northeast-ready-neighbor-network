import { Link } from "@tanstack/react-router";
import { Download, Type } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { LANGS, type Lang } from "@/lib/i18n";
import { BrandMark } from "./BrandMark";
import { StatusBadge } from "./StatusBadge";

export function AppHeader() {
  const { lang, setLang, t, largeText, toggleLargeText, isStandalone, promptInstall } = useApp();

  const onInstall = async () => {
    const result = await promptInstall();
    if (result === "manual") {
      toast.info("To install: open your browser menu (⋮ or Share) and choose “Add to Home Screen”.", {
        duration: 8000,
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-gradient-header text-primary-foreground shadow-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pt-3 pb-2">
        <Link to="/" className="flex min-w-0 items-center gap-2.5 rounded-lg" aria-label="Northeast Connect home">
          <BrandMark />
          <span className="truncate font-display text-lg leading-tight font-bold tracking-tight">Northeast Connect</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <label className="sr-only" htmlFor="lang-select">
            {t("header.language")}
          </label>
          <select
            id="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="h-11 rounded-lg border border-primary-foreground/30 bg-primary-deep px-2 text-sm font-bold text-primary-foreground"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={toggleLargeText}
            aria-pressed={largeText}
            aria-label={t("header.largeText")}
            title={t("header.largeText")}
            className={
              largeText
                ? "flex h-11 w-11 items-center justify-center rounded-lg bg-primary-foreground text-primary"
                : "flex h-11 w-11 items-center justify-center rounded-lg border border-primary-foreground/30 text-primary-foreground"
            }
          >
            <Type className="h-5 w-5" aria-hidden />
            <span className="text-xs font-bold" aria-hidden>
              +
            </span>
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-2 px-4 pb-3">
        <div className="flex flex-col items-start gap-1">
          <StatusBadge />
          <p className="text-sm font-semibold text-success-soft">
            Works offline: guides and helplines saved on this device.
          </p>
        </div>
        {!isStandalone && (
          <button
            type="button"
            onClick={onInstall}
            className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-primary-foreground px-3 text-sm font-bold text-primary transition-transform active:scale-95"
          >
            <Download className="h-4 w-4" aria-hidden />
            {t("header.install")}
          </button>
        )}
      </div>
    </header>
  );
}
