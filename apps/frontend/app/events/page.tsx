import TopNav from '../components/ui/TopNav';
import EventCard from '../components/EventCard';
import EventsMapPanel from '../components/EventsMapPanel';
import { fetchEvents } from '@/lib/api';
import { Event } from '@/types/event';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    const events: Event[] = await fetchEvents();

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
                    <EventsMapPanel events={events} />
                </div>
            </main>
        </div>
    );
}
