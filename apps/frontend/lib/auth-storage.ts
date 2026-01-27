export type AuthSnapshot = {
    token: string | null;
    userId: number | null;
    username: string | null;
    email: string | null;
};

function isBrowser() {
    return typeof window !== "undefined";
}

export const AuthStorage = {
    getAuth(): AuthSnapshot {
        if (!isBrowser()) {
            return { token: null, userId: null, username: null, email: null };
        }
        const userIdRaw = localStorage.getItem("user_id");
        const userId = userIdRaw ? Number(userIdRaw) : null;
        const username = localStorage.getItem("username");
        const email = localStorage.getItem("user_email");
        return {
            token: null,
            userId: Number.isNaN(userId) ? null : userId,
            username,
            email,
        };
    },
    setAuth(snapshot: AuthSnapshot) {
        if (!isBrowser()) return;
        if (snapshot.userId !== null) {
            localStorage.setItem("user_id", snapshot.userId.toString());
        }
        if (snapshot.username) {
            localStorage.setItem("username", snapshot.username);
        }
        if (snapshot.email) {
            localStorage.setItem("user_email", snapshot.email);
        }
    },
    clear() {
        if (!isBrowser()) return;
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("user_email");
    },
};
