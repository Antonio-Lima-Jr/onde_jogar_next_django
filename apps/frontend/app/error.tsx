"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-2xl p-10 shadow-xl">
        <h1 className="text-3xl font-extrabold mb-3">Something went wrong</h1>
        <p className="text-[color:var(--color-muted)] mb-8">
          We couldn&apos;t load this page. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-[color:var(--color-on-primary)]"
          >
            Try again
          </button>
          <Link
            href="/events"
            className="rounded-full border border-[color:var(--color-border)] px-6 py-3 text-sm font-bold text-[color:var(--color-text)]"
          >
            Back to Events
          </Link>
        </div>
        {error?.digest ? (
          <p className="mt-6 text-[11px] text-[color:var(--color-muted)]">Ref: {error.digest}</p>
        ) : null}
      </div>
    </div>
  );
}
