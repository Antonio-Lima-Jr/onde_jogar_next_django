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
                token: data.token,
                userId: data.user.id,
                email: data.user.email,
                username: data.user.username,
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
        <div className="flex min-h-screen items-center justify-center bg-[color:var(--color-background)] p-4 font-display">
            <div className="w-full max-w-md bg-[color:var(--color-surface)] p-10 rounded-[2rem] border border-[color:var(--color-border)] shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="text-center mb-10 relative">
                    <Link href="/" className="inline-block group">
                        <div className="size-12 bg-primary rounded-full flex items-center justify-center text-[color:var(--color-on-primary)] mx-auto mb-6 shadow-[0_0_20px_rgba(13,242,13,0.4)] group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black text-2xl">exercise</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-[color:var(--color-text)] mb-2 tracking-tight">Join the Game</h1>
                    <p className="text-[color:var(--color-muted)] font-medium">Create an account to start playing</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg whitespace-nowrap">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[color:var(--color-muted)] mb-3 ml-1">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[color:var(--color-muted)] group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full bg-[color:var(--color-input-bg)] border border-[color:var(--color-input-border)] rounded-2xl pl-12 pr-4 py-4 text-[color:var(--color-input-text)] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[color:var(--color-input-placeholder)]"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[color:var(--color-muted)] mb-3 ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[color:var(--color-muted)] group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">mail</span>
                            </div>
                            <input
                                type="email"
                                required
                                className="w-full bg-[color:var(--color-input-bg)] border border-[color:var(--color-input-border)] rounded-2xl pl-12 pr-4 py-4 text-[color:var(--color-input-text)] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[color:var(--color-input-placeholder)]"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-[color:var(--color-muted)] mb-3 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[color:var(--color-muted)] group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-[color:var(--color-input-bg)] border border-[color:var(--color-input-border)] rounded-2xl pl-12 pr-4 py-4 text-[color:var(--color-input-text)] focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[color:var(--color-input-placeholder)]"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-[color:var(--color-on-primary)] font-black py-5 rounded-full shadow-[0_0_30px_rgba(13,242,13,0.3)] hover:shadow-[0_0_40px_rgba(13,242,13,0.5)] transition-all disabled:opacity-50 transform active:scale-[0.98] mt-6"
                    >
                        {loading ? 'CREATING ACCOUNT...' : 'GET STARTED'}
                    </button>
                </form>

                <p className="text-center mt-10 text-[color:var(--color-muted)] text-sm font-medium relative">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-bold hover:underline ml-1">Login</Link>
                </p>
            </div>
        </div>
    );
}
