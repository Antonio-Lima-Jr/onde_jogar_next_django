# Location & Map

## Context
Events are location-based and users need to discover where to play.

## Event location
- Events may have a geographic location.
- Location is defined during event creation via map.

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
- Distance calculations are handled by the backend using PostGIS.
- The map provider is used only for visualization and user interaction.
