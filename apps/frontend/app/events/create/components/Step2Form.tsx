'use client';

import EventMap from '@/app/components/Map';

type Step2FormProps = {
    latitude: number | null;
    longitude: number | null;
    hasCoords: boolean;
    showValidation: boolean;
    onSelectLocation: (lat: number, lng: number) => void;
};

export default function Step2Form({
    latitude,
    longitude,
    hasCoords,
    showValidation,
    onSelectLocation,
}: Step2FormProps) {
    return (
        <div className="space-y-6">
            <div>
                <label className="text-sm font-bold text-[color:var(--color-muted)] uppercase tracking-wider mb-2 block">
                    Location
                </label>

                <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[color:var(--color-border)]">
                    <EventMap
                        latitude={latitude}
                        longitude={longitude}
                        onSelectLocation={onSelectLocation}
                    />
                </div>

                <p className="mt-2 text-xs font-semibold text-[color:var(--color-muted)]">
                    {hasCoords
                        ? `Selected: ${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}`
                        : 'Click on the map to set the event location.'}
                </p>
                {showValidation && !hasCoords && (
                    <p className="mt-2 text-xs font-semibold text-red-500">Location is required.</p>
                )}
            </div>
        </div>
    );
}
