import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-10 shadow-xl">
        <h1 className="text-4xl font-extrabold mb-3">Page not found</h1>
        <p className="text-[color:var(--color-muted)] mb-8">
          We couldn&apos;t find what you&apos;re looking for.
        </p>
        <Link
          href="/events"
          className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-[color:var(--color-on-primary)]"
        >
          Browse events
        </Link>
      </div>
    </div>
  );
}
