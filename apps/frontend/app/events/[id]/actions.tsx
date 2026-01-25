"use client";

import { useState } from "react";
import { Event } from "@/types";

interface EventActionsProps {
    eventId: number;
    initialParticipations: number[]; // List of user IDs
    currentUserId?: number | null; // Pass from parent or auth context
}

export default function EventActions({ eventId, initialParticipations, currentUserId }: EventActionsProps) {
    const [participations, setParticipations] = useState<number[]>(initialParticipations);
    const [loading, setLoading] = useState(false);

    // Check if current user is in the list. 
    // detailed check requires knowing the user ID. 
    // For MVP without full auth context on frontend, we might struggle here.
    // But let's assume we can determine it, or we rely on API response.

    // Actually, without knowing who I am, I can't know if "I" joined.
    // Workaround for MVP partial implementation: 
    // IF we have a token in localStorage, we can assume we are logged in.
    // But strictly, the Server Component doesn't know.
    // The Client Component can check localStorage or a Context.

    // Let's implement basics:
    const isJoined = currentUserId ? participations.includes(currentUserId) : false;

    const handleJoin = async () => {
        if (!currentUserId) {
            alert("Please login first (Auth not fully implemented in frontend MVP yet)");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/events/${eventId}/join/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Token ${token}` // We need the token!
                },
            });

            if (res.ok) {
                setParticipations([...participations, currentUserId]);
            } else {
                const data = await res.json();
                alert(data.detail || "Failed to join");
            }
        } catch (error) {
            console.error(error);
            alert("Error joining event");
        } finally {
            setLoading(false);
        }
    };

    const handleLeave = async () => {
        if (!currentUserId) {
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/events/${eventId}/leave/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Token ${token}`
                },
            });

            if (res.ok) {
                setParticipations(participations.filter(id => id !== currentUserId));
            } else {
                const data = await res.json();
                alert(data.detail || "Failed to leave");
            }
        } catch (error) {
            console.error(error);
            alert("Error leaving event");
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
            <button className="flex items-center justify-center rounded-full h-16 w-16 bg-surface-dark border border-border-dark hover:border-red-500/50 hover:text-red-500 transition-colors group">
                <span className="material-symbols-outlined text-[28px] group-hover:filled-icon">
                    favorite
                </span>
            </button>
        </div>
    );
}
