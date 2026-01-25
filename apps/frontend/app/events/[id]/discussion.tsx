'use client';

import { useState, useEffect } from 'react';
import AuthModal from '@/app/components/AuthModal';
import { useAuth } from '@/lib/auth-context';

export default function DiscussionSection({ eventId }: { eventId: number }) {
    const { auth, ready } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (ready) {
            setIsLoggedIn(!!auth.token);
        }
    }, [ready, auth.token]);

    const handleProtectedClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            setIsAuthModalOpen(true);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h3 className="text-xl font-bold flex items-center gap-3 px-2 text-white">
                <span className="material-symbols-outlined text-primary">forum</span>
                Discussion <span className="text-slate-500 font-normal ml-1">(0)</span>
            </h3>
            <div className="flex gap-4 items-start bg-surface-dark p-6 rounded-2xl border border-border-dark shadow-lg">
                <div
                    className="size-12 rounded-full bg-cover bg-center shrink-0 border border-border-dark bg-slate-800"
                ></div>
                <div className="flex-1 flex flex-col gap-4">
                    <textarea
                        onClick={handleProtectedClick}
                        className="w-full bg-background-dark border border-border-dark rounded-xl focus:ring-1 focus:ring-primary/50 focus:border-primary p-4 text-base text-white placeholder:text-slate-600 resize-none transition-all outline-none"
                        placeholder="Ask a question or share a thought..."
                        rows={3}
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            onClick={handleProtectedClick}
                            className="px-8 py-2.5 bg-primary text-background-dark hover:bg-primary/90 transition-all rounded-full text-sm font-bold shadow-[0_0_15px_rgba(13,242,13,0.3)]"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title="Join the Conversation"
                message="You need to be logged in to post comments and interact with other players."
            />
        </div>
    );
}
