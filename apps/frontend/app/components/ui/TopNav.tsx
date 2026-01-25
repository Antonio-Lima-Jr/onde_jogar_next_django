"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopNav() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        router.push("/login");
        router.refresh();
    };

    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-border-dark px-4 md:px-10 py-3 sticky top-0 bg-background-dark/90 backdrop-blur-xl z-50">
            <div className="flex items-center gap-8 text-white">
                <Link href="/events" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                    <div className="size-8 bg-primary rounded-full flex items-center justify-center text-background-dark">
                        <span className="material-symbols-outlined font-extrabold text-[20px]">exercise</span>
                    </div>
                    <h2 className="text-xl font-extrabold leading-tight tracking-tight">SportDiscovery</h2>
                </Link>
                <div className="hidden lg:flex items-center gap-9 font-display">
                    <Link
                        className="text-white text-sm font-semibold border-b-2 border-primary pb-1"
                        href="/events"
                    >
                        Explore
                    </Link>
                    <Link
                        className="text-slate-400 text-sm font-medium hover:text-primary transition-colors"
                        href="#"
                    >
                        My Events
                    </Link>
                    <Link
                        className="text-slate-400 text-sm font-medium hover:text-primary transition-colors"
                        href="#"
                    >
                        Groups
                    </Link>
                    <Link
                        className="text-slate-400 text-sm font-medium hover:text-primary transition-colors"
                        href="#"
                    >
                        Venues
                    </Link>
                </div>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
                <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded-full h-full">
                        <div className="text-slate-400 flex border-none bg-surface-dark items-center justify-center pl-4 rounded-l-full">
                            <span className="material-symbols-outlined text-[20px]">
                                search
                            </span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 border-none bg-surface-dark focus:outline-0 focus:ring-0 h-full placeholder:text-slate-500 px-4 rounded-r-full text-sm font-normal text-white"
                            placeholder="Find a game or court"
                        />
                    </div>
                </label>
                <div className="flex gap-2">
                    <button className="flex items-center justify-center rounded-full h-10 w-10 bg-surface-dark text-white hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                            notifications
                        </span>
                    </button>
                    <button className="flex items-center justify-center rounded-full h-10 w-10 bg-surface-dark text-white hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">
                            chat_bubble
                        </span>
                    </button>

                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="hidden md:block text-[10px] font-black tracking-widest text-slate-500 hover:text-red-500 transition-colors uppercase"
                            >
                                Logout
                            </button>
                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary shadow-[0_0_10px_rgba(13,242,13,0.3)] bg-slate-800"
                            ></div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center justify-center px-6 rounded-full h-10 bg-primary text-black text-xs font-black hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(13,242,13,0.3)]"
                        >
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
