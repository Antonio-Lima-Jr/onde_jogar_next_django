import TopNav from "@/app/components/ui/TopNav";

export default function EventLoading() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)]">
      <TopNav />
      <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-8">
        <div className="aspect-[21/9] w-full rounded-2xl bg-[color:var(--color-surface)] animate-pulse mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-40 rounded-2xl bg-[color:var(--color-surface)] animate-pulse" />
            ))}
          </div>
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-48 rounded-2xl bg-[color:var(--color-surface)] animate-pulse" />
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
