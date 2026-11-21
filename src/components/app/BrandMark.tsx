export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="11" className="fill-primary-foreground" />
      <circle cx="33" cy="14" r="5.5" className="fill-warning" />
      <path d="M6 37 L19 16 L27 28 L32 22 L42 37 Z" className="fill-primary" />
      <path d="M19 16 L15.5 22 L19 20.5 L22 23 Z" className="fill-primary-foreground" />
      <rect x="6" y="38.5" width="36" height="3" rx="1.5" className="fill-warning" />
    </svg>
  );
}
