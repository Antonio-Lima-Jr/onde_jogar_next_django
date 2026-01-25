'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { joinEvent, leaveEvent } from '@/lib/api';
import { Event } from '@/types/event';

interface EventCardProps {
    event: Event;
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

export default function EventCard({ event }: EventCardProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(localStorage.getItem('token'));
    }, []);

    const sportStyle = getSportIcon(event.title);
    const { time, day } = formatDate(event.date);
    const participationCount = event.participants_count || 0;
    const slotsLeft = event.slots - participationCount;
    const percentage = (participationCount / event.slots) * 100;
    const isJoined = event.is_authenticated_user_joined;

    const handleAction = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!token) {
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            if (isJoined) {
                await leaveEvent(event.id, token);
            } else {
                await joinEvent(event.id, token);
            }
            router.refresh();
        } catch (error: any) {
            alert(error.message || 'Failed to update participation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Link href={`/events/${event.id}`}>
            <div className="group relative flex flex-col gap-4 rounded-xl bg-surface-dark p-4 shadow-xl transition-all border border-transparent hover:border-primary/40 cursor-pointer">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className={`size-12 ${sportStyle.bgColor} rounded-full flex items-center justify-center ${sportStyle.color} border ${sportStyle.borderColor}`}>
                            <span className="material-symbols-outlined text-2xl">{sportStyle.icon}</span>
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-white leading-tight">{event.title}</h4>
                            <p className="text-xs font-medium text-primary mt-1">{event.description.substring(0, 30)}...</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-white">{time}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{day}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-lg text-primary">location_on</span>
                    <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-border-dark">
                    <div className="flex flex-col gap-1 w-1/2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                            <span className="text-primary">{participationCount}/{event.slots} Joined</span>
                            <span>{slotsLeft} slots left</span>
                        </div>
                        <div className="h-1.5 w-full bg-background-dark rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                        </div>
                    </div>
                    <button
                        className={`${isJoined ? 'bg-red-500/20 text-red-500 border border-red-500/40' : 'bg-primary text-black'
                            } hover:brightness-110 px-6 py-2 rounded-full font-bold text-sm transition-all transform active:scale-95 shadow-[0_0_15px_rgba(13,242,13,0.3)] disabled:opacity-50`}
                        onClick={handleAction}
                        disabled={loading}
                    >
                        {loading ? '...' : isJoined ? 'Leave' : 'Join'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
