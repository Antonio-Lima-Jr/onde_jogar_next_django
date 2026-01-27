import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApiUrl, setRefreshCookie } from "../_utils";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh_token")?.value;
    if (!refresh) {
        return NextResponse.json({ detail: "No refresh token." }, { status: 401 });
    }

    const response = await fetch(getApiUrl("/api/auth/token/refresh/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    const result = NextResponse.json({
        access: data.access,
    });

    if (data.refresh) {
        setRefreshCookie(result, data.refresh);
    }

    return result;
}
