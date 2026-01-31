'use client';

import { useEffect, useMemo, useRef } from 'react';
import EventCard from '@/app/components/EventCard';
import EventsMapPanel from '@/app/components/EventsMapPanel';
import { useAuth } from '@/lib/auth-context';
import { useEventsStore } from '@/lib/stores/events-store';
import type { Event, EventCategory } from '@/types/event';
import type { DateFilter, SortOption } from '@/lib/stores/events-store';

type EventsListClientProps = {
    events: Event[];
    categories: EventCategory[];
    totalCount: number;
};

const DATE_FILTER_LABELS: Record<DateFilter, string> = {
    all: 'Any date',
    today: 'Today',
    week: 'Next 7 days',
    month: 'Next 30 days',
    upcoming: 'Upcoming only',
};

const SORT_LABELS: Record<SortOption, string> = {
    popular: 'Popular',
    soonest: 'Soonest',
    newest: 'Newest',
    distance: 'Nearest',
};

const toRadians = (value: number) => (value * Math.PI) / 180;

const calculateDistanceKm = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
) => {
    const earthRadiusKm = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getParticipantsCount = (event: Event) => event.participants_count ?? 0;

const getDistanceForEvent = (event: Event, lat: number, lng: number) => {
    if (event.latitude == null || event.longitude == null) return Number.POSITIVE_INFINITY;
    return calculateDistanceKm(lat, lng, event.latitude, event.longitude);
};

export default function EventsListClient({ events, categories }: EventsListClientProps) {
    const { auth, ready } = useAuth();

    const items = useEventsStore((state) => state.items);
    const totalCount = useEventsStore((state) => state.totalCount);
    const isFetching = useEventsStore((state) => state.isFetching);
    const isFetchingMore = useEventsStore((state) => state.isFetchingMore);
    const fetchError = useEventsStore((state) => state.error);
    const searchQuery = useEventsStore((state) => state.searchQuery);
    const categoryId = useEventsStore((state) => state.categoryId);
    const dateFilter = useEventsStore((state) => state.dateFilter);
    const openSlotsOnly = useEventsStore((state) => state.openSlotsOnly);
    const sortBy = useEventsStore((state) => state.sortBy);
    const radiusKm = useEventsStore((state) => state.radiusKm);
    const latitude = useEventsStore((state) => state.latitude);
    const longitude = useEventsStore((state) => state.longitude);
    const isLocating = useEventsStore((state) => state.isLocating);
    const showDistanceControls = useEventsStore((state) => state.showDistanceControls);
    const locationError = useEventsStore((state) => state.locationError);
    const hasMore = useEventsStore((state) => state.hasMore);

    const hydrateEvents = useEventsStore((state) => state.hydrateEvents);
    const setSearchQuery = useEventsStore((state) => state.setSearchQuery);
    const setCategoryId = useEventsStore((state) => state.setCategoryId);
    const setDateFilter = useEventsStore((state) => state.setDateFilter);
    const setOpenSlotsOnly = useEventsStore((state) => state.setOpenSlotsOnly);
    const setSortBy = useEventsStore((state) => state.setSortBy);
    const setRadiusKm = useEventsStore((state) => state.setRadiusKm);
    const setShowDistanceControls = useEventsStore((state) => state.setShowDistanceControls);
    const applyFilters = useEventsStore((state) => state.applyFilters);
    const clearFilters = useEventsStore((state) => state.clearFilters);
    const requestLocation = useEventsStore((state) => state.requestLocation);
    const updateParticipation = useEventsStore((state) => state.updateParticipation);
    const loadMore = useEventsStore((state) => state.loadMore);

    const hasCoords = latitude !== null && longitude !== null;
    const hasDistanceFilter = hasCoords;

    const hasActiveFilters =
        searchQuery.trim().length > 0 ||
        categoryId !== '' ||
        dateFilter !== 'all' ||
        sortBy !== 'popular' ||
        openSlotsOnly ||
        hasDistanceFilter;

    const hasHydrated = useRef(false);
    const hasRequestedLocation = useRef(false);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (hasHydrated.current) return;
        hydrateEvents(events, totalCount);
        hasHydrated.current = true;
    }, [events, hydrateEvents, totalCount]);

    useEffect(() => {
        if (hasRequestedLocation.current) return;
        hasRequestedLocation.current = true;
        requestLocation({ auto: true, token: auth.token });
    }, [auth.token, requestLocation]);

    useEffect(() => {
        if (!ready || !auth.token) return;
        applyFilters(auth.token);
    }, [applyFilters, auth.token, ready]);

    useEffect(() => {
        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry?.isIntersecting && hasMore && !isFetchingMore && !isFetching) {
                    loadMore(auth.token);
                }
            },
            { rootMargin: '120px' }
        );

        observer.observe(target);
        return () => observer.disconnect();
    }, [auth.token, hasMore, isFetching, isFetchingMore, loadMore]);

    const sortedEvents = useMemo(() => {
        const base = [...items];
        if (sortBy === 'popular') {
            return base.sort((a, b) => getParticipantsCount(b) - getParticipantsCount(a));
        }
        if (sortBy === 'soonest') {
            return base.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        if (sortBy === 'newest') {
            return base.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        if (sortBy === 'distance' && hasCoords) {
            return base.sort(
                (a, b) =>
                    getDistanceForEvent(a, latitude as number, longitude as number) -
                    getDistanceForEvent(b, latitude as number, longitude as number)
            );
        }
        return base;
    }, [hasCoords, items, latitude, longitude, sortBy]);

    return (
        <main className="flex flex-1 overflow-hidden">
            <div className="w-[450px] flex flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-background)] z-40">
                <div className="p-4 border-b border-[color:var(--color-border)] space-y-4">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-muted)] text-lg">
                            search
                        </span>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by title, description, or sport"
                            className="w-full rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] pl-10 pr-4 py-2 text-sm text-[color:var(--color-text)] focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <select
                            value={categoryId}
                            onChange={(event) => {
                                const value = event.target.value;
                                setCategoryId(value ? Number(value) : '');
                            }}
                            className="h-9 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 text-xs font-semibold text-[color:var(--color-muted)] focus:border-primary focus:outline-none"
                        >
                            <option value="">All sports</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={dateFilter}
                            onChange={(event) => setDateFilter(event.target.value as DateFilter)}
                            className="h-9 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 text-xs font-semibold text-[color:var(--color-muted)] focus:border-primary focus:outline-none"
                        >
                            {Object.entries(DATE_FILTER_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => setOpenSlotsOnly(!openSlotsOnly)}
                            className={`h-9 rounded-full px-4 text-xs font-semibold transition-colors ${openSlotsOnly
                                ? 'bg-primary/15 text-primary border border-primary/40'
                                : 'bg-[color:var(--color-surface)] text-[color:var(--color-muted)] border border-[color:var(--color-border)]'
                                }`}
                        >
                            Open slots only
                        </button>

                        <select
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as SortOption)}
                            className="h-9 rounded-full bg-[color:var(--color-surface)] border border-[color:var(--color-border)] px-4 text-xs font-semibold text-[color:var(--color-muted)] focus:border-primary focus:outline-none"
                        >
                            {Object.entries(SORT_LABELS)
                                .filter(([value]) => value !== 'distance' || hasCoords)
                                .map(([value, label]) => (
                                    <option key={value} value={value}>
                                        Sort: {label}
                                    </option>
                                ))}
                        </select>

                    </div>

                    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted)]">
                            Distance
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => requestLocation({ auto: false, token: auth.token })}
                                disabled={isLocating}
                                className="h-9 rounded-full px-4 text-xs font-semibold border border-[color:var(--color-border)] text-[color:var(--color-text)] hover:border-primary transition-colors disabled:opacity-50"
                            >
                                {isLocating ? 'Locating...' : 'Use my location'}
                            </button>
                            {showDistanceControls && (
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Radius (km)"
                                    value={radiusKm}
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        setRadiusKm(value ? Number(value) : '');
                                    }}
                                    className="h-9 w-full rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 text-xs font-semibold text-[color:var(--color-text)] focus:border-primary focus:outline-none"
                                />
                            )}
                        </div>
                        {hasCoords && (
                            <p className="text-[10px] text-[color:var(--color-muted)]">
                                Using {latitude?.toFixed(3)}, {longitude?.toFixed(3)}
                            </p>
                        )}
                        {locationError && (
                            <p className="text-[10px] text-red-500">{locationError}</p>
                        )}
                        {!showDistanceControls && (
                            <button
                                type="button"
                                onClick={() => setShowDistanceControls(true)}
                                className="text-[10px] font-semibold text-[color:var(--color-muted)] hover:text-primary"
                            >
                                Set distance radius
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => applyFilters(auth.token)}
                            className="h-9 rounded-full px-4 text-xs font-semibold border border-primary/60 bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                        >
                            Apply filters
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={() => clearFilters(auth.token)}
                                className="h-9 rounded-full px-4 text-xs font-semibold text-[color:var(--color-text)] border border-[color:var(--color-border)] hover:border-primary transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    {fetchError && (
                        <div className="text-xs font-semibold text-red-500">
                            {fetchError}
                        </div>
                    )}

                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                        {isFetching
                            ? 'Updating results...'
                            : `Showing ${sortedEvents.length} of ${totalCount} events`}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[color:var(--color-background)]/60">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-[color:var(--color-text)]">
                            {sortedEvents.length} Events
                        </h3>
                        <span className="text-xs text-[color:var(--color-muted)] uppercase font-bold tracking-widest">
                            {SORT_LABELS[sortBy]}
                        </span>
                    </div>
                    {sortedEvents.length === 0 ? (
                        <div className="text-center text-[color:var(--color-muted)] mt-8">
                            <p>No events match your filters.</p>
                        </div>
                    ) : (
                        sortedEvents.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onParticipationChange={(eventId, isJoined) => {
                                    updateParticipation(eventId, isJoined);
                                }}
                            />
                        ))
                    )}

                    <div ref={loadMoreRef} className="h-6" />
                    {isFetchingMore && (
                        <div className="text-xs text-[color:var(--color-muted)] text-center">
                            Loading more events...
                        </div>
                    )}
                    {!isFetchingMore && hasMore && (
                        <div className="text-[10px] text-[color:var(--color-muted)] text-center uppercase tracking-widest">
                            Scroll to load more
                        </div>
                    )}
                    {!isFetchingMore && !hasMore && items.length > 0 && (
                        <div className="text-[10px] text-[color:var(--color-muted)] text-center uppercase tracking-widest">
                            You reached the end
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 relative bg-[color:var(--color-background)]">
                <EventsMapPanel events={sortedEvents} />
            </div>
        </main>
    );
}
