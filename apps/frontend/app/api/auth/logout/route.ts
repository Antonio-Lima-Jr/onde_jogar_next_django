import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearRefreshCookie, getApiUrl } from "../_utils";

export async function POST() {
    const cookieStore = await cookies();
    const refresh = cookieStore.get("refresh_token")?.value;

    if (refresh) {
        await fetch(getApiUrl("/api/auth/logout/"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
        });
    }

    const result = NextResponse.json({ ok: true });
    clearRefreshCookie(result);
    return result;
}
