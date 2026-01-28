import TopNav from "@/app/components/ui/TopNav";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)]">
      <TopNav />
      <main className="max-w-[960px] mx-auto px-4 py-8">
        <div className="h-8 w-48 bg-[color:var(--color-surface)] rounded-full animate-pulse mb-6" />
        <div className="h-64 bg-[color:var(--color-surface)] rounded-xl animate-pulse mb-8" />
        <div className="h-10 w-40 bg-[color:var(--color-surface)] rounded-full animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-36 rounded-xl bg-[color:var(--color-surface)] animate-pulse" />
          ))}
        </div>
      </main>
    </div>
  );
}
