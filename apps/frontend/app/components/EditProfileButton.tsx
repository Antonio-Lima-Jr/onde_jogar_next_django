"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface EditProfileButtonProps {
    profileId: string;
}

export default function EditProfileButton({ profileId }: EditProfileButtonProps) {
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
            className="flex-1 md:flex-none min-w-[140px] flex items-center justify-center rounded-full h-12 px-8 bg-black/40 text-white text-base font-bold hover:bg-white/5 border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
            EDIT PROFILE
        </Link>
    );
}
