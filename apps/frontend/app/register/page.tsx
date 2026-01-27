'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setAuth } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await register(formData);
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
                        className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-80"
                        style={{
                            backgroundImage:
                                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAgY03tXvamvINBQehvaxZJnXosIVGQ2-pDuNwzfARQho4aveJsur0M7h8AhIPiIJGa6w9PoUJ89sqAD1QejYIHq5AY9NrURtysFbfJchESX0K7jv5N77fs0nwWIQAGFicIUvuk78wbh-4nGo-SbDRkRqAeCpC3dXeiY0VEDw6GergCzhGH-QoXX5pBOV3KX3KRJVhuFYDgsGoksCdNwI3YGbUOquh_SA71nAnVU1zvOpO4Lb1PhSOgCwV9wffveWfo-49oAilvDtg")',
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
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
                                Connect. Compete. Conquer.
                            </h1>
                            <p className="text-white/80 text-lg font-light leading-relaxed">
                                Join the fastest growing sports community. Find local pickup games, professional leagues, and athletes in your area.
                            </p>
                            <div className="mt-10 flex gap-4 items-center">
                                <div className="flex -space-x-3">
                                    <div className="size-11 rounded-full border-4 border-black/70 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBa5P2YJtrqiRuRFKKQytF6JwJYFCvEGtuL2NEPQR0YGLs8jIGOfiDCdxmedx5QMaApZVJJagpgLaAznqWD4vKPba_cs9u3kD2VWYtF9lHmAjjgVEhTmiKQfF0ZwyBTN_eOZYmSncfYLE_xkKOFmqNCH0-JdBFVnddMEXx9k5FwEFZkXZpKulS92hAC0elUIQhzeijVOm_N4i-Y_jC3obdF04hZ96Q6fgMX-xA03diUIY0g65ZmQWm0u6iw3YLitgu4Apo5fM5f3To')" }}></div>
                                    <div className="size-11 rounded-full border-4 border-black/70 bg-gray-400"></div>
                                    <div className="size-11 rounded-full border-4 border-black/70 bg-gray-300"></div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-white font-bold text-sm">10,000+ Athletes</span>
                                    <span className="text-white/60 text-xs">Ready to play near you</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col px-6 py-10 md:px-20 lg:px-24 justify-center relative">
                    <Link href="/" className="lg:hidden flex items-center gap-2 text-primary mb-12">
                        <div className="size-8">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-[color:var(--color-text)] text-xl font-bold">SportsConnect</h2>
                    </Link>

                    <div className="max-w-md w-full mx-auto">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-4xl font-extrabold text-[color:var(--color-text)] mb-3">Create Account</h2>
                            <p className="text-[color:var(--color-muted)] font-medium">Join our community and start your journey today.</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-6 flex items-center gap-3">
                                <span className="material-symbols-outlined text-lg whitespace-nowrap">error</span>
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 border border-[color:var(--color-panel-border)] rounded-2xl text-[color:var(--color-text)] font-semibold hover:bg-[color:var(--color-surface)] transition-all active:scale-[0.98]"
                            >
                                <svg className="size-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 border border-[color:var(--color-panel-border)] rounded-2xl text-[color:var(--color-text)] font-semibold hover:bg-[color:var(--color-surface)] transition-all active:scale-[0.98]"
                            >
                                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.05 20.28c-.96.95-2.45 2.1-4.05 2.1-1.54 0-2.02-.95-4.04-.95-2.02 0-2.58.93-4.04.95-1.6 0-3.32-1.45-4.32-2.88C-.5 16.55-1.5 11.2 1 7.55c1.25-1.85 3.15-3 5.06-3 1.54 0 2.65 1.02 4.02 1.02 1.34 0 2.22-1.02 4.02-1.02 1.6 0 3 .85 4.04 2.22-3.4 1.84-2.85 6.35.45 7.64-.84 2.16-2.54 4.87-4.04 6.37zM12.04 4.54c-.1-.95.38-1.9 1.14-2.73.9-.98 2.22-1.58 3.36-1.58.12 1.04-.4 2.05-1.06 2.76-.84.92-2.22 1.6-3.44 1.55z"></path>
                                </svg>
                                Apple
                            </button>
                        </div>

                        <div className="relative flex items-center mb-6">
                            <div className="flex-grow border-t border-[color:var(--color-panel-border)]"></div>
                            <span className="mx-4 text-[color:var(--color-label)] text-xs font-bold uppercase tracking-widest">
                                or register with email
                            </span>
                            <div className="flex-grow border-t border-[color:var(--color-panel-border)]"></div>
                        </div>

                        <div className="bg-[color:var(--color-panel)] p-2 rounded-3xl border border-[color:var(--color-panel-border)]">
                            <form onSubmit={handleSubmit} className="space-y-5 p-2">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[color:var(--color-label)] uppercase tracking-widest ml-1">Username</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] rounded-xl px-4 py-3.5 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)] text-sm"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[color:var(--color-label)] uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] rounded-xl px-4 py-3.5 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)] text-sm"
                                        placeholder="alex@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-[color:var(--color-label)] uppercase tracking-widest ml-1">Create Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full bg-[color:var(--color-input-bg)] border-[color:var(--color-input-border)] rounded-xl px-4 py-3.5 text-[color:var(--color-input-text)] focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-[color:var(--color-input-placeholder)] text-sm"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-start gap-3 py-1">
                                    <input className="mt-1 size-4 rounded border-[color:var(--color-panel-border)] text-primary focus:ring-primary/20" id="terms" type="checkbox" />
                                    <label className="text-sm font-medium text-[color:var(--color-muted)] leading-relaxed" htmlFor="terms">
                                        I agree to the{' '}
                                        <span className="text-[color:var(--color-text)] font-bold underline decoration-primary decoration-2 underline-offset-4">Terms &amp; Conditions</span>{' '}
                                        and{' '}
                                        <span className="text-[color:var(--color-text)] font-bold underline decoration-primary decoration-2 underline-offset-4">Privacy Policy</span>.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary hover:brightness-105 active:scale-[0.98] text-[color:var(--color-on-primary)] font-black py-4 rounded-2xl text-base transition-all shadow-xl shadow-primary/20 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? 'CREATING ACCOUNT...' : 'Create Account'}
                                    <span className="material-symbols-outlined font-bold">arrow_forward</span>
                                </button>
                            </form>
                        </div>

                        <div className="mt-8 pt-8 border-t border-[color:var(--color-panel-border)] text-center">
                            <p className="text-[color:var(--color-label)] font-medium">
                                Already have an account?
                                <Link href="/login" className="text-[color:var(--color-text)] font-bold hover:text-primary transition-colors ml-1">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
