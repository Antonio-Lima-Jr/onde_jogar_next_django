"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { joinEvent, leaveEvent } from "@/lib/api";
import AuthModal from "@/app/components/AuthModal";

interface EventActionsProps {
    eventId: number;
    initialParticipations: number[]; // List of user IDs
}

export default function EventActions({ eventId, initialParticipations }: EventActionsProps) {
    const [participations, setParticipations] = useState<number[]>(initialParticipations);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Retrieve auth info from localStorage on mount
        const storedUserId = localStorage.getItem("user_id");
        const storedToken = localStorage.getItem("token");

        if (storedUserId) setUserId(parseInt(storedUserId));
        if (storedToken) setToken(storedToken);
    }, []);

    const isJoined = userId ? participations.includes(userId) : false;

    const handleJoin = async () => {
        if (!token || !userId) {
            setIsAuthModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            await joinEvent(eventId, token);
            setParticipations([...participations, userId]);
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to join event");
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!token || !userId) return;

        setLoading(true);
        try {
            await leaveEvent(eventId, token);
            setParticipations(participations.filter(id => id !== userId));
            router.refresh();
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to leave event");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-4">
            {!isJoined ? (
                <button
                    onClick={handleJoin}
                    disabled={loading}
                    className="flex-1 min-w-[200px] cursor-pointer items-center justify-center rounded-full h-16 px-8 bg-primary text-black text-xl font-black leading-normal tracking-tight shadow-[0_0_40px_rgba(13,242,13,0.4)] hover:shadow-[0_0_50px_rgba(13,242,13,0.6)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    <span className="truncate">{loading ? "JOINING..." : "JOIN GAME"}</span>
                </button>
            ) : (
                <button
                    onClick={handleLeave}
                    disabled={loading}
                    className="flex-1 min-w-[200px] cursor-pointer items-center justify-center rounded-full h-16 px-8 bg-red-500 text-white text-xl font-black leading-normal tracking-tight hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                    <span className="truncate">{loading ? "LEAVING..." : "LEAVE GAME"}</span>
                </button>
            )}
            <button
                onClick={() => !token && setIsAuthModalOpen(true)}
                className="flex items-center justify-center rounded-full h-16 w-16 bg-surface-dark border border-border-dark hover:border-red-500/50 hover:text-red-500 transition-colors group"
            >
                <span className="material-symbols-outlined text-[28px] group-hover:filled-icon">
                    favorite
                </span>
            </button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title="Join this Event"
                message="Please login or create an account to join this match and see other players."
            />
        </div>
    );
}
