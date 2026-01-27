export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Participation {
    id: number;
    user: User;
    event: number;
    joined_at: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location?: { type: "Point"; coordinates: [number, number] } | null;
    latitude?: number | null;
    longitude?: number | null;
    slots: number;
    created_by: User;
    created_at: string;
    updated_at: string;
    participants_count?: number;
    is_authenticated_user_joined?: boolean;
    participations?: Participation[];
}
