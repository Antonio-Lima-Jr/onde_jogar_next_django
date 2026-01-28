"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AuthModal from "../AuthModal";
import { useAuth } from "@/lib/auth-context";
import { logout } from "@/lib/api";

export default function TopNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { auth, ready, clearAuth } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (ready) {
            setIsLoggedIn(!!auth.token);
        }
    }, [ready, auth.token]);

    const handleLogout = async () => {
        await logout();
        clearAuth();
        setIsLoggedIn(false);
        router.push("/login");
        router.refresh();
    };
    return (
        <>
            <header className="flex items-center justify-between whitespace-nowrap border-b border-[color:var(--color-border)] px-4 md:px-10 py-3 sticky top-0 bg-[color:var(--color-background)]/90 backdrop-blur-xl z-50">
                <div className="flex items-center gap-8 text-[color:var(--color-text)]">
                    <Link href="/events" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="size-8 bg-primary rounded-full flex items-center justify-center text-[color:var(--color-on-primary)]">
                            <span className="material-symbols-outlined font-extrabold text-[20px]">exercise</span>
                        </div>
                        <h2 className="text-xl font-extrabold leading-tight tracking-tight text-[color:var(--color-text)]">SportDiscovery</h2>
                    </Link>
                    <div className="hidden lg:flex items-center gap-9 font-display">
                        <Link
                            className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === "/events"
                                ? "text-[color:var(--color-text)] border-b-2 border-primary pb-1"
                                : "text-[color:var(--color-muted)]"
                                }`}
                            href="/events"
                        >
                            Explore
                        </Link>
                        <Link
                            className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === "/events/create"
                                ? "text-[color:var(--color-text)] border-b-2 border-primary pb-1"
                                : "text-[color:var(--color-muted)]"
                                }`}
                            href="/events/create"
                            onClick={(e) => {
                                if (!isLoggedIn) {
                                    e.preventDefault();
                                    setIsAuthModalOpen(true);
                                }
                            }}
                        >
                            Create Event
                        </Link>
                    </div>
                </div>
                <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                    <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                        <div className="flex w-full flex-1 items-stretch rounded-full h-full">
                            <div className="text-[color:var(--color-muted)] flex border-none bg-[color:var(--color-surface)] items-center justify-center pl-4 rounded-l-full">
                                <span className="material-symbols-outlined text-[20px]">
                                    search
                                </span>
                            </div>
                            <input
                                className="form-input flex w-full min-w-0 flex-1 border-none bg-[color:var(--color-surface)] focus:outline-0 focus:ring-0 h-full placeholder:text-[color:var(--color-muted)] px-4 rounded-r-full text-base font-normal text-[color:var(--color-text)]"
                                placeholder="Find a game or court"
                            />
                        </div>
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => !isLoggedIn && setIsAuthModalOpen(true)}
                            className="flex items-center justify-center rounded-full h-10 w-10 bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                notifications
                            </span>
                        </button>
                        <button
                            onClick={(e) => !isLoggedIn && setIsAuthModalOpen(true)}
                            className="flex items-center justify-center rounded-full h-10 w-10 bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:bg-primary/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                chat_bubble
                            </span>
                        </button>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:block text-[10px] font-black tracking-widest text-[color:var(--color-muted)] hover:text-red-500 transition-colors uppercase"
                                >
                                    Logout
                                </button>
                                <Link
                                    href={`/profile/${auth.userId}`}
                                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary shadow-[0_0_10px_rgba(13,242,13,0.3)] bg-[color:var(--color-surface)] transition-transform hover:scale-110 active:scale-95 overflow-hidden"
                                >
                                    <Image
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.username || 'user'}`}
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="w-full h-full"
                                    />
                                </Link>
                            </div>
                        ) : (

                            <Link
                                href="/login"
                                className="flex items-center justify-center px-6 rounded-full h-10 bg-primary text-[color:var(--color-on-primary)] text-xs font-black hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(13,242,13,0.3)]"
                            >
                                LOGIN
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title="Account Required"
                message="Please login or sign up to access all features."
            />
        </>
    );
}
