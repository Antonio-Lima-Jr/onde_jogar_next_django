import TopNav from '../components/ui/TopNav';
import EventCard from '../components/EventCard';
import { fetchEvents } from '@/lib/api';
import { Event } from '@/types/event';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    let events: Event[] = [];

    try {
        events = await fetchEvents();
    } catch (error) {
        console.error('Failed to fetch events:', error);
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <main className="flex flex-1 overflow-hidden">
                {/* Left Sidebar - Event List */}
                <div className="w-[450px] flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-background)] z-40">
                    {/* Filters */}
                    <div className="p-4 border-b border-[color:var(--color-border)]">
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/15 border border-primary/40 px-4 cursor-pointer hover:bg-primary/25 transition-all">
                                <span className="text-[color:var(--color-text)] text-xs font-semibold">Sport Type</span>
                                <span className="material-symbols-outlined text-sm text-[color:var(--color-text)]">keyboard_arrow_down</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 hover:border-[color:var(--color-muted)] transition-colors cursor-pointer">
                                <span className="text-[color:var(--color-muted)] text-xs font-semibold">Distance</span>
                                <span className="material-symbols-outlined text-sm text-[color:var(--color-muted)]">keyboard_arrow_down</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 hover:border-[color:var(--color-muted)] transition-colors cursor-pointer">
                                <span className="text-[color:var(--color-muted)] text-xs font-semibold">Date</span>
                                <span className="material-symbols-outlined text-sm text-[color:var(--color-muted)]">keyboard_arrow_down</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 hover:border-[color:var(--color-muted)] transition-colors cursor-pointer">
                                <span className="text-[color:var(--color-muted)] text-xs font-semibold">Skill</span>
                                <span className="material-symbols-outlined text-sm text-[color:var(--color-muted)]">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>

                    {/* Event List */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[color:var(--color-background)]/60">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-[color:var(--color-text)]">{events.length} Events Nearby</h3>
                            <span className="text-xs text-[color:var(--color-muted)] uppercase font-bold tracking-widest">Sort: Popular</span>
                        </div>
                        {events.length === 0 ? (
                            <div className="text-center text-[color:var(--color-muted)] mt-8">
                                <p>No events found. Create one to get started!</p>
                            </div>
                        ) : (
                            events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))
                        )}
                    </div>
                </div>

                {/* Right Section - Map */}
                <div className="flex-1 relative bg-[color:var(--color-background)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-surface)] to-[color:var(--color-background)] opacity-60"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Map Search */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[320px] shadow-2xl z-10">
                            <div className="flex w-full items-stretch rounded-full h-12 bg-[color:var(--color-surface)] px-2 border border-[color:var(--color-border)]">
                                <div className="text-primary flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined">near_me</span>
                                </div>
                                <input
                                    className="form-input flex w-full border-none bg-transparent focus:ring-0 h-full text-sm font-medium text-[color:var(--color-text)] placeholder-[color:var(--color-muted)]"
                                    placeholder="Search this area..."
                                />
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="text-center text-[color:var(--color-muted)]">
                            <span className="material-symbols-outlined text-6xl mb-4 block">map</span>
                            <p className="text-lg font-semibold text-[color:var(--color-text)]">Map View</p>
                            <p className="text-sm">Coming soon</p>
                        </div>

                        {/* Map Controls */}
                        <div className="absolute bottom-10 right-10 flex flex-col gap-3">
                            <div className="flex flex-col bg-[color:var(--color-surface)] rounded-full shadow-2xl border border-[color:var(--color-border)] overflow-hidden">
                                <button className="p-3 hover:bg-[color:var(--color-border)] transition-colors border-b border-[color:var(--color-border)]">
                                    <span className="material-symbols-outlined text-[color:var(--color-text)]">add</span>
                                </button>
                                <button className="p-3 hover:bg-[color:var(--color-border)] transition-colors">
                                    <span className="material-symbols-outlined text-[color:var(--color-text)]">remove</span>
                                </button>
                            </div>
                            <button className="size-12 bg-[color:var(--color-surface)] rounded-full shadow-2xl border border-[color:var(--color-border)] flex items-center justify-center hover:bg-[color:var(--color-border)] transition-colors">
                                <span className="material-symbols-outlined text-primary">my_location</span>
                            </button>
                        </div>

                        {/* Map Legend */}
                        <div className="absolute bottom-10 left-10 bg-[color:var(--color-surface)]/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-[color:var(--color-border)]">
                            <p className="text-[10px] font-bold text-[color:var(--color-muted)] uppercase tracking-widest mb-2">Map Legend</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]"></span>
                                    <span className="text-xs font-medium text-[color:var(--color-text)]">Ball Sports</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span>
                                    <span className="text-xs font-medium text-[color:var(--color-text)]">Racket</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                                    <span className="text-xs font-medium text-[color:var(--color-text)]">Fitness</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
