"use client";

import { useMemo } from "react";
import Map, {
  Marker,
  NavigationControl,
  type MapMouseEvent,
} from "react-map-gl/mapbox";

const DEFAULT_LATITUDE = -15.793889; // Brasilia
const DEFAULT_LONGITUDE = -47.882778;
const DEFAULT_ZOOM = 12;

type EventMapProps = {
  latitude?: number | null;
  longitude?: number | null;
  onSelectLocation?: (lat: number, lng: number) => void;
};

export default function EventMap({
  latitude,
  longitude,
  onSelectLocation,
}: EventMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  const hasSelection =
    typeof latitude === "number" && typeof longitude === "number";

  const initialViewState = useMemo(
    () => ({
      latitude: hasSelection ? (latitude as number) : DEFAULT_LATITUDE,
      longitude: hasSelection ? (longitude as number) : DEFAULT_LONGITUDE,
      zoom: DEFAULT_ZOOM,
    }),
    [hasSelection, latitude, longitude]
  );

  const mapKey = hasSelection
    ? `selected-${latitude}-${longitude}`
    : "default-location";

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[color:var(--color-background)] text-sm font-semibold text-[color:var(--color-muted)]">
        NEXT_PUBLIC_MAPBOX_TOKEN not configured.
      </div>
    );
  }

  const handleClick = (event: MapMouseEvent) => {
    if (!onSelectLocation) return;
    const { lat, lng } = event.lngLat;
    onSelectLocation(lat, lng);
  };

  return (
    <Map
      key={mapKey}
      mapboxAccessToken={mapboxToken}
      initialViewState={initialViewState}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      onClick={handleClick}
    >
      <NavigationControl position="top-right" />
      {hasSelection ? (
        <Marker latitude={latitude as number} longitude={longitude as number} />
      ) : null}
    </Map>
  );
}
