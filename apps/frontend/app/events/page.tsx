import TopNav from '../components/ui/TopNav';
import EventCard from '../components/EventCard';
import { fetchEvents } from '@/lib/api';
import { Event } from '@/types/event';

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
                <div className="w-[450px] flex flex-col border-r border-border-dark bg-background-dark z-40">
                    {/* Filters */}
                    <div className="p-4 border-b border-border-dark">
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/20 border border-primary/40 px-4 cursor-pointer hover:bg-primary/30 transition-all">
                                <span className="text-primary text-xs font-semibold">Sport Type</span>
                                <span className="material-symbols-outlined text-sm text-primary">keyboard_arrow_down</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-border-dark px-4 hover:border-slate-500 transition-colors cursor-pointer">
                                <span className="text-slate-300 text-xs font-semibold">Distance</span>
                                <span className="material-symbols-outlined text-sm text-slate-400">keyboard_arrow_down</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-border-dark px-4 hover:border-slate-500 transition-colors cursor-pointer">
                                <span className="text-slate-300 text-xs font-semibold">Date</span>
                                <span className="material-symbols-outlined text-sm text-slate-400">keyboard_arrow_down</span>
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full bg-surface-dark border border-border-dark px-4 hover:border-slate-500 transition-colors cursor-pointer">
                                <span className="text-slate-300 text-xs font-semibold">Skill</span>
                                <span className="material-symbols-outlined text-sm text-slate-400">keyboard_arrow_down</span>
                            </button>
                        </div>
                    </div>

                    {/* Event List */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-background-dark/50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-bold text-white">{events.length} Events Nearby</h3>
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Sort: Popular</span>
                        </div>
                        {events.length === 0 ? (
                            <div className="text-center text-slate-400 mt-8">
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
                <div className="flex-1 relative bg-background-dark">
                    <div className="absolute inset-0 bg-gradient-to-br from-surface-dark to-background-dark opacity-60"></div>
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Map Search */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[320px] shadow-2xl z-10">
                            <div className="flex w-full items-stretch rounded-full h-12 bg-dark-card px-2 border border-dark-border">
                                <div className="text-primary flex items-center justify-center pl-3">
                                    <span className="material-symbols-outlined">near_me</span>
                                </div>
                                <input
                                    className="form-input flex w-full border-none bg-transparent focus:ring-0 h-full text-sm font-medium text-white placeholder-slate-500"
                                    placeholder="Search this area..."
                                />
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="text-center text-slate-500">
                            <span className="material-symbols-outlined text-6xl mb-4 block">map</span>
                            <p className="text-lg font-semibold">Map View</p>
                            <p className="text-sm">Coming soon</p>
                        </div>

                        {/* Map Controls */}
                        <div className="absolute bottom-10 right-10 flex flex-col gap-3">
                            <div className="flex flex-col bg-dark-card rounded-full shadow-2xl border border-dark-border overflow-hidden">
                                <button className="p-3 hover:bg-dark-border transition-colors border-b border-dark-border">
                                    <span className="material-symbols-outlined text-white">add</span>
                                </button>
                                <button className="p-3 hover:bg-dark-border transition-colors">
                                    <span className="material-symbols-outlined text-white">remove</span>
                                </button>
                            </div>
                            <button className="size-12 bg-dark-card rounded-full shadow-2xl border border-dark-border flex items-center justify-center hover:bg-dark-border transition-colors">
                                <span className="material-symbols-outlined text-primary">my_location</span>
                            </button>
                        </div>

                        {/* Map Legend */}
                        <div className="absolute bottom-10 left-10 bg-dark-card/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Map Legend</p>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]"></span>
                                    <span className="text-xs font-medium text-slate-300">Ball Sports</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></span>
                                    <span className="text-xs font-medium text-slate-300">Racket</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                                    <span className="text-xs font-medium text-slate-300">Fitness</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
