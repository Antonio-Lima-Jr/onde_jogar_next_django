import { NextResponse } from "next/server";
import { getApiUrl, setRefreshCookie } from "../_utils";

export async function POST(request: Request) {
    const body = await request.json();
    const response = await fetch(getApiUrl("/api/users/register/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    const result = NextResponse.json({
        access: data.access,
        user: data.user,
    });

    if (data.refresh) {
        setRefreshCookie(result, data.refresh);
    }

    return result;
}
