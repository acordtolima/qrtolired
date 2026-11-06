export function Mark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-current" />
      <rect x="6" y="6" width="8" height="8" rx="1.5" className="fill-paper" />
      <rect x="18" y="6" width="8" height="8" rx="1.5" className="fill-paper" />
      <rect x="6" y="18" width="8" height="8" rx="1.5" className="fill-paper" />
      <circle cx="22" cy="22" r="3.2" className="fill-stamp" />
    </svg>
  );
}
