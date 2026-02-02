import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Loader2, Users, ExternalLink, Ticket, ArrowLeft, Info } from "lucide-react";
import { Link, useParams } from "wouter";
import { useEvents } from "@/hooks/useCMS";
import { findEventBySlug } from "@/lib/cms";
import { SEO } from "@/components/SEO";

export default function EventDetail() {
  const params = useParams<{ slug: string }>();
  const { data: events, isLoading } = useEvents();
  
  const event = events ? findEventBySlug(events, params.slug || "") : undefined;

  const statusColors = {
    open: "bg-green-500",
    upcoming: "bg-blue-500",
    closed: "bg-gray-500",
  };

  const statusLabels = {
    open: "Open for Registration",
    upcoming: "Coming Soon",
    closed: "Event Ended",
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The event you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/events">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title={event.title} 
        description={event.description}
        path={`/events/${event.slug}`}
      />
      <div className="container mx-auto px-4">
        <Link href="/events">
          <Button variant="ghost" className="mb-6" data-testid="button-back-events">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {event.image_url && (
              <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-6">
                <img 
                  src={event.image_url} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <Badge className={statusColors[event.status]}>
                {statusLabels[event.status]}
              </Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="prose max-w-none text-muted-foreground mb-8">
              <p>{event.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{event.date}</p>
                    </div>
                  </div>

                  {event.time && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{event.time}</p>
                      </div>
                    </div>
                  )}

                  {event.location && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {event.vendor_cap !== undefined && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Vendor Capacity</p>
                        <p className="font-medium">
                          {event.vendor_count || 0} / {event.vendor_cap} spots filled
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  {event.vendor_signup_url && (
                    <a href={event.vendor_signup_url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full" variant="outline" data-testid="button-vendor-signup">
                        <Users className="h-4 w-4 mr-2" />
                        Vendor Signup
                      </Button>
                    </a>
                  )}
                  
                  {event.sponsor_url && (
                    <a href={event.sponsor_url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full" variant="outline" data-testid="button-sponsor-event">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Sponsor This Event
                      </Button>
                    </a>
                  )}
                  
                  {event.register_url && (
                    <a href={event.register_url} target="_blank" rel="noopener noreferrer" className="block">
                      <Button className="w-full" data-testid="button-register-event">
                        <Ticket className="h-4 w-4 mr-2" />
                        Attend / Register
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
