import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, Clock, Loader2, Users, ExternalLink, Ticket, Search } from "lucide-react";
import { Link } from "wouter";
import { useEvents } from "@/hooks/useCMS";
import { groupEventsByStatus, type CMSEvent } from "@/lib/content";
import { SEO } from "@/components/SEO";

function EventCard({ event }: { event: CMSEvent }) {
  const statusColors = {
    open: "bg-green-500",
    upcoming: "bg-blue-500",
    closed: "bg-gray-500",
  };

  const statusLabels = {
    open: "Open",
    upcoming: "Upcoming",
    closed: "Closed",
  };

  const displayDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="hover-elevate overflow-hidden" data-testid={`card-event-${event.slug}`}>
      {event.heroImage && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img 
            src={event.heroImage} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={statusColors[event.status]}>
            {statusLabels[event.status]}
          </Badge>
          {event.featured && <Badge variant="outline">Featured</Badge>}
        </div>
        
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
            {event.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{displayDate}</span>
          </div>
          {event.timeText && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{event.timeText}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {event.vendorUrl && (
            <a href={event.vendorUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" data-testid={`button-vendor-${event.slug}`}>
                <Users className="h-4 w-4 mr-1" />
                Vendor Signup
              </Button>
            </a>
          )}
          {event.sponsorUrl && (
            <a href={event.sponsorUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" data-testid={`button-sponsor-${event.slug}`}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Sponsor
              </Button>
            </a>
          )}
          {event.attendeeUrl && (
            <a href={event.attendeeUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" data-testid={`button-register-${event.slug}`}>
                <Ticket className="h-4 w-4 mr-1" />
                Register
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EventSection({ title, events }: { 
  title: string; 
  events: CMSEvent[]; 
}) {
  if (events.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </section>
  );
}

export default function Events() {
  const { data: events, isLoading, error } = useEvents();
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    if (!searchQuery.trim()) return events;
    
    const query = searchQuery.toLowerCase();
    return events.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.location?.toLowerCase().includes(query) ||
      event.startDate?.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);
  
  const grouped = groupEventsByStatus();
  const filteredGrouped = {
    open: filteredEvents.filter(e => e.status === "open"),
    upcoming: filteredEvents.filter(e => e.status === "upcoming"),
    closed: filteredEvents.filter(e => e.status === "closed"),
  };
  const hasEvents = events && events.length > 0;
  const hasResults = filteredEvents.length > 0;

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

        {!isLoading && hasEvents && (
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-events"
              />
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error || !hasEvents ? (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-muted-foreground">
              Check back soon for upcoming community events!
            </p>
          </div>
        ) : !hasResults ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Matching Events</h3>
            <p className="text-muted-foreground">
              No events match "{searchQuery}". Try a different search term.
            </p>
          </div>
        ) : (
          <>
            <EventSection 
              title="Open for Registration" 
              events={filteredGrouped.open}
            />
            <EventSection 
              title="Upcoming Events" 
              events={filteredGrouped.upcoming}
            />
            <EventSection 
              title="Past Events" 
              events={filteredGrouped.closed}
            />
          </>
        )}
      </div>
    </div>
  );
}
