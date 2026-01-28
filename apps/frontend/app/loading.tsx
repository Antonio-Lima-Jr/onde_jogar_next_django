export default function Loading() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-medium text-[color:var(--color-muted)]">Loading...</p>
      </div>
    </div>
  );
}
