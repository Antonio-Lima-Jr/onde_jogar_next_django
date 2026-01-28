import TopNav from "@/app/components/ui/TopNav";
import Footer from "@/app/components/ui/Footer";
import { fetchUser } from "@/lib/api";
import { Event } from "@/types/event";
import Link from "next/link";
import EventCard from "@/app/components/EventCard";
import EditProfileButton from "@/app/components/EditProfileButton";
import FollowProfileButton from "@/app/components/FollowProfileButton";
import AddSportButton from "@/app/components/AddSportButton";
import { notFound } from "next/navigation";


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
        notFound();
    }

    const currentEvents = activeTab === "upcoming" ? user.upcoming_events : user.past_events;


    return (
        <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] font-display">
            <TopNav />
            <main className="max-w-[960px] mx-auto px-4 py-8">
                {/* Breadcrumbs */}
                <div className="flex flex-wrap gap-2 py-2 mb-6">
                    <Link href="/events" className="text-[color:var(--color-muted)] text-sm font-medium hover:text-primary transition-colors">Sports Discovery</Link>
                    <span className="text-[color:var(--color-muted)] text-sm font-medium">/</span>
                    <span className="text-[color:var(--color-text)] text-sm font-medium">{user.username}</span>
                </div>

                {/* Profile Header Card */}
                <section className="bg-[color:var(--color-surface)] rounded-xl p-8 border border-[color:var(--color-border)] mb-8 relative overflow-hidden shadow-sm">
                    <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl"></div>

                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-primary shadow-lg shadow-primary/20 bg-[color:var(--color-surface)]"
                            style={{ backgroundImage: `url("${user.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.username}")` }}
                        ></div>

                        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-[color:var(--color-text)] text-3xl font-extrabold leading-tight tracking-tight">{user.username}</h1>
                                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-primary text-lg font-bold">@{user.username.toLowerCase().replace(/\s/g, '_')}</p>
                            </div>
                            <p className="text-[color:var(--color-muted)] mt-4 max-w-md text-base leading-relaxed font-medium">
                                {user.bio || "Sports enthusiast & amateur athlete. Always looking for a pickup game or a training buddy!"}
                            </p>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                            <FollowProfileButton profileId={id} />
                            <EditProfileButton profileId={id} />
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-[color:var(--color-border)]">
                        <div className="flex-1 min-w-[120px] flex flex-col gap-1 rounded-xl border border-[color:var(--color-border)] p-4 items-center bg-[color:var(--color-background)] shadow-sm">
                            <p className="text-[color:var(--color-text)] text-2xl font-black">0</p>
                            <p className="text-[color:var(--color-muted)] text-[10px] uppercase tracking-widest font-black">Followers</p>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col gap-1 rounded-xl border border-[color:var(--color-border)] p-4 items-center bg-[color:var(--color-background)] shadow-sm">
                            <p className="text-[color:var(--color-text)] text-2xl font-black">0</p>
                            <p className="text-[color:var(--color-muted)] text-[10px] uppercase tracking-widest font-black">Following</p>
                        </div>
                        <div className="flex-1 min-w-[120px] flex flex-col gap-1 rounded-xl border border-[color:var(--color-border)] p-4 items-center bg-[color:var(--color-background)] shadow-sm">
                            <p className="text-[color:var(--color-text)] text-2xl font-black">{user.games_played_count}</p>
                            <p className="text-[color:var(--color-muted)] text-[10px] uppercase tracking-widest font-black">Games Played</p>
                        </div>
                    </div>
                </section>

                <section className="mb-10">
                    <h3 className="text-[color:var(--color-text)] text-lg font-bold mb-5">Favorite Sports</h3>
                    <div className="flex flex-wrap gap-3">
                        {user.favorite_sports && user.favorite_sports.length > 0 ? (
                            user.favorite_sports.map((sport: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 bg-primary/10 border border-primary/40 rounded-full px-5 py-2.5 text-[color:var(--color-text)]">
                                    <span className="material-symbols-outlined text-xl text-primary">sports_score</span>
                                    <span className="font-semibold text-sm tracking-tight">{sport}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-[color:var(--color-muted)] text-sm font-medium italic">No favorite sports listed yet.</p>
                        )}
                        <AddSportButton profileId={id} />
                    </div>
                </section>

                {/* Events Section */}
                <section>
                    <div className="flex border-b border-[color:var(--color-border)] mb-8">
                        <Link
                            href={`?tab=upcoming`}
                            className={`px-8 py-4 border-b-2 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'upcoming'
                                    ? 'border-primary text-[color:var(--color-text)]'
                                    : 'border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]'
                                }`}
                        >
                            Upcoming Games
                        </Link>
                        <Link
                            href={`?tab=past`}
                            className={`px-8 py-4 border-b-2 font-black text-sm uppercase tracking-widest transition-all ${activeTab === 'past'
                                    ? 'border-primary text-[color:var(--color-text)]'
                                    : 'border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-text)]'
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
                        <div className="text-center py-20 bg-[color:var(--color-surface)] rounded-3xl border border-dashed border-[color:var(--color-border)]">
                            <span className="material-symbols-outlined text-5xl text-[color:var(--color-muted)] mb-4 block">event_busy</span>
                            <p className="text-[color:var(--color-muted)] font-medium tracking-tight">
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
