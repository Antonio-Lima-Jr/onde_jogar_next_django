import Header from '../../components/Header';
import { createEvent } from '@/lib/api';
import { redirect } from 'next/navigation';

async function handleCreateEvent(formData: FormData) {
    'use server';

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const date = formData.get('date') as string;
    const location = formData.get('location') as string;
    const slots = parseInt(formData.get('slots') as string);

    try {
        const event = await createEvent({
            title,
            description,
            date,
            location,
            slots,
        });
        redirect(`/events/${event.id}`);
    } catch (error) {
        console.error('Failed to create event:', error);
    }
}

export default function CreateEventPage() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto bg-dark-bg">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-white mb-2">Create New Event</h1>
                        <p className="text-slate-400">Fill in the details to create a new sports event</p>
                    </div>

                    <form action={handleCreateEvent} className="bg-dark-card rounded-2xl p-8 border border-dark-border shadow-xl">
                        <div className="space-y-6">
                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
                                    Event Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="e.g., 3v3 Basketball Showdown"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    required
                                    rows={4}
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                                    placeholder="Describe your event..."
                                />
                            </div>

                            {/* Date & Time */}
                            <div>
                                <label htmlFor="date" className="block text-sm font-semibold text-white mb-2">
                                    Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label htmlFor="location" className="block text-sm font-semibold text-white mb-2">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="location"
                                    required
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="e.g., Downtown Courts, Main St."
                                />
                            </div>

                            {/* Slots */}
                            <div>
                                <label htmlFor="slots" className="block text-sm font-semibold text-white mb-2">
                                    Number of Slots
                                </label>
                                <input
                                    type="number"
                                    id="slots"
                                    name="slots"
                                    required
                                    min="1"
                                    className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    placeholder="e.g., 10"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-dark-border">
                            <button
                                type="submit"
                                className="flex-1 bg-primary hover:brightness-110 text-dark-bg px-8 py-3 rounded-full font-bold text-base transition-all transform active:scale-95 shadow-[0_0_20px_rgba(13,242,13,0.3)]"
                            >
                                Create Event
                            </button>
                            <a
                                href="/events"
                                className="flex-1 bg-dark-bg hover:bg-dark-border text-white px-8 py-3 rounded-full font-bold text-base transition-all text-center border border-dark-border"
                            >
                                Cancel
                            </a>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
