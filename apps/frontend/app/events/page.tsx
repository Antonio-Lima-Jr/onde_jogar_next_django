import TopNav from '../components/ui/TopNav';
import { fetchEventCategories, fetchEvents } from '@/lib/api';
import type { Event, EventCategory } from '@/types/event';
import EventsListClient from './components/EventsListClient';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
    const [eventsResponse, categories]: [Awaited<ReturnType<typeof fetchEvents>>, EventCategory[]] = await Promise.all([
        fetchEvents({ limit: 10, offset: 0 }),
        fetchEventCategories(),
    ]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <TopNav />
            <EventsListClient events={eventsResponse.results} categories={categories} totalCount={eventsResponse.count} />
        </div>
    );
}
