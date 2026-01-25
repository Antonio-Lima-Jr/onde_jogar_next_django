"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/app/components/ui/TopNav";
import Footer from "@/app/components/ui/Footer";
import { fetchUser, updateProfile } from "@/lib/api";

export default function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
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
        const loggedInUserId = localStorage.getItem("user_id");
        if (loggedInUserId !== id) {
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

        loadUser();
    }, [id, router]);

    const handleSave = async () => {
        setError("");
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Authentication required. Please login again.");
            await updateProfile(id, formData, token);
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
            <div className="min-h-screen bg-background-dark text-white font-display">
                <TopNav />
                <div className="max-w-[1100px] mx-auto px-4 py-20 flex flex-col items-center justify-center gap-4">
                    <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Loading settings...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark text-[#f1f5f0] font-display">
            <TopNav />
            <main className="max-w-[1100px] mx-auto px-4 py-10">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Sidebar */}
                    <aside className="w-full md:w-64 shrink-0">
                        <h1 className="text-white text-2xl font-bold mb-8 tracking-tight">Settings</h1>
                        <nav className="flex flex-col gap-2">
                            <button className="flex items-center gap-3 px-4 py-3 bg-surface-dark border border-primary/20 text-primary rounded-xl font-medium text-left">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                                Public Profile
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-[#6e8a60] hover:text-white hover:bg-surface-dark rounded-xl font-medium transition-colors text-left">
                                <span className="material-symbols-outlined text-[20px]">manage_accounts</span>
                                Account Settings
                            </button>
                            <button className="flex items-center gap-3 px-4 py-3 text-[#6e8a60] hover:text-white hover:bg-surface-dark rounded-xl font-medium transition-colors text-left">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                                Privacy
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    router.push("/login");
                                }}
                                className="flex items-center gap-3 px-4 py-3 text-[#6e8a60] hover:text-red-400 hover:bg-surface-dark rounded-xl font-medium transition-colors mt-8 text-left"
                            >
                                <span className="material-symbols-outlined text-[20px] text-red-400">logout</span>
                                Sign Out
                            </button>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        <section className="bg-surface-dark rounded-[2rem] p-8 border border-border-dark shadow-2xl relative overflow-hidden">
                            <div className="absolute -top-24 -right-24 size-64 bg-primary/5 rounded-full blur-3xl"></div>

                            <div className="relative">
                                <div className="mb-10">
                                    <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">image</span>
                                        Profile Photo
                                    </h3>
                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        <div className="relative group cursor-pointer">
                                            <div
                                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32 ring-4 ring-primary shadow-lg bg-slate-800 transition-transform group-hover:scale-105"
                                                style={{ backgroundImage: `url("${formData.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + formData.username}")` }}
                                            ></div>
                                            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-white text-3xl mb-1">photo_camera</span>
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 flex-1 w-full">
                                            <label className="text-[10px] font-black text-[#6e8a60] uppercase tracking-widest ml-1">Avatar URL</label>
                                            <input
                                                className="form-input-dark"
                                                placeholder="https://example.com/avatar.png"
                                                type="text"
                                                value={formData.avatar_url}
                                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                            />
                                            <p className="text-[#6e8a60] text-xs font-medium italic">Paste an image link or leave empty for a default avatar.</p>
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
                                            <label className="text-[10px] font-black text-[#6e8a60] uppercase tracking-widest ml-1">Display Name / Username</label>
                                            <input
                                                className="form-input-dark"
                                                placeholder="Your name"
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 opacity-50 cursor-not-allowed">
                                            <label className="text-[10px] font-black text-[#6e8a60] uppercase tracking-widest ml-1">Account Email</label>
                                            <input
                                                className="form-input-dark cursor-not-allowed"
                                                value="admin@example.com"
                                                disabled
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-[#6e8a60] uppercase tracking-widest ml-1">Bio</label>
                                        <textarea
                                            className="form-input-dark min-h-[120px] resize-none"
                                            placeholder="Tell us about your sporting journey..."
                                            rows={4}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black text-[#6e8a60] uppercase tracking-widest ml-1">Favorite Sports</label>
                                            <span className="text-[10px] text-primary font-bold uppercase tracking-widest">{formData.favorite_sports.length} Selected</span>
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {formData.favorite_sports.map((sport) => (
                                                <div key={sport} className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-5 py-2.5 text-primary group animate-scale-in">
                                                    <span className="text-sm font-bold tracking-tight">{sport}</span>
                                                    <button
                                                        onClick={() => removeSport(sport)}
                                                        className="material-symbols-outlined text-sm hover:text-white transition-colors"
                                                    >
                                                        close
                                                    </button>
                                                </div>
                                            ))}

                                            <div className="flex items-center gap-2 bg-black/20 border border-dashed border-border-dark rounded-full pl-5 pr-2 py-1.5 focus-within:border-primary/50 transition-colors">
                                                <input
                                                    className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-[#6e8a60] w-24 outline-none"
                                                    placeholder="Add sport..."
                                                    value={newSport}
                                                    onChange={(e) => setNewSport(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && addSport()}
                                                />
                                                <button
                                                    onClick={addSport}
                                                    className="flex items-center justify-center size-8 rounded-full bg-primary text-background-dark hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                >
                                                    <span className="material-symbols-outlined text-[18px] font-black">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-10 border-t border-white/5 mt-10">
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="w-full sm:w-auto min-w-[180px] bg-primary hover:brightness-110 active:scale-[0.98] text-background-dark font-black py-4 px-10 rounded-full text-base transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="size-4 border-2 border-background-dark/20 border-t-background-dark rounded-full animate-spin"></div>
                                                    SAVING...
                                                </>
                                            ) : "SAVE CHANGES"}
                                        </button>
                                        <button
                                            onClick={() => router.push(`/profile/${id}`)}
                                            className="w-full sm:w-auto min-w-[140px] bg-border-dark hover:bg-white/10 text-white font-bold py-4 px-10 rounded-full text-base transition-all border border-white/5"
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
