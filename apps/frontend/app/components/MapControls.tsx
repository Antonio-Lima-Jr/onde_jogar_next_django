"use client";

type MapControlsProps = {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onMyLocation?: () => void;
  className?: string;
};

export default function MapControls({
  onZoomIn,
  onZoomOut,
  onMyLocation,
  className,
}: MapControlsProps) {
  const containerClassName = className
    ? `flex flex-col gap-3 ${className}`
    : "flex flex-col gap-3";

  return (
    <div className={containerClassName}>
      <div className="flex flex-col bg-[color:var(--color-surface)] rounded-full shadow-2xl border border-[color:var(--color-border)] overflow-hidden">
        <button
          type="button"
          onClick={onZoomIn}
          className="p-3 hover:bg-[color:var(--color-border)] transition-colors border-b border-[color:var(--color-border)]"
          aria-label="Zoom in"
          title="Zoom in"
        >
          <span className="material-symbols-outlined text-[color:var(--color-text)]">
            add
          </span>
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="p-3 hover:bg-[color:var(--color-border)] transition-colors"
          aria-label="Zoom out"
          title="Zoom out"
        >
          <span className="material-symbols-outlined text-[color:var(--color-text)]">
            remove
          </span>
        </button>
      </div>
      <button
        type="button"
        onClick={onMyLocation}
        className="size-12 bg-[color:var(--color-surface)] rounded-full shadow-2xl border border-[color:var(--color-border)] flex items-center justify-center hover:bg-[color:var(--color-border)] transition-colors"
        aria-label="Go to my location"
        title="Go to my location"
      >
        <span className="material-symbols-outlined text-primary">
          my_location
        </span>
      </button>
    </div>
  );
}

