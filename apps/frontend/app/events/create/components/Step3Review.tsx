'use client';

type Step3ReviewProps = {
    title: string;
    description: string;
    date: string;
    slots: number;
    hasCoords: boolean;
    latitude: number | null;
    longitude: number | null;
    categoryName: string | null;
};

export default function Step3Review({
    title,
    description,
    date,
    slots,
    hasCoords,
    latitude,
    longitude,
    categoryName,
}: Step3ReviewProps) {
    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6">
                <h2 className="text-lg font-extrabold text-[color:var(--color-text)] mb-4">Review your event</h2>
                <div className="space-y-3 text-sm text-[color:var(--color-text)]">
                    <div className="flex items-center justify-between">
                        <span className="text-[color:var(--color-muted)]">Title</span>
                        <span className="font-semibold">{title || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[color:var(--color-muted)]">Category</span>
                        <span className="font-semibold">{categoryName || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[color:var(--color-muted)]">Date & Time</span>
                        <span className="font-semibold">
                            {date ? new Date(date).toLocaleString() : '—'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[color:var(--color-muted)]">Slots</span>
                        <span className="font-semibold">{slots || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[color:var(--color-muted)]">Location</span>
                        <span className="font-semibold">
                            {hasCoords ? `${latitude?.toFixed(4)}, ${longitude?.toFixed(4)}` : '—'}
                        </span>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-background)] p-6">
                <h3 className="text-sm font-extrabold text-[color:var(--color-text)] uppercase tracking-wider mb-3">Description</h3>
                <p className="text-sm text-[color:var(--color-text)] leading-relaxed">{description || '—'}</p>
            </div>
        </div>
    );
}
