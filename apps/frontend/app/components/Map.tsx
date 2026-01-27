"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Marker,
  type MapMouseEvent,
  type MapRef,
} from "react-map-gl/mapbox";

import MapControls from "./MapControls";

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
  const mapRef = useRef<MapRef | null>(null);
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

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

  useEffect(() => {
    if (!hasSelection) return;
    mapRef.current?.flyTo({
      center: [longitude as number, latitude as number],
      zoom: DEFAULT_ZOOM,
      duration: 800,
    });
  }, [hasSelection, latitude, longitude]);

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
        const { latitude: lat, longitude: lng } = position.coords;
        setUserLocation({ latitude: lat, longitude: lng });
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 13,
          duration: 1200,
        });
        onSelectLocation?.(lat, lng);
      },
      () => {
        alert("Unable to fetch your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={initialViewState}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={handleClick}
      >
        {hasSelection ? (
          <Marker latitude={latitude as number} longitude={longitude as number} />
        ) : null}
        {!hasSelection && userLocation ? (
          <Marker latitude={userLocation.latitude} longitude={userLocation.longitude} />
        ) : null}
      </Map>

      <div className="pointer-events-auto absolute bottom-4 right-4 z-10">
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onMyLocation={handleMyLocation}
        />
      </div>
    </div>
  );
}
