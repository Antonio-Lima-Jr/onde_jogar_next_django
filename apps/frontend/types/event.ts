export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    slots: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    participants_count?: number;
    is_authenticated_user_joined?: boolean;
}

export interface Participation {
    id: number;
    user: number;
    event: number;
    joined_at: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
}
