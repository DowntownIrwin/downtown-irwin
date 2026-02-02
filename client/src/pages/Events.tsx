import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Event } from "@shared/types";
import { EXTERNAL_URLS } from "@shared/types";
import { SEO } from "@/components/SEO";

async function parseGoogleSheetsData(text: string): Promise<Event[]> {
  try {
    const jsonString = text.replace(/^[^(]+\(/, '').replace(/\);?$/, '');
    const data = JSON.parse(jsonString);
    const rows = data.table.rows;
    
    return rows.slice(1).map((row: { c: Array<{ v: string } | null> }, index: number) => ({
      id: String(index + 1),
      title: row.c[0]?.v || '',
      date: row.c[1]?.v || '',
      time: row.c[2]?.v || undefined,
      location: row.c[3]?.v || undefined,
      description: row.c[4]?.v || '',
      imageUrl: row.c[5]?.v || undefined,
      featured: row.c[6]?.v === 'TRUE' || row.c[6]?.v === 'true',
    })).filter((e: Event) => e.title);
  } catch (error) {
    console.error('Error parsing Google Sheets data:', error);
    return [];
  }
}

async function fetchFromGoogleSheets(): Promise<Event[]> {
  const response = await fetch(EXTERNAL_URLS.eventsGoogleSheetJson);
  if (!response.ok) throw new Error('Failed to fetch from Google Sheets');
  const text = await response.text();
  return parseGoogleSheetsData(text);
}

async function fetchFromAPI(): Promise<Event[]> {
  const response = await fetch('/api/events');
  if (!response.ok) throw new Error('Failed to fetch from API');
  return response.json();
}

async function fetchEvents(): Promise<Event[]> {
  try {
    const events = await fetchFromGoogleSheets();
    if (events.length > 0) {
      return events;
    }
  } catch (error) {
    console.log('Google Sheets fetch failed, using API fallback:', error);
  }
  
  try {
    return await fetchFromAPI();
  } catch (error) {
    console.error('API fallback also failed:', error);
    return [];
  }
}

function EventCard({ event }: { event: Event }) {
  return (
    <Card className="hover-elevate overflow-hidden" data-testid={`card-event-${event.id}`}>
      {event.imageUrl && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {event.featured && (
            <Badge variant="default" className="text-xs">Featured</Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{event.date}</span>
          </div>
          {event.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{event.time}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Events() {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Community Events" 
        description="Discover what's happening in Downtown Irwin. From the Irwin Car Cruise to seasonal festivals and weekly markets, there's always something to enjoy in our community."
        path="/events"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Community Events</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what's happening in Downtown Irwin. From seasonal festivals to 
            weekly markets, there's always something to enjoy in our community.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error || !events?.length ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              Check back soon for upcoming community events!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
