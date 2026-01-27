import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8971";

export function getApiUrl(path: string) {
    return `${API_BASE_URL}${path}`;
}

export function setRefreshCookie(response: NextResponse, refresh: string) {
    response.cookies.set("refresh_token", refresh, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth",
    });
}

export function clearRefreshCookie(response: NextResponse) {
    response.cookies.set("refresh_token", "", {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/api/auth",
        expires: new Date(0),
    });
}
