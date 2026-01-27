# Location & Map

## Context
Events are location-based and users need to discover where to play.

## Event location
- Events always have a geographic location.
- The frontend sends `latitude` and `longitude` (and optionally `city`).
- The backend validates coordinates and persists the location.

## Event location (backend)
- Events store location as a PostGIS `Point` with SRID 4326 (WGS84).
- The backend is the source of truth for geographic structure and SRID.
- Latitude must be between -90 and 90.
- Longitude must be between -180 and 180.
- Distance calculations and geographic filters are handled exclusively by the backend.
- The map provider (Mapbox) is only UI and is not referenced by the backend.

## User geolocation
- Users can optionally enable geolocation.
- Distance-based filters are only available when enabled.

## Explore behavior
- Events can be explored via map and list.
- City filter is always available.
- Distance filter depends on geolocation permission.

## Scope rules (MVP)
- Geolocation is opt-in.
- Filters advance progressively (do not require everything).
- No automatic matchmaking.
- No routes, navigation, or heatmaps.

## Notes
- The MVP uses Mapbox as the map provider on the frontend.
- The backend uses PostGIS to support geographic data.
- This spec does not define pricing, routing, or heatmaps.
- This spec does not define distance ordering or default radius.
- If geolocation is denied, no fallback behavior is defined here.
- An index (GIST) should exist on the `location` field for performance.
