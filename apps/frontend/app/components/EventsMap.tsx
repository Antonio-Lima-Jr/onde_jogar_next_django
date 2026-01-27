"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";

import type { Event } from "@/types/event";

const DEFAULT_LATITUDE = -15.793889; // Brasilia
const DEFAULT_LONGITUDE = -47.882778;
const DEFAULT_ZOOM = 11;

type EventsMapProps = {
  events: Event[];
};

export default function EventsMap({ events }: EventsMapProps) {
  const router = useRouter();
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const eventsWithCoords = useMemo(
    () =>
      events.filter(
        (event) =>
          typeof event.latitude === "number" &&
          typeof event.longitude === "number"
      ),
    [events]
  );

  const initialViewState = useMemo(() => {
    if (eventsWithCoords.length === 0) {
      return {
        latitude: DEFAULT_LATITUDE,
        longitude: DEFAULT_LONGITUDE,
        zoom: DEFAULT_ZOOM,
      };
    }

    const sum = eventsWithCoords.reduce(
      (acc, event) => ({
        latitude: acc.latitude + (event.latitude as number),
        longitude: acc.longitude + (event.longitude as number),
      }),
      { latitude: 0, longitude: 0 }
    );

    return {
      latitude: sum.latitude / eventsWithCoords.length,
      longitude: sum.longitude / eventsWithCoords.length,
      zoom: DEFAULT_ZOOM,
    };
  }, [eventsWithCoords]);

  const mapKey = useMemo(() => {
    if (eventsWithCoords.length === 0) return "events-map-empty";
    return `events-map-${eventsWithCoords.length}-${initialViewState.latitude.toFixed(
      3
    )}-${initialViewState.longitude.toFixed(3)}`;
  }, [eventsWithCoords.length, initialViewState.latitude, initialViewState.longitude]);

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-background)] text-sm font-semibold text-[color:var(--color-muted)]">
        NEXT_PUBLIC_MAPBOX_TOKEN not configured.
      </div>
    );
  }

  return (
    <Map
      key={mapKey}
      mapboxAccessToken={mapboxToken}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <NavigationControl position="top-right" />

      {eventsWithCoords.map((event) => (
        <Marker
          key={event.id}
          latitude={event.latitude as number}
          longitude={event.longitude as number}
          anchor="bottom"
        >
          <button
            type="button"
            aria-label={`Open event ${event.title}`}
            title={event.title}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/events/${event.id}`);
            }}
            className="flex flex-col items-center -translate-y-1"
          >
            <span className="rounded-full bg-primary text-[color:var(--color-on-primary)] shadow-[0_0_12px_rgba(89,242,13,0.5)] border border-primary/60 px-2 py-1 text-[10px] font-black tracking-wide">
              {event.id}
            </span>
            <span className="material-symbols-outlined text-primary drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] -mt-1">
              location_on
            </span>
          </button>
        </Marker>
      ))}
    </Map>
  );
}

