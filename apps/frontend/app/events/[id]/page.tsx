import TopNav from "@/app/components/ui/TopNav";
import EventActions from "./actions";
import Footer from "@/app/components/ui/Footer";
import DiscussionSection from "./discussion";
import SidebarActions from "./sidebar_actions";
import Link from "next/link";
import { fetchEvent } from "@/lib/api";
import EventMap from "@/app/components/Map";
import { notFound } from "next/navigation";

interface Participation {
    id: string;
    user: {
        id: string;
        username: string;
        email: string;
    };
    joined_at: string;
}

interface EventData {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    category?: {
        id: number;
        name: string;
        slug: string;
        description: string;
    } | null;
    latitude?: number | null;
    longitude?: number | null;
    created_by: {
        id: string;
        username: string;
        email: string;
    };
    slots: number;
    participants_count: number;
    participations: Participation[];
    is_authenticated_user_joined: boolean;
}

async function getEvent(id: string): Promise<EventData | null> {
    try {
        return await fetchEvent(id);
    } catch (error) {
        console.error("Failed to fetch event:", error);
        return null;
    }
}

const getCategoryIcon = (slug?: string | null) => {
    switch ((slug ?? "").toLowerCase()) {
        case "esportivo":
            return "sports_soccer";
        case "familiar":
            return "family_restroom";
        case "trabalho":
            return "work";
        case "social":
            return "groups";
        case "estudo":
            return "school";
        case "outro":
            return "category";
        default:
            return "event";
    }
};

const getCategoryBanner = (slug?: string | null) => {
    switch ((slug ?? "").toLowerCase()) {
        case "esportivo":
            return {
                imageUrl: "/banners/esportivo.png",
                gradient: "linear-gradient(0deg, rgba(5, 10, 5, 0.95) 0%, rgba(5, 10, 5, 0) 70%)",
            };
        case "familiar":
            return {
                imageUrl: "/banners/familia.png",
                gradient: "linear-gradient(0deg, rgba(10, 12, 8, 0.92) 0%, rgba(10, 12, 8, 0) 70%)",
            };
        case "trabalho":
            return {
                imageUrl: "/banners/trabalho.png",
                gradient: "linear-gradient(0deg, rgba(8, 12, 14, 0.95) 0%, rgba(8, 12, 14, 0) 70%)",
            };
        case "social":
            return {
                imageUrl: "/banners/social.jpg",
                gradient: "linear-gradient(0deg, rgba(12, 8, 14, 0.95) 0%, rgba(12, 8, 14, 0) 70%)",
            };
        case "estudo":
            return {
                imageUrl: "/banners/estudo.jpg",
                gradient: "linear-gradient(0deg, rgba(6, 10, 14, 0.93) 0%, rgba(6, 10, 14, 0) 70%)",
            };
        case "outro":
            return {
                imageUrl: "/banners/outro.jpg",
                gradient: "linear-gradient(0deg, rgba(8, 10, 10, 0.9) 0%, rgba(8, 10, 10, 0) 70%)",
            };
        default:
            return {
                imageUrl: "/banners/default.jpg",
                gradient: "linear-gradient(0deg, rgba(5, 10, 5, 0.95) 0%, rgba(5, 10, 5, 0) 70%)",
            };
    }
};

