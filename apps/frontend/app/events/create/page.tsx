'use client';

import TopNav from '@/app/components/ui/TopNav';
import { createEvent } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function CreateEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            router.push('/login');
            return;
        }
        setToken(storedToken);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const dateValue = formData.get('date') as string;
        const isoDate = dateValue ? new Date(dateValue).toISOString() : null;

        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: isoDate,
            location: formData.get('location'),
            slots: parseInt(formData.get('slots') as string),
        };

        try {
            await createEvent(data, token);
            router.push('/events');
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background-dark font-display">
            <TopNav />
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-6 py-12 text-white">
                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">Create New Event</h1>
                        <p className="text-slate-400 font-medium text-lg">Organize your next game and find players near you.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-surface-dark rounded-[2rem] p-8 md:p-12 border border-border-dark shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-3xl"></div>

                        <div className="space-y-8 relative">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    className="w-full bg-background-dark border border-border-dark rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    placeholder="e.g., 3v3 Basketball Showdown"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={4}
                                    className="w-full bg-background-dark border border-border-dark rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all resize-none outline-none"
                                    placeholder="What players should know about the game..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Date & Time */}
                                <div>
                                    <label htmlFor="date" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                                        Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="date"
                                        name="date"
                                        required
                                        className="w-full bg-background-dark border border-border-dark rounded-2xl px-5 py-4 text-white focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none [color-scheme:dark]"
                                    />
                                </div>

                                {/* Slots */}
                                <div>
                                    <label htmlFor="slots" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                                        Number of Slots
                                    </label>
                                    <input
                                        type="number"
                                        id="slots"
                                        name="slots"
                                        required
                                        min="1"
                                        className="w-full bg-background-dark border border-border-dark rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                        placeholder="e.g., 10"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                                    Venue/Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    className="w-full bg-background-dark border border-border-dark rounded-2xl px-5 py-4 text-white placeholder:text-slate-700 focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all outline-none"
                                    placeholder="e.g., Downtown Courts, Main St."
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-border-dark relative">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-primary text-background-dark px-10 py-5 rounded-full font-black text-sm uppercase tracking-widest transition-all transform active:scale-[0.98] shadow-[0_0_30px_rgba(13,242,13,0.3)] hover:shadow-[0_0_40px_rgba(13,242,13,0.5)] disabled:opacity-50"
                            >
                                {loading ? 'Publishing...' : 'Publish Event'}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/events')}
                                className="flex-1 bg-background-dark text-slate-400 px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest transition-all text-center border border-border-dark hover:text-white hover:bg-surface-dark"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
