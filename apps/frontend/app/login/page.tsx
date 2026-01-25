'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import Link from 'next/link';

export default function LoginPage() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(formData);
            localStorage.setItem('token', data.token);
            localStorage.setItem('user_id', data.user_id.toString());
            localStorage.setItem('user_email', data.email);

            router.push('/events');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background-dark p-4 font-display">
            <div className="w-full max-w-md bg-surface-dark p-10 rounded-[2rem] border border-border-dark shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl"></div>

                <div className="text-center mb-10 relative">
                    <Link href="/" className="inline-block group">
                        <div className="size-12 bg-primary rounded-full flex items-center justify-center text-background-dark mx-auto mb-6 shadow-[0_0_20px_rgba(13,242,13,0.4)] group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined font-black text-2xl">exercise</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-400 font-medium">Login to start playing</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl text-sm mb-8 flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg whitespace-nowrap">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Username</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">person</span>
                            </div>
                            <input
                                type="text"
                                required
                                className="w-full bg-background-dark border border-border-dark rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                            <input
                                type="password"
                                required
                                className="w-full bg-background-dark border border-border-dark rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-700"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-black font-black py-5 rounded-full shadow-[0_0_30px_rgba(13,242,13,0.3)] hover:shadow-[0_0_40px_rgba(13,242,13,0.5)] transition-all disabled:opacity-50 transform active:scale-[0.98] mt-4"
                    >
                        {loading ? 'LOGGING IN...' : 'LOGIN TO ACCOUNT'}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 text-sm font-medium relative">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-primary font-bold hover:underline ml-1">Register now</Link>
                </p>
            </div>
        </div>
    );
}
