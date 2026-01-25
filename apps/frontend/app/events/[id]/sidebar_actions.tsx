'use client';

import { useState, useEffect } from 'react';
import AuthModal from '@/app/components/AuthModal';

export default function SidebarActions() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleProtectedClick = () => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <button
                onClick={handleProtectedClick}
                className="w-full bg-primary text-background-dark hover:bg-primary/90 transition-all py-3 rounded-full text-sm font-black shadow-[0_0_20px_rgba(13,242,13,0.2)]"
            >
                MESSAGE
            </button>
            <button
                onClick={handleProtectedClick}
                className="w-full bg-white/5 hover:bg-white/10 text-white transition-all py-3 rounded-full text-sm font-bold border border-white/10"
            >
                FOLLOW ORGANIZER
            </button>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title="Connect with Organizer"
                message="Login to message the organizer or follow them for future games."
            />
        </div>
    );
}
