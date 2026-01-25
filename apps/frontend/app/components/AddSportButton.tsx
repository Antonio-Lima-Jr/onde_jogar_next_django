"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface AddSportButtonProps {
    profileId: string;
}

export default function AddSportButton({ profileId }: AddSportButtonProps) {
    const { auth, ready } = useAuth();
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        if (ready && auth.userId && auth.userId.toString() === profileId) {
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }
    }, [profileId, ready, auth.userId]);

    if (!isOwner) return null;

    return (
        <Link
            href={`/profile/${profileId}/edit`}
            className="flex items-center justify-center size-11 rounded-full border border-dashed border-slate-700 text-slate-500 hover:text-primary hover:border-primary/50 transition-all hover:scale-110 active:scale-95"
        >
            <span className="material-symbols-outlined">add</span>
        </Link>
    );
}
