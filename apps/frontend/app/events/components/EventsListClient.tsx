'use client';

import { useEffect, useMemo, useState } from 'react';
import EventCard from '@/app/components/EventCard';
import EventsMapPanel from '@/app/components/EventsMapPanel';
import { fetchEvents } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import type { Event, EventCategory } from '@/types/event';

type EventsListClientProps = {
    events: Event[];
    categories: EventCategory[];
};

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'upcoming';

type SortOption = 'popular' | 'soonest' | 'newest' | 'distance';
type RequestParams = Record<string, string | number | boolean | null | undefined>;

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

const DEFAULT_RADIUS_KM = 50;

const startOfDay = (value: Date) => {
    const copy = new Date(value);
    copy.setHours(0, 0, 0, 0);
    return copy;
};

const endOfDay = (value: Date) => {
    const copy = new Date(value);
    copy.setHours(23, 59, 59, 999);
    return copy;
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

const buildDateRange = (filter: DateFilter) => {
    if (filter === 'all') return {};

    const now = new Date();
    if (filter === 'today') {
        return {
            dateFrom: startOfDay(now).toISOString(),
            dateTo: endOfDay(now).toISOString(),
        };
    }

    if (filter === 'upcoming') {
        return {
            dateFrom: startOfDay(now).toISOString(),
        };
    }

    const end = new Date(now);
    if (filter === 'week') {
        end.setDate(now.getDate() + 7);
    }

    if (filter === 'month') {
        end.setDate(now.getDate() + 30);
    }

    return {
        dateFrom: startOfDay(now).toISOString(),
        dateTo: endOfDay(end).toISOString(),
    };
};

const buildRequestParams = ({
    searchQuery,
    categoryId,
    dateFilter,
    openSlotsOnly,
    latitude,
    longitude,
    radiusKm,
}: {
    searchQuery: string;
    categoryId: number | '';
    dateFilter: DateFilter;
    openSlotsOnly: boolean;
    latitude: number | null;
    longitude: number | null;
    radiusKm: number | '';
}): RequestParams => {
    const { dateFrom, dateTo } = buildDateRange(dateFilter);
    const hasCoords = latitude !== null && longitude !== null;
    const effectiveRadiusKm = radiusKm === '' ? DEFAULT_RADIUS_KM : radiusKm;
    return {
        search: searchQuery.trim() || undefined,
        category: categoryId || undefined,
        date_from: dateFrom,
        date_to: dateTo,
        open_slots: openSlotsOnly || undefined,
        lat: hasCoords ? latitude ?? undefined : undefined,
        lng: hasCoords ? longitude ?? undefined : undefined,
        radius_km: hasCoords ? effectiveRadiusKm : undefined,
    };
};

export default function EventsListClient({ events, categories }: EventsListClientProps) {
    const { auth } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const [openSlotsOnly, setOpenSlotsOnly] = useState(false);
    const [radiusKm, setRadiusKm] = useState<number | ''>('');
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [showDistanceControls, setShowDistanceControls] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [hasUserRequestedLocation, setHasUserRequestedLocation] = useState(false);

    const [remoteEvents, setRemoteEvents] = useState<Event[]>(events);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [appliedParams, setAppliedParams] = useState<RequestParams>(() =>
        buildRequestParams({
            searchQuery: '',
            categoryId: '',
            dateFilter: 'all',
            openSlotsOnly: false,
            latitude: null,
            longitude: null,
            radiusKm: '',
        })
    );

    const hasCoords = latitude !== null && longitude !== null;
    const effectiveRadiusKm = radiusKm === '' ? DEFAULT_RADIUS_KM : radiusKm;
    const hasDistanceFilter = hasCoords;

    const hasActiveFilters =
        searchQuery.trim().length > 0 ||
        categoryId !== '' ||
        dateFilter !== 'all' ||
        sortBy !== 'popular' ||
        openSlotsOnly ||
        hasDistanceFilter;

    const handleClearFilters = () => {
        const clearedParams = buildRequestParams({
            searchQuery: '',
            categoryId: '',
            dateFilter: 'all',
            openSlotsOnly: false,
            latitude: null,
            longitude: null,
            radiusKm: '',
        });
        setSearchQuery('');
        setCategoryId('');
        setDateFilter('all');
        setSortBy('popular');
        setOpenSlotsOnly(false);
        setRadiusKm('');
        setLatitude(null);
        setLongitude(null);
        setShowDistanceControls(false);
        setLocationError(null);
        setHasUserRequestedLocation(false);
        setAppliedParams(clearedParams);
    };

    const draftParams = useMemo(
        () =>
            buildRequestParams({
                searchQuery,
                categoryId,
                dateFilter,
                openSlotsOnly,
                latitude,
                longitude,
                radiusKm,
            }),
        [categoryId, dateFilter, latitude, longitude, openSlotsOnly, radiusKm, searchQuery]
    );

    const handleApplyFilters = () => {
        setAppliedParams(draftParams);
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true);
            setFetchError(null);
            try {
                const data = await fetchEvents(appliedParams, auth.token);
                setRemoteEvents(data as Event[]);
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to fetch events';
                setFetchError(message);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [appliedParams, auth.token]);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setShowDistanceControls(true);
                setRadiusKm((current) => (current === '' ? DEFAULT_RADIUS_KM : current));
                setAppliedParams(
                    buildRequestParams({
                        searchQuery: '',
                        categoryId: '',
                        dateFilter: 'all',
                        openSlotsOnly: false,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        radiusKm: DEFAULT_RADIUS_KM,
                    })
                );
                setIsLocating(false);
            },
            () => {
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    const sortedEvents = useMemo(() => {
        const base = [...remoteEvents];
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
    }, [hasCoords, latitude, longitude, remoteEvents, sortBy]);

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Geolocation is not supported by your browser.');
            return;
        }

        setIsLocating(true);
        setShowDistanceControls(true);
        setLocationError(null);
        setHasUserRequestedLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setRadiusKm((current) => (current === '' ? DEFAULT_RADIUS_KM : current));
                setIsLocating(false);
            },
            () => {
                if (hasUserRequestedLocation) {
                    setLocationError('Unable to fetch your location.');
                }
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

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
                            onClick={() => setOpenSlotsOnly((prev) => !prev)}
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

                        <button
                            type="button"
                            onClick={handleApplyFilters}
                            className="h-9 rounded-full px-4 text-xs font-semibold border border-primary/60 bg-primary/15 text-primary hover:bg-primary/25 transition-colors"
                        >
                            Apply filters
                        </button>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={handleClearFilters}
                                className="h-9 rounded-full px-4 text-xs font-semibold text-[color:var(--color-text)] border border-[color:var(--color-border)] hover:border-primary transition-colors"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--color-muted)]">
                            Distance
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleUseMyLocation}
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
                                Using {latitude?.toFixed(3)}, {longitude?.toFixed(3)} • {effectiveRadiusKm}km
                            </p>
                        )}
                        {locationError && (
                            <p className="text-[10px] text-red-500">{locationError}</p>
                        )}
                    </div>

                    {fetchError && (
                        <div className="text-xs font-semibold text-red-500">
                            {fetchError}
                        </div>
                    )}

                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--color-muted)]">
                        {isFetching ? 'Updating results...' : `Showing ${sortedEvents.length} events`}
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
                                    setRemoteEvents((prev) =>
                                        prev.map((item) => {
                                            if (item.id !== eventId) return item;
                                            const currentCount = item.participants_count ?? 0;
                                            const nextCount = isJoined
                                                ? currentCount + 1
                                                : Math.max(0, currentCount - 1);
                                            return {
                                                ...item,
                                                participants_count: nextCount,
                                                is_authenticated_user_joined: isJoined,
                                            };
                                        })
                                    );
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 relative bg-[color:var(--color-background)]">
                <EventsMapPanel events={sortedEvents} />
            </div>
        </main>
    );
}
