"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Map, {
  Marker,
  type MapRef,
} from "react-map-gl/mapbox";

import type { Event } from "@/types/event";
import MapControls from "./MapControls";

const DEFAULT_LATITUDE = -15.793889; // Brasilia
const DEFAULT_LONGITUDE = -47.882778;
const DEFAULT_ZOOM = 11;

type EventsMapPanelProps = {
  events: Event[];
};

export default function EventsMapPanel({ events }: EventsMapPanelProps) {
  const router = useRouter();
  const mapRef = useRef<MapRef | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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
  }, [
    eventsWithCoords.length,
    initialViewState.latitude,
    initialViewState.longitude,
  ]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 13,
          duration: 1200,
        });
      },
      () => {
        alert("Unable to fetch your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-background)] text-sm font-semibold text-[color:var(--color-muted)]">
        NEXT_PUBLIC_MAPBOX_TOKEN not configured.
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0">
        <Map
          key={mapKey}
          ref={mapRef}
          mapboxAccessToken={mapboxToken}
          initialViewState={initialViewState}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
        >
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

          {userLocation ? (
            <Marker
              latitude={userLocation.latitude}
              longitude={userLocation.longitude}
              anchor="center"
            >
              <div className="size-3 rounded-full bg-blue-500 border-2 border-white shadow-[0_0_0_6px_rgba(59,130,246,0.25)]" />
            </Marker>
          ) : null}
        </Map>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[color:var(--color-surface)] to-[color:var(--color-background)] opacity-30" />

      <div className="relative h-full w-full pointer-events-none">

        {/* Map Controls */}
        <div className="pointer-events-auto absolute bottom-10 right-10">
          <MapControls
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onMyLocation={handleMyLocation}
          />
        </div>

        {/* Map Legend */}
        <div className="pointer-events-auto absolute bottom-10 left-10 bg-[color:var(--color-surface)]/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-[color:var(--color-border)]">
          <p className="text-[10px] font-bold text-[color:var(--color-muted)] uppercase tracking-widest mb-2">
            Map Legend
          </p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
              <span className="text-xs font-medium text-[color:var(--color-text)]">
                Ball Sports
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" />
              <span className="text-xs font-medium text-[color:var(--color-text)]">
                Racket
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
              <span className="text-xs font-medium text-[color:var(--color-text)]">
                Fitness
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
