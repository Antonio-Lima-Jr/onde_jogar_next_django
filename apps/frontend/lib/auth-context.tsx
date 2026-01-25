"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthSnapshot, AuthStorage } from "./auth-storage";

type AuthContextValue = {
    auth: AuthSnapshot;
    ready: boolean;
    setAuth: (snapshot: AuthSnapshot) => void;
    clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [auth, setAuthState] = useState<AuthSnapshot>({
        token: null,
        userId: null,
        username: null,
        email: null,
    });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setAuthState(AuthStorage.getAuth());
        setReady(true);
    }, []);

    const setAuth = (snapshot: AuthSnapshot) => {
        AuthStorage.setAuth(snapshot);
        setAuthState(snapshot);
    };

    const clearAuth = () => {
        AuthStorage.clear();
        setAuthState({
            token: null,
            userId: null,
            username: null,
            email: null,
        });
    };

    const value = useMemo(
        () => ({ auth, ready, setAuth, clearAuth }),
        [auth, ready]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
}
