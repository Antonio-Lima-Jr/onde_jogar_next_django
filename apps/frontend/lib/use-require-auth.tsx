"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";

export function useRequireAuth() {
    const { auth, ready } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (ready && !auth.token) {
            router.push("/login");
        }
    }, [ready, auth.token, router]);

    return { auth, ready };
}
