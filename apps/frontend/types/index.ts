export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    sport_type: string;
    skill_level: string;
    slots: number;
    created_by: number; // or User object if expanded
    participations: number[]; // IDs of users
    // Add other fields as per model
}
