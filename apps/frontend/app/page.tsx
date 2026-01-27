'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function LandingPage() {
  const { auth, ready } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (ready) {
      setIsLoggedIn(!!auth.token);
    }
  }, [ready, auth.token]);

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] text-[color:var(--color-text)] font-display">
      <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-[color:var(--color-background)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 px-4 py-3 md:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight">SportDiscovery</h2>
            </Link>
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <Link href="/events" className="text-primary transition-colors">
                Discover
              </Link>
              <Link href="/events" className="hover:text-primary transition-colors">
                My Games
              </Link>
              <Link href="/events" className="hover:text-primary transition-colors">
                Groups
              </Link>
              <Link href="/events" className="hover:text-primary transition-colors">
                Venues
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end gap-4 md:gap-6 items-center">
            <label className="hidden md:flex min-w-40 max-w-64 flex-1">
              <div className="flex w-full items-stretch rounded-full">
                <div className="flex items-center justify-center rounded-l-full bg-[color:var(--color-surface)] px-4 text-[color:var(--color-muted)]">
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </div>
                <input
                  className="w-full min-w-0 flex-1 rounded-r-full border-none bg-[color:var(--color-surface)] px-4 text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-muted)] focus:outline-0"
                  placeholder="Search sports, venues..."
                />
              </div>
            </label>
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--color-surface)] text-[color:var(--color-text)] hover:bg-[color:var(--color-border)] transition-colors">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <Link
              href={isLoggedIn ? '/events' : '/login'}
              className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-[color:var(--color-on-primary)] transition-transform hover:scale-105"
            >
              {isLoggedIn ? 'Go to Events' : 'Login'}
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex h-[600px] items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(90deg, var(--color-background) 0%, rgba(0,0,0,0) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8mI1lWgW6fjkHctpPHOueHLPJujw3w5FNjmKmzfvqVhiAGBlLvxCO-rBkpGp12WcagN07UJ6dX6xXQp9-B72B9jvg09FMBLB5sCrkNC70raOo1o3OyNSp4H5m4y8NaPyvtaEhlBSFlEF0PpjQH5l_UCs2fiGTPNiWm4hS_p2zPEr3byA6zTal0MSE226NJhpn2P6A0efn4RMmoShaRIsB0XQcduKQdNmHGe5zrCF1trmd771pc1nne6t0-IUq9DA5oWPYKVepkHo")',
            }}
          ></div>
          <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 md:px-10">
            <div className="max-w-2xl flex flex-col gap-6">
              <div className="flex h-8 w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 backdrop-blur-sm">
                <span className="material-symbols-outlined text-[16px] text-primary filled-icon">bolt</span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">New: Shoreditch Leagues Open</p>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-[color:var(--color-heading)]">
                Find your <span className="text-primary">next game</span> in seconds
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-[color:var(--color-muted)]">
                Connect with local athletes, join community matches, and book top-tier venues across the city. The ultimate platform for sports discovery.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href={isLoggedIn ? '/events' : '/register'}
                  className="rounded-full bg-primary px-10 py-4 text-lg font-black tracking-tight text-[color:var(--color-on-primary)] shadow-[0_0_40px_rgba(13,242,13,0.3)] transition-all hover:shadow-[0_0_50px_rgba(13,242,13,0.5)] hover:scale-[1.02] active:scale-95"
                >
                  JOIN FOR FREE
                </Link>
                <Link
                  href="/events"
                  className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-10 py-4 text-lg font-bold text-[color:var(--color-text)] transition-all hover:bg-[color:var(--color-border)]"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-4 py-20 md:px-10">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-[color:var(--color-heading)]">Popular Sports</h2>
                <p className="text-[color:var(--color-muted)]">Whatever your game, find players to match your skill level.</p>
              </div>
              <Link href="/events" className="text-primary font-bold flex items-center gap-2 hover:underline">
                View All <span className="material-symbols-outlined">chevron_right</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {[
                { icon: 'sports_soccer', label: 'Soccer' },
                { icon: 'sports_basketball', label: 'Basketball' },
                { icon: 'sports_tennis', label: 'Tennis' },
                { icon: 'sports_volleyball', label: 'Volleyball' },
                { icon: 'fitness_center', label: 'Training' },
                { icon: 'hiking', label: 'Hiking' },
              ].map((sport) => (
                <div
                  key={sport.label}
                  className="group flex flex-col items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-8 text-center transition-all hover:border-primary hover:shadow-md"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-[color:var(--color-background)] text-primary transition-transform group-hover:scale-110">
                    <span className="material-symbols-outlined text-[32px] filled-icon">{sport.icon}</span>
                  </div>
                  <span className="font-bold text-[color:var(--color-text)]">{sport.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] rounded-t-[3rem] border-t border-[color:var(--color-border)] bg-[color:var(--color-panel)] px-4 py-20 md:px-10">
          <div className="flex flex-col gap-10">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-primary text-3xl">trending_up</span>
              <h2 className="text-3xl font-extrabold text-[color:var(--color-heading)]">Trending Events</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Friday Night 5-a-side',
                  latitude: 51.5246,
                  longitude: -0.0793,
                  time: '8:00 PM Tonight',
                  price: '$8.00',
                  tag: 'Soccer',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuB8mI1lWgW6fjkHctpPHOueHLPJujw3w5FNjmKmzfvqVhiAGBlLvxCO-rBkpGp12WcagN07UJ6dX6xXQp9-B72B9jvg09FMBLB5sCrkNC70raOo1o3OyNSp4H5m4y8NaPyvtaEhlBSFlEF0PpjQH5l_UCs2fiGTPNiWm4hS_p2zPEr3byA6zTal0MSE226NJhpn2P6A0efn4RMmoShaRIsB0XQcduKQdNmHGe5zrCF1trmd771pc1nne6t0-IUq9DA5oWPYKVepkHo',
                },
                {
                  title: 'Advanced Mixed Doubles',
                  latitude: 51.5313,
                  longitude: -0.1569,
                  time: '10:00 AM Sat',
                  price: 'FREE',
                  tag: 'Tennis',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuA6bWFFW39ZGlZle2_vW4tAOs0btQCC5DdfDuTlvMntgd6SjfGDPBtWz0JWd0RC5cWycj56o5gOF9z4L0xdfIKJcvV9hgzeJXDhJdVQExL3U4R9_ypc6l-lAQ6Cz6TWjaHAMdEhpIV-1DdYlSW0o6OHDxkszLPIt67RKdkp-3NSq-dpg26yc3bsSKsaHM2ETlwAsjZ_rQwF_BJ174Ekxek0AJvib9DTYyNV6kt7r3v_5aVeH4pAh7Nxc4iUKUo9K8RD7OL_sH2lrUE',
                },
                {
                  title: 'City Run Club',
                  latitude: 51.5074,
                  longitude: -0.1278,
                  time: '7:30 AM Daily',
                  price: 'FREE',
                  tag: 'Running',
                  image:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBr3lAO0HUsXPRoX3B7_gS-qxpmZ5oW_2j-V38dZpEnEksIctPKVzQ5-7TMhOt95yKwEMvHcxZF4TdWmoYDC3q2ZtUyCsoQYTkdo1EGHzQ4e5f4S4yfFD70uk_xQdWD18hYlMoOu7jczZpeGj80ZhWGGcXIVG19MyfaoqSCzbyXg--ECNpj2Wv91uHJ64JXlXAOFEVlQ76KDxADYm7iPdMxCy3qSaZZ9vT49Ie1aifGKBFkcc2jiejPgGJk5sTi-hgLiFUvkb5ANt0',
                },
              ].map((event) => (
                <div
                  key={event.title}
                  className="group overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-sm transition-all hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={event.image} alt={event.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[color:var(--color-on-primary)]">
                      {event.tag}
                    </div>
                    <div className="absolute bottom-4 left-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-background)] px-3 py-1 text-xs font-bold text-[color:var(--color-text)] backdrop-blur-md">
                      {event.time}
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <h3 className="text-xl font-bold text-[color:var(--color-heading)] transition-colors group-hover:text-primary">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {`${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`}
                    </div>
                    <div className="flex items-center justify-between border-t border-[color:var(--color-border)] pt-4">
                      <div className="flex -space-x-2">
                        <div
                          className="size-8 rounded-full border-2 border-[color:var(--color-surface)] bg-cover"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBr3lAO0HUsXPRoX3B7_gS-qxpmZ5oW_2j-V38dZpEnEksIctPKVzQ5-7TMhOt95yKwEMvHcxZF4TdWmoYDC3q2ZtUyCsoQYTkdo1EGHzQ4e5f4S4yfFD70uk_xQdWD18hYlMoOu7jczZpeGj80ZhWGGcXIVG19MyfaoqSCzbyXg--ECNpj2Wv91uHJ64JXlXAOFEVlQ76KDxADYm7iPdMxCy3qSaZZ9vT49Ie1aifGKBFkcc2jiejPgGJk5sTi-hgLiFUvkb5ANt0")',
                          }}
                        ></div>
                        <div
                          className="size-8 rounded-full border-2 border-[color:var(--color-surface)] bg-cover"
                          style={{
                            backgroundImage:
                              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBQ6aCmr28-mOrmlsbdXF5U-TkScMU6zdkFGDNTPajw79j3wiCMVKGGWQAgfHU-qeKeN182WOQv6zmw_c4gSlBm3woNeSfTAxieIWTjzYZ7Da7DS1bIuojlNh_Hi29lp8wScHRogYhDhdBkMfpAyVCya5jRmq0D-KRm8LnjAB16hb4EtAztbnN3RIwFkmZ_Cf9lGlTHOmWsgp5-M0-7qTzA0rIfP024VWHde6E5EBDfZCWxlq7AWLPiAVEihfPjEWTZJwhIpybu-5Y")',
                          }}
                        ></div>
                        <div className="size-8 rounded-full border-2 border-[color:var(--color-surface)] bg-[color:var(--color-background)] flex items-center justify-center text-[10px] font-bold text-[color:var(--color-muted)]">
                          +10
                        </div>
                      </div>
                      <span className="text-sm font-black text-primary">{event.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-background)] py-10">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <p className="text-sm font-medium text-[color:var(--color-muted)]">SportDiscovery © 2024 — Find your game.</p>
        </div>
      </footer>

    </div>
  );
}
