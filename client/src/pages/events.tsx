import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import type { Event } from "@shared/schema";
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

const categories = ["All", "Festival", "Shopping", "Holiday", "Car Show", "Community"];

export default function Events() {
  usePageTitle("Community Events", "15+ free community events annually in Downtown Irwin including Ladies Night, Light Up Night, and more.");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const filtered = activeCategory === "All"
    ? events
    : events?.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <Badge variant="secondary" className="mb-3">
            <Sparkles className="w-3 h-3 mr-1" /> 15+ Annual Events
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2" data-testid="text-events-title">
            Community Events
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Downtown Irwin hosts free community events year-round, open to everyone.
            From holiday celebrations to car shows, there's always something happening on Main Street.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-1" data-testid="tabs-event-categories">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} data-testid={`tab-${cat.toLowerCase()}`}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => (
              <Card key={event.id} className="overflow-hidden hover-elevate" data-testid={`card-event-${event.id}`}>
                {event.imageUrl && (
                  <div className="relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    {event.featured && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <Badge variant="secondary" className="mb-3 text-xs">{event.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-event-title-${event.id}`}>
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" /> {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" /> {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" /> {event.location}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No Events Found</h3>
            <p className="text-sm text-muted-foreground">
              {activeCategory === "All"
                ? "Check back soon for upcoming events!"
                : `No ${activeCategory} events scheduled at the moment.`}
            </p>
            {activeCategory !== "All" && (
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveCategory("All")} data-testid="button-show-all-events">
                Show All Events
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
