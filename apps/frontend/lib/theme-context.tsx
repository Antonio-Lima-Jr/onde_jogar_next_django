"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeMode, ThemeStorage } from "./theme-storage";

type ThemeContextValue = {
    theme: ThemeMode;
    ready: boolean;
    setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyThemeClass(theme: ThemeMode) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<ThemeMode>("dark");
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const stored = ThemeStorage.getTheme();
        setThemeState(stored);
        applyThemeClass(stored);
        setReady(true);
    }, []);

    const setTheme = (next: ThemeMode) => {
        ThemeStorage.setTheme(next);
        setThemeState(next);
        applyThemeClass(next);
    };

    const value = useMemo(() => ({ theme, ready, setTheme }), [theme, ready]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return ctx;
}
