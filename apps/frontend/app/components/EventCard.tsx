'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { joinEvent, leaveEvent } from '@/lib/api';
import { Event } from '@/types/event';
import AuthModal from './AuthModal';
import { useAuth } from '@/lib/auth-context';

interface EventCardProps {
    event: Event;
    onParticipationChange?: (eventId: number, isJoined: boolean) => void;
}

const sportIcons: Record<string, { icon: string; color: string; bgColor: string; borderColor: string }> = {
    basketball: { icon: 'sports_basketball', color: 'text-orange-400', bgColor: 'bg-orange-900/40', borderColor: 'border-orange-900/60' },
    tennis: { icon: 'sports_tennis', color: 'text-blue-400', bgColor: 'bg-blue-900/40', borderColor: 'border-blue-900/60' },
    running: { icon: 'directions_run', color: 'text-green-400', bgColor: 'bg-green-900/40', borderColor: 'border-green-900/60' },
    soccer: { icon: 'sports_soccer', color: 'text-yellow-400', bgColor: 'bg-yellow-900/40', borderColor: 'border-yellow-900/60' },
    default: { icon: 'exercise', color: 'text-primary', bgColor: 'bg-primary/20', borderColor: 'border-primary/40' },
};

function getSportIcon(title: string) {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('basketball')) return sportIcons.basketball;
    if (lowerTitle.includes('tennis')) return sportIcons.tennis;
    if (lowerTitle.includes('run')) return sportIcons.running;
    if (lowerTitle.includes('soccer') || lowerTitle.includes('football')) return sportIcons.soccer;
    return sportIcons.default;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isToday) return { time, day: 'Today' };
    if (isTomorrow) return { time, day: 'Tomorrow' };
    return { time, day: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
}

export default function EventCard({ event, onParticipationChange }: EventCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { auth } = useAuth();

    const sportStyle = getSportIcon(event.title);
    const { time, day } = formatDate(event.date);
    const participationCount = event.participants_count || 0;
    const slotsLeft = event.slots - participationCount;
    const percentage = (participationCount / event.slots) * 100;

    // Check if user is joined either from server data or by checking the participations list with client-side userId
    const isJoined = event.is_authenticated_user_joined ||
        (auth.userId && event.participations?.some(p => p.user.id === auth.userId));


    const handleAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.token) {
            setIsAuthModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            if (isJoined) {
                await leaveEvent(event.id, auth.token);
            } else {
                await joinEvent(event.id, auth.token);
            }
            onParticipationChange?.(event.id, !isJoined);
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Failed to update participation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={() => router.push(`/events/${event.id}`)}
                className="group relative flex flex-col gap-4 rounded-xl bg-[color:var(--color-surface)] p-4 shadow-xl transition-all border border-[color:var(--color-border)] hover:border-primary/50 cursor-pointer"
            >
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`size-12 ${sportStyle.bgColor} rounded-full flex items-center justify-center ${sportStyle.color} border ${sportStyle.borderColor}`}>
                            <span className="material-symbols-outlined text-2xl">{sportStyle.icon}</span>
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-[color:var(--color-text)] leading-tight">{event.title}</h4>
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] text-[color:var(--color-muted)] uppercase font-bold">By</span>
                                <Link
                                    href={`/profile/${event.created_by.id}`}
                                    className="text-[10px] text-primary font-black uppercase tracking-widest hover:underline relative z-10"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {event.created_by.username}
                                </Link>
                            </div>
                        </div>

                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-[color:var(--color-text)]">{time}</p>
                        <p className="text-[10px] text-[color:var(--color-muted)] uppercase font-bold">{day}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
                    <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                    <span className="truncate">
                        {event.latitude != null && event.longitude != null
                            ? `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
                            : 'No location'}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-[color:var(--color-border)]">
                    <div className="flex flex-col gap-1 w-1/2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-[color:var(--color-muted)]">
                            <span className="text-primary">{participationCount}/{event.slots} Joined</span>
                            <span>{slotsLeft} slots left</span>
                        </div>
                        <div className="h-1.5 w-full bg-[color:var(--color-border)] rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                    <button
                        className={`${isJoined ? 'bg-red-500/20 text-red-600 border border-red-500/40' : 'bg-primary text-[color:var(--color-on-primary)]'
                            } hover:brightness-110 px-6 py-2 rounded-full font-bold text-sm transition-all transform active:scale-95 shadow-[0_0_15px_rgba(13,242,13,0.3)] disabled:opacity-50 relative z-10`}
                        onClick={handleAction}
                        disabled={loading}
                    >
                        {loading ? '...' : isJoined ? 'Leave' : 'Join'}
                    </button>
                </div>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                title="Want to join this game?"
                message="You need an account to join sports events. It only takes a minute!"
            />
        </>
    );
}
