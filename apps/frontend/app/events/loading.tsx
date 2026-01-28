import TopNav from "../components/ui/TopNav";

export default function EventsLoading() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <main className="flex flex-1 overflow-hidden">
        <div className="w-[450px] flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-background)] z-40">
          <div className="p-4 border-b border-[color:var(--color-border)]">
            <div className="h-9 w-40 rounded-full bg-[color:var(--color-surface)] animate-pulse" />
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-28 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[color:var(--color-background)]">
          <div className="h-full w-full bg-[color:var(--color-surface)] animate-pulse" />
        </div>
      </main>
    </div>
  );
}
