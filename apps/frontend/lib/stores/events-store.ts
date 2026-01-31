'use client';

import { create } from 'zustand';
import type { Event } from '@/types/event';
import { fetchEvents } from '@/lib/api';

type DateFilter = 'all' | 'today' | 'week' | 'month' | 'upcoming';
type SortOption = 'popular' | 'soonest' | 'newest' | 'distance';

type RequestParams = Record<string, string | number | boolean | null | undefined>;

type EventsState = {
    items: Event[];
    totalCount: number;
    offset: number;
    limit: number;
    hasMore: boolean;
    isFetching: boolean;
    isFetchingMore: boolean;
    error: string | null;
    lastUpdated: number | null;

    searchQuery: string;
    categoryId: number | '';
    dateFilter: DateFilter;
    openSlotsOnly: boolean;
    sortBy: SortOption;
    radiusKm: number | '';

    latitude: number | null;
    longitude: number | null;
    isLocating: boolean;
    locationError: string | null;
    showDistanceControls: boolean;
    hasUserRequestedLocation: boolean;

    appliedParams: RequestParams;

    hydrateEvents: (events: Event[], totalCount?: number) => void;
    setSearchQuery: (value: string) => void;
    setCategoryId: (value: number | '') => void;
    setDateFilter: (value: DateFilter) => void;
    setOpenSlotsOnly: (value: boolean) => void;
    setSortBy: (value: SortOption) => void;
    setRadiusKm: (value: number | '') => void;
    setShowDistanceControls: (value: boolean) => void;
    setLocationError: (value: string | null) => void;
    setHasUserRequestedLocation: (value: boolean) => void;

    applyFilters: (token?: string | null) => Promise<void>;
    clearFilters: (token?: string | null) => Promise<void>;
    loadMore: (token?: string | null) => Promise<void>;
    requestLocation: (options?: { auto?: boolean; token?: string | null }) => Promise<void>;
    updateParticipation: (eventId: number, isJoined: boolean) => void;
};

const DEFAULT_RADIUS_KM = 50;
const DEFAULT_LIMIT = 10;

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

const buildRequestParams = (state: Pick<EventsState, 'searchQuery' | 'categoryId' | 'dateFilter' | 'openSlotsOnly' | 'latitude' | 'longitude' | 'radiusKm'>): RequestParams => {
    const { dateFrom, dateTo } = buildDateRange(state.dateFilter);
    const hasCoords = state.latitude !== null && state.longitude !== null;
    const effectiveRadiusKm = state.radiusKm === '' ? DEFAULT_RADIUS_KM : state.radiusKm;

    return {
        search: state.searchQuery.trim() || undefined,
        category: state.categoryId || undefined,
        date_from: dateFrom,
        date_to: dateTo,
        open_slots: state.openSlotsOnly || undefined,
        lat: hasCoords ? state.latitude ?? undefined : undefined,
        lng: hasCoords ? state.longitude ?? undefined : undefined,
        radius_km: hasCoords ? effectiveRadiusKm : undefined,
    };
};

const fetchEventsWithParams = async (params: RequestParams, token?: string | null) => {
    const data = await fetchEvents(params, token ?? undefined);
    return data;
};

const defaultAppliedParams = buildRequestParams({
    searchQuery: '',
    categoryId: '',
    dateFilter: 'all',
    openSlotsOnly: false,
    latitude: null,
    longitude: null,
    radiusKm: '',
});

