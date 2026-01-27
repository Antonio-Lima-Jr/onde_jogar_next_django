'use client';

import TopNav from '@/app/components/ui/TopNav';
import EventMap from '@/app/components/Map';
import { createEvent } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type CreateEventPayload = {
    title: FormDataEntryValue | null;
    description: FormDataEntryValue | null;
    date: string | null;
    slots: number;
    latitude?: number;
    longitude?: number;
};

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const { auth } = useRequireAuth();

    const hasCoords = latitude !== null && longitude !== null;

    const handleFindNearMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setLatitude(lat);
                setLongitude(lng);
                setGeoLoading(false);
            },
            (error) => {
                console.error(error);
                alert('Unable to fetch your location.');
                setGeoLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!auth.token) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const dateValue = formData.get('date') as string;
        const isoDate = dateValue ? new Date(dateValue).toISOString() : null;

        const data: CreateEventPayload = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: isoDate,
            slots: parseInt(formData.get('slots') as string),
        };

        if (hasCoords) {
            data.latitude = latitude;
            data.longitude = longitude;
        }

        try {
            await createEvent(data, auth.token);
            router.push('/events');
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Failed to create event';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--color-background)] font-display text-[color:var(--color-text)]">
            <TopNav />
            <main className="max-w-[800px] mx-auto px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-[color:var(--color-text)] mb-8">Create New Event</h1>
                    <div className="relative flex items-center justify-between max-w-md mx-auto">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[color:var(--color-border)]"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-0.5 bg-primary"></div>
                        <div className="relative flex flex-col items-center">
                            <div className="size-4 rounded-full bg-primary shadow-[0_0_10px_rgba(89,242,13,0.3)]"></div>
                            <span className="text-[10px] font-bold mt-2 text-[color:var(--color-text)] uppercase">Details</span>
                        </div>
                        <div className="relative flex flex-col items-center">
                            <div className="size-4 rounded-full bg-primary shadow-[0_0_10px_rgba(89,242,13,0.3)]"></div>
                            <span className="text-[10px] font-bold mt-2 text-[color:var(--color-text)] uppercase">Location</span>
                        </div>
                        <div className="relative flex flex-col items-center">
                            <div className="size-4 rounded-full bg-[color:var(--color-border)]"></div>
                            <span className="text-[10px] font-bold mt-2 text-[color:var(--color-muted)] uppercase">Review</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-[color:var(--color-surface)] rounded-2xl border border-[color:var(--color-border)] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
                    <div>
                        <label htmlFor="title" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Event Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            required
                            className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                            placeholder="e.g. Saturday Morning 3v3 Scrimmage"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            required
                            rows={4}
                            className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none resize-none"
                            placeholder="What players should know about the game..."
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-0 block">
                                Location
                            </label>
                            <button
                                type="button"
                                onClick={handleFindNearMe}
                                disabled={geoLoading}
                                className="text-xs font-bold text-[color:var(--color-text)] hover:text-primary transition-colors disabled:opacity-60"
                            >
                                {geoLoading ? 'Locating...' : 'Find near me'}
                            </button>
                        </div>

                        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[color:var(--color-border)]">
                            <EventMap
                                latitude={latitude}
                                longitude={longitude}
                                onSelectLocation={(lat, lng) => {
                                    setLatitude(lat);
                                    setLongitude(lng);
                                }}
                            />
                        </div>

                        <p className="mt-2 text-xs font-semibold text-[color:var(--color-muted)]">
                            {hasCoords
                                ? `Selected: ${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`
                                : 'Click on the map to set the event location.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="date" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Date & Time</label>
                            <input
                                type="datetime-local"
                                id="date"
                                name="date"
                                required
                                className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none [color-scheme:light]"
                            />
                        </div>

                        <div>
                            <label htmlFor="slots" className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">Number of Slots</label>
                            <input
                                type="number"
                                id="slots"
                                name="slots"
                                required
                                min="1"
                                className="w-full bg-[color:var(--color-background)] border-[color:var(--color-border)] border rounded-xl px-4 py-3 text-[color:var(--color-text)] focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all outline-none"
                                placeholder="e.g., 10"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:brightness-105 text-[color:var(--color-on-primary)] text-lg font-black py-5 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? 'Publishing...' : 'CREATE EVENT'}
                            <span className="material-symbols-outlined">bolt</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
