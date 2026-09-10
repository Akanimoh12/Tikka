type WidgetPlaceholderProps = {
  label?: string;
  className?: string;
};

export function WidgetPlaceholder({
  label = "Tikka widget mounts here",
  className = "",
}: WidgetPlaceholderProps) {
  return (
    <div
      className={`border-2 border-[var(--of-ink)] bg-[var(--of-warm)] p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[320px] ${className}`}
    >
      <div className="of-pill border-2 border-[var(--of-ink)] bg-[var(--of-yellow)] px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-wide">
        Placeholder
      </div>
      <p className="font-[family-name:var(--font-display)] text-[1.3rem] font-extrabold leading-tight">
        {label}
      </p>
      <p className="text-[0.85rem] font-semibold text-[var(--of-muted)] max-w-[24ch]">
        The real prediction widget embeds here once the SDK is wired up.
      </p>
    </div>
  );
}
