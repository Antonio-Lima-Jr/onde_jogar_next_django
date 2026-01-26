'use client';

import Link from 'next/link';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function AuthModal({ isOpen, onClose, title = "Auth Required", message = "You need to be logged in to perform this action." }: AuthModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-[color:var(--color-surface)] border border-[color:var(--color-border)] rounded-[2rem] p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                    <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6 border border-primary/20">
                        <span className="material-symbols-outlined text-3xl font-black">lock</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-[color:var(--color-heading)] mb-2 tracking-tight">
                        {title}
                    </h3>

                    <p className="text-[color:var(--color-muted)] mb-8 font-medium">
                        {message}
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="w-full bg-primary text-[color:var(--color-on-primary)] font-black py-4 rounded-full shadow-[0_0_20px_rgba(13,242,13,0.3)] hover:shadow-[0_0_30px_rgba(13,242,13,0.5)] transition-all flex items-center justify-center gap-2"
                        >
                            LOGIN NOW
                        </Link>

                        <Link
                            href="/register"
                            className="w-full bg-[color:var(--color-surface)] text-[color:var(--color-text)] border border-[color:var(--color-border)] font-bold py-4 rounded-full hover:bg-[color:var(--color-border)] transition-all flex items-center justify-center gap-2"
                        >
                            CREATE ACCOUNT
                        </Link>

                        <button
                            onClick={onClose}
                            className="mt-2 text-[color:var(--color-muted)] hover:text-[color:var(--color-text)] text-xs font-black uppercase tracking-widest transition-colors"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
