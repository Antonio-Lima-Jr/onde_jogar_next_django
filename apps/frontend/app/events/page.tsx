import TopNav from '../components/ui/TopNav';
import { fetchEventCategories, fetchEvents } from '@/lib/api';
import type { Event, EventCategory } from '@/types/event';
import EventsListClient from './components/EventsListClient';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    const [events, categories]: [Event[], EventCategory[]] = await Promise.all([
        fetchEvents(),
        fetchEventCategories(),
    ]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <EventsListClient events={events} categories={categories} />
        </div>
    );
}