export default async function EventDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEvent(id);
    if (!event) {
        notFound();
    }

    // Format date
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const timeStr = eventDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    const categoryIcon = getCategoryIcon(event.category?.slug);
    const banner = getCategoryBanner(event.category?.slug);

    return (
        <>
            <TopNav />
            <main className="max-w-[1280px] mx-auto px-4 md:px-10 py-8">
                {/* Hero Section */}
                <div className="relative w-full mb-10">
                    <div
                        className="aspect-[21/9] w-full bg-cover bg-center rounded-2xl overflow-hidden shadow-2xl relative"
                        style={{
                            backgroundImage:
                                `${banner.gradient}, url("${banner.imageUrl}")`,
                        }}
                    >
                        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 flex flex-col gap-4">
                            <div className="flex gap-3">
                                <div className="flex h-8 items-center justify-center gap-x-2 rounded-full bg-primary px-4 shadow-[0_0_20px_rgba(13,242,13,0.6)]">
                                    <span className="material-symbols-outlined text-[18px] text-black filled-icon">
                                        {categoryIcon}
                                    </span>
                                    <p className="text-black text-xs font-black uppercase tracking-widest">
                                        {event.category?.name ?? "Event"}
                                    </p>
                                </div>
                            </div>
                            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-none tracking-tight">
                                {event.title}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        {/* Actions */}
                        <EventActions
                            eventId={event.id}
                            initialParticipations={event.participations.map((p) => p.user.id)}
                        />

                        {/* Description */}
                        <div className="bg-[color:var(--color-surface)] p-8 rounded-2xl border border-[color:var(--color-border)] shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[color:var(--color-text)]">
                                <span className="material-symbols-outlined text-primary text-[28px]">
                                    description
                                </span>
                                Event Description
                            </h3>
                            <div className="text-[color:var(--color-muted)] space-y-6 leading-relaxed font-normal">
                                <p className="text-lg text-[color:var(--color-text)]">{event.description}</p>
                            </div>
                        </div>

                        {/* Discussion Section */}
                        <DiscussionSection eventId={event.id} />
                    </div>

                    {/* Right Sidebar */}
                    <aside className="lg:col-span-4 flex flex-col gap-8 sticky top-24">
                        {/* Organizer Card */}
                        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="relative">
                                    <div
                                        className="size-16 rounded-full bg-cover bg-center border-2 border-primary p-0.5 shadow-[0_0_15px_rgba(13,242,13,0.3)]"
                                        style={{
                                            backgroundImage:
                                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAyGqfXGWhrqDPHr-Dn3j9e5haYUbVscAWEeQvpN4qkbLoRW7JyGmTHgIAzNgFVlGa9AxhQJD6dE8M0n0HXWL4HnUkhJfADl7t2PkDhabidCjxkl2DA1udBvIPZkI7tjQFDTC9l-jMsX-tMsMMKloo-CLvxX4MV2T4whAa4z2FgMnuV_S9lL_tQEg9RbIVB8Ly2YMJ2a2EcgZC6CKT9kaBcoXROCk-MTOSIBUzJLxFWWG1XgQkZiagJ9XnWhENeeeFWKnVHezqmJAA")',
                                        }}
                                    ></div>
                                    <div className="absolute -bottom-0 -right-0 bg-primary text-black rounded-full size-6 flex items-center justify-center border-2 border-surface-dark">
                                        <span className="material-symbols-outlined text-[14px] font-bold filled-icon">
                                            verified
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <Link href={`/profile/${event.created_by.id}`} className="hover:text-primary transition-colors">
                                        <h4 className="text-xl font-bold leading-tight">
                                            {event.created_by.username}
                                        </h4>
                                    </Link>

                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="text-[10px] text-primary font-black tracking-widest uppercase">
                                            Pro Organizer
                                        </span>
                                        <span className="text-slate-500">•</span>
                                        <span className="text-xs font-bold text-yellow-400">4.9 ★</span>
                                    </div>
                                </div>
                            </div>
                            <SidebarActions />
                        </div>

                        {/* Event Details Card */}
                        <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-xl">
                            <div className="p-6 flex flex-col gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                        <span className="material-symbols-outlined text-[20px]">
                                            calendar_today
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                                            Date & Time
                                        </p>
                                        <p className="font-bold text-lg">{dateStr}</p>
                                        <p className="text-sm text-slate-400">{timeStr}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="size-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                                        <span className="material-symbols-outlined text-[22px]">
                                            location_on
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                                            Venue
                                        </p>
                                        <p className="font-bold text-lg leading-tight">
                                            {event.latitude != null && event.longitude != null
                                                ? `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
                                                : 'No location'}
                                        </p>
                                        <p className="text-sm text-slate-400 mb-6">
                                            {event.latitude != null && event.longitude != null
                                                ? `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`
                                                : 'No location'}
                                        </p>
                                        <div className="w-full aspect-[4/3] rounded-2xl relative overflow-hidden bg-black border border-border-dark">
                                            {event.latitude != null && event.longitude != null ? (
                                                <EventMap
                                                    latitude={event.latitude}
                                                    longitude={event.longitude}
                                                    showControls={false}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-400">
                                                    No coordinates available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Participants Card */}
                        <div className="bg-surface-dark border border-border-dark rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="font-bold flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">group</span>
                                    Participants
                                </h4>
                                <span className="text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full tracking-widest uppercase">
                                    {event.participants_count} / {event.slots} joined
                                </span>
                            </div>
                            <div className="grid grid-cols-6 gap-3">
                                {event.participations.slice(0, 11).map((participation) => (
                                    <div
                                        key={participation.id}
                                        className="aspect-square rounded-full bg-gradient-to-br from-primary/20 to-surface-dark border border-white/10 hover:border-primary transition-all cursor-pointer hover:scale-105 flex items-center justify-center text-xs font-bold text-primary"
                                        title={participation.user.username}
                                    >
                                        {participation.user.username.charAt(0).toUpperCase()}
                                    </div>
                                ))}
                                {event.participants_count > 11 && (
                                    <div className="aspect-square rounded-full bg-background-dark flex items-center justify-center border border-dashed border-primary/30 group hover:border-primary transition-all cursor-pointer">
                                        <span className="text-[12px] font-black text-primary group-hover:scale-110 transition-transform">
                                            +{event.participants_count - 11}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
}
