export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location?: { type: "Point"; coordinates: [number, number] } | null;
    latitude?: number | null;
    longitude?: number | null;
    sport_type: string;
    skill_level: string;
    slots: number;
    created_by: string; // or User object if expanded
    participations: string[]; // IDs of users
    // Add other fields as per model
}
