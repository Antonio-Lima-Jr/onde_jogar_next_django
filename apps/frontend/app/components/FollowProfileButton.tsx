"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface FollowProfileButtonProps {
    profileId: string;
}

export default function FollowProfileButton({ profileId }: FollowProfileButtonProps) {
    const { auth, ready } = useAuth();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (ready && auth.userId && auth.userId.toString() === profileId) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [profileId, ready, auth.userId]);

    if (isOwner) return null;

    return (
        <button className="flex-1 md:flex-none min-w-[140px] cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-primary text-[color:var(--color-on-primary)] text-base font-black transition-all hover:brightness-105 active:scale-95 shadow-lg shadow-primary/20">
            FOLLOW
        </button>
    );
}