export const useEventsStore = create<EventsState>((set, get) => ({
    items: [],
    totalCount: 0,
    offset: 0,
    limit: DEFAULT_LIMIT,
    hasMore: false,
    isFetching: false,
    isFetchingMore: false,
    error: null,
    lastUpdated: null,

    searchQuery: '',
    categoryId: '',
    dateFilter: 'all',
    openSlotsOnly: false,
    sortBy: 'popular',
    radiusKm: '',

    latitude: null,
    longitude: null,
    isLocating: false,
    locationError: null,
    showDistanceControls: false,
    hasUserRequestedLocation: false,

    appliedParams: defaultAppliedParams,

    hydrateEvents: (events, totalCount) => {
        const resolvedTotal = totalCount ?? events.length;
        set({
            items: events,
            totalCount: resolvedTotal,
            offset: events.length,
            hasMore: events.length < resolvedTotal,
            lastUpdated: Date.now(),
        });
    },

    setSearchQuery: (value) => set({ searchQuery: value }),
    setCategoryId: (value) => set({ categoryId: value }),
    setDateFilter: (value) => set({ dateFilter: value }),
    setOpenSlotsOnly: (value) => set({ openSlotsOnly: value }),
    setSortBy: (value) => set({ sortBy: value }),
    setRadiusKm: (value) => set({ radiusKm: value }),
    setShowDistanceControls: (value) => set({ showDistanceControls: value }),
    setLocationError: (value) => set({ locationError: value }),
    setHasUserRequestedLocation: (value) => set({ hasUserRequestedLocation: value }),

    applyFilters: async (token) => {
        const state = get();
        const params = buildRequestParams(state);
        const pagedParams = { ...params, limit: state.limit, offset: 0 };
        set({
            appliedParams: params,
            isFetching: true,
            isFetchingMore: false,
            error: null,
            items: [],
            offset: 0,
            hasMore: false,
            totalCount: 0,
        });
        try {
            const response = await fetchEventsWithParams(pagedParams, token);
            const results = response.results ?? [];
            const count = response.count ?? results.length;
            set({
                items: results,
                totalCount: count,
                offset: results.length,
                hasMore: results.length < count,
                lastUpdated: Date.now(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch events';
            set({ error: message });
        } finally {
            set({ isFetching: false });
        }
    },

    clearFilters: async (token) => {
        set({
            searchQuery: '',
            categoryId: '',
            dateFilter: 'all',
            openSlotsOnly: false,
            sortBy: 'popular',
            radiusKm: '',
            latitude: null,
            longitude: null,
            showDistanceControls: false,
            locationError: null,
            hasUserRequestedLocation: false,
        });
        await get().applyFilters(token);
    },

    loadMore: async (token) => {
        const state = get();
        if (state.isFetchingMore || !state.hasMore || state.isFetching) return;
        const pagedParams = {
            ...state.appliedParams,
            limit: state.limit,
            offset: state.offset,
        };
        set({ isFetchingMore: true, error: null });
        try {
            const response = await fetchEventsWithParams(pagedParams, token);
            const results = response.results ?? [];
            const count = response.count ?? state.totalCount;
            const nextOffset = state.offset + results.length;
            set({
                items: [...state.items, ...results],
                totalCount: count,
                offset: nextOffset,
                hasMore: nextOffset < count,
                lastUpdated: Date.now(),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to fetch events';
            set({ error: message });
        } finally {
            set({ isFetchingMore: false });
        }
    },

    requestLocation: async ({ auto = false, token } = {}) => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) {
            if (!auto) {
                set({ locationError: 'Geolocation is not supported by your browser.' });
            }
            return;
        }

        set({
            isLocating: true,
            locationError: null,
            showDistanceControls: auto ? true : get().showDistanceControls,
            hasUserRequestedLocation: auto ? get().hasUserRequestedLocation : true,
        });

        const getPosition = () =>
            new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                });
            });

        try {
            const position = await getPosition();
            const nextRadius = get().radiusKm === '' ? DEFAULT_RADIUS_KM : get().radiusKm;
            set({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                radiusKm: nextRadius,
                showDistanceControls: true,
            });

            if (auto) {
                await get().applyFilters(token);
            }
        } catch (error) {
            if (!auto) {
                set({ locationError: 'Unable to fetch your location.' });
            }
        } finally {
            set({ isLocating: false });
        }
    },

    updateParticipation: (eventId, isJoined) => {
        set((state) => ({
            items: state.items.map((event) => {
                if (event.id !== eventId) return event;
                const currentCount = event.participants_count ?? 0;
                const nextCount = isJoined
                    ? currentCount + 1
                    : Math.max(0, currentCount - 1);
                return {
                    ...event,
                    participants_count: nextCount,
                    is_authenticated_user_joined: isJoined,
                };
            }),
        }));
    },
}));

export type { DateFilter, SortOption, RequestParams };
