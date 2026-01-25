import TopNav from "@/app/components/ui/TopNav";
import Footer from "@/app/components/ui/Footer";
import { fetchUser } from "@/lib/api";
import { Event } from "@/types/event";
import Link from "next/link";
import EventCard from "@/app/components/EventCard";
import EditProfileButton from "@/app/components/EditProfileButton";
import AddSportButton from "@/app/components/AddSportButton";


interface UserProfile {
    id: number;
    username: string;
    email: string;
    bio?: string;
    avatar_url?: string;
    favorite_sports?: string[];
    games_played_count: number;
    upcoming_events: Event[];
    past_events: Event[];
}

async function getUser(id: string): Promise<UserProfile | null> {
    try {
        return await fetchUser(id);
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export default async function ProfilePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const { id } = await params;
    const { tab } = await searchParams;
    const user = await getUser(id);
    const activeTab = tab || "upcoming";

    if (!user) {
        return (
            <div className="min-h-screen bg-background-dark text-white">
                <TopNav />
                <main className="max-w-[1200px] mx-auto px-4 py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4">User Not Found</h1>
                    <Link href="/events" className="text-primary hover:underline">Back to Events</Link>
                </main>
                <Footer />
            </div>
        );
    }

    const currentEvents = activeTab === "upcoming" ? user.upcoming_events : user.past_events;


    return (
        <div className="min-h-screen bg-background-dark text-[#f1f5f0] font-display">
            <TopNav />
            <main className="max-w-[960px] mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 py-2 mb-6">
                    <Link href="/events" className="text-slate-500 text-sm font-medium hover:text-primary transition-colors">Sports Discovery</Link>
                    <span className="text-slate-500 text-sm font-medium">/</span>
                    <span className="text-white text-sm font-medium">{user.username}</span>
                </div>

                {/* Profile Header Card */}
                <section className="bg-surface-dark rounded-[2rem] p-8 border border-border-dark mb-8 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-primary shadow-[0_0_30px_rgba(89,242,13,0.3)] bg-slate-800"
                            style={{ backgroundImage: `url("${user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username}")` }}
                        ></div>

                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-white text-3xl font-extrabold leading-tight tracking-tight">{user.username}</h1>
                                <span className="material-symbols-outlined text-primary text-2xl filled-icon">verified</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-primary text-lg font-bold">@{user.username.toLowerCase().replace(/\s/g, '_')}</p>
                            </div>
                            <p className="text-slate-400 mt-4 max-w-md text-base leading-relaxed font-medium">
                                {user.bio || "Sports enthusiast & amateur athlete. Always looking for a pickup game or a training buddy!"}
                            </p>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                            <button className="flex-1 md:flex-none min-w-[140px] cursor-pointer items-center justify-center rounded-full h-12 px-8 bg-primary text-background-dark text-base font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20">
                                FOLLOW
                            </button>
                            <EditProfileButton profileId={id} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-white/5">
                        <div className="flex-1 min-w-[120px] flex flex-col gap-1 rounded-2xl border border-white/5 p-4 items-center bg-black/20 hover:border-primary/20 transition-colors">
                            <p className="text-primary text-2xl font-black">0</p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Followers</p>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col gap-1 rounded-2xl border border-white/5 p-4 items-center bg-black/20 hover:border-primary/20 transition-colors">
                            <p className="text-primary text-2xl font-black">0</p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Following</p>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col gap-1 rounded-2xl border border-white/5 p-4 items-center bg-black/20 hover:border-primary/20 transition-colors">
                            <p className="text-primary text-2xl font-black">{user.games_played_count}</p>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black">Games Played</p>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h3 className="text-white text-lg font-bold mb-5 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">workspace_premium</span>
                        Favorite Sports
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {user.favorite_sports && user.favorite_sports.length > 0 ? (
                            user.favorite_sports.map((sport: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2.5 text-primary">
                                    <span className="material-symbols-outlined text-xl">sports_score</span>
                                    <span className="font-bold text-sm tracking-tight">{sport}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-sm font-medium italic">No favorite sports listed yet.</p>
                        )}
                        <AddSportButton profileId={id} />
                    </div>
                </section>

                {/* Events Section */}
                <section>
                    <div className="flex border-b border-border-dark mb-8">
                        <Link
                            href={`?tab=upcoming`}
                            className={`px-8 py-4 border-b-2 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'upcoming'
                                    ? 'border-primary text-white bg-white/5'
                                    : 'border-transparent text-slate-500 hover:text-white'
                                }`}
                        >
                            Upcoming Games
                        </Link>
                        <Link
                            href={`?tab=past`}
                            className={`px-8 py-4 border-b-2 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'past'
                                    ? 'border-primary text-white bg-white/5'
                                    : 'border-transparent text-slate-500 hover:text-white'
                                }`}
                        >
                            Past History
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {currentEvents.map((event: Event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    {currentEvents.length === 0 && (
                        <div className="text-center py-20 bg-surface-dark rounded-3xl border border-dashed border-border-dark">
                            <span className="material-symbols-outlined text-5xl text-slate-700 mb-4 block">event_busy</span>
                            <p className="text-slate-400 font-medium tracking-tight">
                                No {activeTab} events found.
                            </p>
                        </div>
                    )}
                </section>

            </main>
            <Footer />
        </div>
    );
}
