'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setAuth } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(formData);
            setAuth({
                token: data.access,
                userId: data.user?.id ?? null,
                email: data.user?.email ?? null,
                username: data.user?.username ?? null,
            });

            router.push('/events');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[color:var(--color-background)] font-display text-[color:var(--color-text)]">
            <div className="flex min-h-screen">
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[color:var(--color-text)]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-70"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAnNk8WKYqIQ5JQnEIh0zrDMfhHOpOlWHqj8EZKfE6cH5se15a8ioIJMHsHSAECHbwhKovpqrqvH2HwBFUyGhUpAGEM7mUcJYjXVwLj5O5IAaeWRY3fdiBIPd_axPPGA4_5cuwyRuVdQeuQR7FovgfJg7L7C97uORGrgcYvsSewYuEQTELU0aR0ofcc01wgu3rEVk7lGg425lMFqbko3NgmJWwSNfYGQTL1mOCxy769FHAfgqyZRTl8Km3Bx4dfIvgTURSSV3FAZz0")',
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full">
                        <Link href="/" className="flex items-center gap-3 text-primary">
                            <div className="size-10">
                                <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                                </svg>
                            </div>
                            <span className="text-white text-2xl font-bold tracking-tight">SportsConnect</span>
                        </Link>
                        <div className="max-w-md">
                            <h1 className="text-white text-5xl font-extrabold leading-[1.1] mb-6">
                                Connect with athletes, discover your game.
                            </h1>
                            <p className="text-white/80 text-lg font-light leading-relaxed">
                                Join the most active community of sports enthusiasts. Find events, book courts, and meet your next training buddy.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
                    <Link href="/" className="lg:hidden flex items-center gap-2 text-primary mb-12">
                        <div className="size-8">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-[color:var(--color-text)] text-xl font-bold">SportsConnect</h2>
                    </Link>

                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-extrabold text-[color:var(--color-text)] tracking-tight">Welcome Back</h2>
                            <p className="text-[color:var(--color-muted)] mt-2 font-medium">Please enter your details to sign in.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg whitespace-nowrap">error</span>
                                {error}
                            </div>
                        )}

                        <div className="bg-[color:var(--color-panel)] p-2 rounded-3xl border border-[color:var(--color-panel-border)]">
                            <form onSubmit={handleSubmit} className="space-y-5 p-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[color:var(--color-label)] uppercase tracking-widest ml-1">Username</label>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-input-placeholder)] text-xl">person</span>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] rounded-xl px-4 py-3.5 pl-11 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)] text-sm"
                                            placeholder="alex_sports"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-end mb-1 px-1">
                                        <label className="text-[11px] font-bold text-[color:var(--color-label)] uppercase tracking-widest">Password</label>
                                        <button type="button" className="text-xs font-bold text-[color:var(--color-text)] hover:text-primary transition-colors">Forgot Password?</button>
                                    </div>
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--color-input-placeholder)] text-xl">lock</span>
                                        <input
                                            type="password"
                                            required
                                            className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] rounded-xl px-4 py-3.5 pl-11 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)] text-sm"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-1">
                                    <input className="size-4 rounded border-[color:var(--color-panel-border)] text-primary focus:ring-primary/20" type="checkbox" />
                                    <span className="text-sm text-[color:var(--color-muted)] font-medium">Stay signed in for 30 days</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:brightness-105 active:scale-[0.98] text-[color:var(--color-on-primary)] font-black py-4 rounded-2xl text-base transition-all shadow-xl shadow-primary/20 mt-4 disabled:opacity-50"
                                >
                                    {loading ? "LOGGING IN..." : "Sign In"}
                                </button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[color:var(--color-panel-border)]"></div>
                                </div>
                                <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
                                    <span className="bg-[color:var(--color-panel)] px-4 text-[color:var(--color-label)]">Or continue with</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button type="button" className="flex items-center justify-center gap-3 w-full border border-[color:var(--color-panel-border)] py-3 px-4 rounded-xl text-sm font-semibold text-[color:var(--color-text)] hover:bg-[color:var(--color-surface)] transition-all">
                                    <svg className="size-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                    </svg>
                                    Google
                                </button>
                                <button type="button" className="flex items-center justify-center gap-3 w-full border border-[color:var(--color-panel-border)] py-3 px-4 rounded-xl text-sm font-semibold text-[color:var(--color-text)] hover:bg-[color:var(--color-surface)] transition-all">
                                    <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.04-.48-3.21 0-1.44.6-2.2.46-3.06-.4C3.89 16.44 2.92 10.4 5.32 7.15c1.23-1.45 2.65-1.93 4.01-1.89 1.48.05 2.4.92 3.24.92.83 0 2.05-1.06 3.74-.89 1.44.15 2.53.7 3.2 1.69-3.24 1.88-2.71 6.18.52 7.46-.7 1.74-1.64 3.47-3.04 4.84H17.05zM12.03 5.07c-.15-1.87 1.34-3.63 3.14-3.82.25 2.22-2.15 4.09-3.14 3.82z"></path>
                                    </svg>
                                    Apple
                                </button>
                            </div>
                        </div>

                        <div className="text-center pt-8">
                            <p className="text-[color:var(--color-label)] font-medium">
                                New to SportsConnect?
                                <Link href="/register" className="text-[color:var(--color-text)] font-bold hover:text-primary transition-colors ml-1 underline decoration-primary/30 decoration-2 underline-offset-4">
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
