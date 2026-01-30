const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8971';

function getHeaders(token?: string) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function fetchEvents(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/events/`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }
    return response.json();
}

export async function fetchEventCategories(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/api/events/categories/`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch event categories');
    }
    return response.json();
}

export async function fetchEvent(id: string, token?: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/events/${id}/`, {
        headers: getHeaders(token),
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch event');
    }
    return response.json();
}

export async function joinEvent(eventId: number, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/join/`, {
        method: 'POST',
        headers: getHeaders(token),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to join event');
    }
    return response.json();
}

export async function leaveEvent(eventId: number, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}/leave/`, {
        method: 'POST',
        headers: getHeaders(token),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to leave event');
    }
    if (response.status === 204) return null;
    return response.json();
}

export async function createEvent(data: any, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/events/`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail ||
            (errorData.date ? `Date error: ${errorData.date[0]}` : null) ||
            Object.values(errorData).flat()[0] ||
            'Failed to create event';
        throw new Error(errorMessage as string);
    }
    return response.json();
}

export async function login(data: any): Promise<any> {
    const response = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.non_field_errors?.[0] || 'Login failed');
    }
    return response.json();
}

export async function register(data: any): Promise<any> {
    const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(Object.values(errorData)[0] as string || 'Registration failed');
    }
    return response.json();
}

export async function refreshAccess(): Promise<any> {
    const response = await fetch(`/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Refresh failed');
    }
    return response.json();
}

export async function logout(): Promise<void> {
    await fetch(`/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
}

export async function fetchUser(id: string, token?: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/users/profile/${id}/`, {
        headers: getHeaders(token),
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user profile');
    }
    return response.json();
}

export async function updateProfile(id: string, data: any, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/users/profile/${id}/`, {
        method: 'PATCH',
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(Object.values(errorData).flat()[0] as string || 'Failed to update profile');
    }
    return response.json();
}
