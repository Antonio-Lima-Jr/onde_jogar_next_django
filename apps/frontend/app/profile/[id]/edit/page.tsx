"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import Footer from "@/app/components/ui/Footer";
import { fetchUser, updateProfile } from "@/lib/api";
import { useRequireAuth } from "@/lib/use-require-auth";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { auth, ready } = useRequireAuth();
    const { clearAuth } = useAuth();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        bio: "",
        avatar_url: "",
        favorite_sports: [] as string[],
    });
    const [newSport, setNewSport] = useState("");

    useEffect(() => {
        if (ready && auth.userId && auth.userId.toString() !== id) {
            router.push(`/profile/${id}`);
            return;
        }

        const loadUser = async () => {
            try {
                const user = await fetchUser(id);
                setFormData({
                    username: user.username,
                    bio: user.bio || "",
                    avatar_url: user.avatar_url || "",
                    favorite_sports: user.favorite_sports || [],
                });
            } catch (err: any) {
                console.error("Error loading profile:", err);
                setError("Failed to load profile data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (ready) {
            loadUser();
        }
    }, [id, router, ready, auth.userId]);

    const handleSave = async () => {
        setError("");
        setSaving(true);
        try {
            if (!auth.token) throw new Error("Authentication required. Please login again.");
            await updateProfile(id, formData, auth.token);
            router.push(`/profile/${id}`);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const addSport = () => {
        if (newSport && !formData.favorite_sports.includes(newSport)) {
            setFormData({
                ...formData,
                favorite_sports: [...formData.favorite_sports, newSport],
            });
            setNewSport("");
        }
    };

    const removeSport = (sport: string) => {
        setFormData({
            ...formData,
            favorite_sports: formData.favorite_sports.filter((s) => s !== sport),
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] font-display">
                <TopNav />
                <div className="max-w-[1100px] mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
                    <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[color:var(--color-muted)] font-medium animate-pulse">Loading settings...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] font-display">
            <TopNav />
            <main className="max-w-[1100px] mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <h1 className="text-[color:var(--color-heading)] text-2xl font-bold mb-8 tracking-tight">Settings</h1>
                        <nav className="flex flex-col gap-2">
                            <button className="flex items-center gap-3 px-4 py-3 bg-[color:var(--color-sidebar-active-bg)] text-[color:var(--color-sidebar-active-text)] border border-primary/20 rounded-xl font-semibold text-left">
                                <span className="material-symbols-outlined text-[20px] text-primary">person</span>
                                Public Profile
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-sidebar-text)] hover:text-[color:var(--color-sidebar-hover-text)] hover:bg-[color:var(--color-sidebar-hover-bg)] rounded-xl font-medium transition-colors text-left">
                                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                                Account Settings
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-sidebar-text)] hover:text-[color:var(--color-sidebar-hover-text)] hover:bg-[color:var(--color-sidebar-hover-bg)] rounded-xl font-medium transition-colors text-left">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                Privacy
                            </button>
                            <button
                                onClick={() => {
                                    clearAuth();
                                    router.push("/login");
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-[color:var(--color-sidebar-text)] hover:text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors mt-8 text-left"
                            >
                                <span className="material-symbols-outlined text-[20px]">logout</span>
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <section className="bg-[color:var(--color-panel)] rounded-2xl p-8 border border-[color:var(--color-panel-border)] shadow-sm relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl"></div>

                            <div className="relative">
                                <div className="mb-10">
                                    <h3 className="text-[color:var(--color-heading)] text-lg font-bold mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">image</span>
                                        Profile Photo
                                    </h3>
                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        <div className="relative group cursor-pointer">
                                            <div
                                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-white shadow-md transition-transform group-hover:scale-105"
                                                style={{ backgroundImage: `url("${formData.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.username}")` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-white text-3xl mb-1">photo_camera</span>
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1 w-full">
                                            <label className="text-xs font-bold text-[color:var(--color-label)] uppercase tracking-widest ml-1">Avatar URL</label>
                                            <input
                                                className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] border rounded-xl px-4 py-3 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)]"
                                                placeholder="https://example.com/avatar.png"
                                                type="text"
                                                value={formData.avatar_url}
                                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                            />
                                            <p className="text-[color:var(--color-label)] text-xs font-medium">Paste an image link or leave empty for a default avatar.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl text-sm flex items-center gap-3 animate-shake">
                                            <span className="material-symbols-outlined text-lg">error</span>
                                            {error}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[color:var(--color-label)] uppercase tracking-widest">Display Name</label>
                                            <input
                                                className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] border rounded-xl px-4 py-3 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)]"
                                                placeholder="Your name"
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[color:var(--color-label)] uppercase tracking-widest">Account Email</label>
                                            <input
                                                className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] border rounded-xl px-4 py-3 text-[color:var(--color-input-placeholder)] cursor-not-allowed"
                                                value="admin@example.com"
                                                disabled
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[color:var(--color-label)] uppercase tracking-widest">Theme</label>
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setTheme("dark")}
                                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${theme === "dark"
                                                    ? "bg-primary text-[color:var(--color-on-primary)] border-primary"
                                                    : "bg-[color:var(--color-input-bg)] text-[color:var(--color-input-text)] border-[color:var(--color-input-border)]"
                                                    }`}
                                            >
                                                Dark
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setTheme("light")}
                                                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${theme === "light"
                                                    ? "bg-primary text-[color:var(--color-on-primary)] border-primary"
                                                    : "bg-[color:var(--color-input-bg)] text-[color:var(--color-input-text)] border-[color:var(--color-input-border)]"
                                                    }`}
                                            >
                                                Light
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-[color:var(--color-label)] uppercase tracking-widest">Bio</label>
                                        <textarea
                                            className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] border rounded-xl px-4 py-3 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)] min-h-[120px] resize-none"
                                            placeholder="Tell us about your sporting journey..."
                                            rows={4}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <label className="text-xs font-bold text-[color:var(--color-label)] uppercase tracking-widest">Favorite Sports</label>

                                        <div className="flex flex-wrap gap-3">
                                            {formData.favorite_sports.map((sport) => (
                                                <div key={sport} className="flex items-center gap-2 bg-[color:var(--color-chip-bg)] border border-[color:var(--color-chip-border)] rounded-full px-4 py-2 text-[color:var(--color-chip-text)] group animate-scale-in">
                                                    <span className="material-symbols-outlined text-lg text-[color:var(--color-chip-icon)]">sports_score</span>
                                                    <span className="text-sm font-semibold">{sport}</span>
                                                    <button
                                                        onClick={() => removeSport(sport)}
                                                        className="material-symbols-outlined text-sm hover:text-red-500 transition-colors"
                                                    >
                                                        close
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="flex items-center gap-2 bg-transparent border border-dashed border-[color:var(--color-chip-border)] rounded-full pl-4 pr-3 py-2 focus-within:border-primary transition-colors">
                                                <input
                                                    className="bg-transparent border-none focus:ring-0 text-sm text-[color:var(--color-input-text)] placeholder:text-[color:var(--color-input-placeholder)] w-24 outline-none"
                                                    placeholder="Add sport..."
                                                    value={newSport}
                                                    onChange={(e) => setNewSport(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && addSport()}
                                                />
                                                <button onClick={addSport} className="material-symbols-outlined text-lg text-[color:var(--color-chip-icon)] hover:text-primary transition-colors">
                                                    add
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 border-t border-[color:var(--color-panel-border)] mt-10">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full sm:w-auto min-w-[160px] bg-primary hover:brightness-105 active:scale-[0.98] text-[color:var(--color-on-primary)] font-black py-4 px-8 rounded-full text-base transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="size-4 border-2 border-[color:var(--color-on-primary)]/20 border-t-[color:var(--color-on-primary)] rounded-full animate-spin"></div>
                                                    SAVING...
                                                </>
                                            ) : "SAVE CHANGES"}
                                        </button>
                                        <button
                                            onClick={() => router.push(`/profile/${id}`)}
                                            className="w-full sm:w-auto min-w-[120px] bg-[color:var(--color-cancel-bg)] hover:bg-[color:var(--color-cancel-bg-hover)] text-[color:var(--color-cancel-text)] font-bold py-4 px-8 rounded-full text-base transition-colors border border-[color:var(--color-panel-border)]"
                                        >
                                            CANCEL
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
