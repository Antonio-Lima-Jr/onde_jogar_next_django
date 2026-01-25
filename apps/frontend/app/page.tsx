'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleCreateEventClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-dark font-display selection:bg-primary selection:text-background-dark">
      {/* Simple Top Bar */}
      <header className="px-6 py-8 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-full flex items-center justify-center text-background-dark shadow-[0_0_20px_rgba(13,242,13,0.4)]">
            <span className="material-symbols-outlined font-black text-2xl">exercise</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white">SportDiscovery</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto -mt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Live Sports Map</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
          Find and join sports <br className="hidden md:block" />
          <span className="text-primary drop-shadow-[0_0_15px_rgba(13,242,13,0.3)]">events near you</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
          Create public sports events or join games organized by other people.
          The easiest way to find players for your next match.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/events"
            className="w-full sm:w-auto px-8 py-5 bg-primary text-background-dark font-black rounded-full shadow-[0_0_40px_rgba(13,242,13,0.4)] hover:shadow-[0_0_60px_rgba(13,242,13,0.6)] hover:scale-[1.03] transition-all flex items-center justify-center gap-2 group"
          >
            VIEW EVENTS
            <span className="material-symbols-outlined font-black group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>

          <Link
            href="/events/create"
            onClick={handleCreateEventClick}
            className="w-full sm:w-auto px-8 py-5 bg-surface-dark text-white border border-border-dark font-bold rounded-full hover:bg-border-dark transition-all flex items-center justify-center gap-2"
          >
            CREATE EVENT
          </Link>

          {!isLoggedIn && (
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-5 text-slate-400 font-bold hover:text-white transition-colors"
            >
              LOGIN / SIGN UP
            </Link>
          )}
        </div>

        {/* Social Proof Placeholder / Stat */}
        <div className="mt-20 pt-12 border-t border-border-dark w-full max-w-lg">
          <div className="flex justify-center items-center gap-8 text-slate-500">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">100%</span>
              <span className="text-[10px] uppercase font-black tracking-widest mt-1 text-slate-600">Free to use</span>
            </div>
            <div className="h-8 w-px bg-border-dark"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">24/7</span>
              <span className="text-[10px] uppercase font-black tracking-widest mt-1 text-slate-600">Active games</span>
            </div>
            <div className="h-8 w-px bg-border-dark"></div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-white">50+</span>
              <span className="text-[10px] uppercase font-black tracking-widest mt-1 text-slate-600">Locations</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-border-dark bg-background-dark/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-600 font-medium">
            SportDiscovery © 2024 — Find your game.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Organize an Event"
        message="You need an account to create and manage sports events. Join our community today!"
      />
    </div>
  );
}
