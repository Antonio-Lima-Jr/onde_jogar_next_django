export type ThemeMode = "dark" | "light";

const THEME_KEY = "theme";

function isBrowser() {
    return typeof window !== "undefined";
}

export const ThemeStorage = {
    getTheme(): ThemeMode {
        if (!isBrowser()) return "dark";
        const value = localStorage.getItem(THEME_KEY);
        return value === "light" ? "light" : "dark";
    },
    setTheme(theme: ThemeMode) {
        if (!isBrowser()) return;
        localStorage.setItem(THEME_KEY, theme);
    },
    clear() {
        if (!isBrowser()) return;
        localStorage.removeItem(THEME_KEY);
    },
};
