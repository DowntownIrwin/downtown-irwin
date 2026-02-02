import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Moon, Users, Utensils, Sparkles, Loader2, ExternalLink, Ticket } from "lucide-react";
import { Link } from "wouter";
import { useEvents } from "@/hooks/useCMS";
import { findNightMarketEvent } from "@/lib/cms";
import { SEO } from "@/components/SEO";

export default function NightMarket() {
  const { data: events, isLoading } = useEvents();
  const event = events ? findNightMarketEvent(events) : undefined;

  const statusLabels = {
    open: "Open for Vendors",
    upcoming: "Coming Soon",
    closed: "Event Ended",
  };

  return (
    <div>
      <SEO 
        title="Irwin Night Market" 
        description="Experience the magic of Downtown Irwin after dark. Shop, dine, and enjoy live entertainment at our atmospheric night market."
        path="/night-market"
      />
      
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/30" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Moon className="h-3 w-3 mr-1" />
              After Dark Event
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Irwin Night Market
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Experience the magic of Downtown Irwin after dark. Shop, dine, and enjoy 
              live entertainment at our atmospheric evening market.
            </p>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : event ? (
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{event.date}</span>
                </div>
                {event.time && (
                  <div className="flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>{event.location}</span>
                  </div>
                )}
                <Badge variant="secondary">{statusLabels[event.status]}</Badge>
              </div>
            ) : (
              <p className="text-sm opacity-75">Date to be announced</p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Night Market Experience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Moon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Evening Atmosphere</h3>
                <p className="text-sm text-muted-foreground">
                  String lights, lanterns, and a magical ambiance as the sun sets.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Night Bites</h3>
                <p className="text-sm text-muted-foreground">
                  Food vendors and local restaurants serving evening favorites.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Artisan Vendors</h3>
                <p className="text-sm text-muted-foreground">
                  Unique handmade goods and crafts from local artisans.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Live Entertainment</h3>
                <p className="text-sm text-muted-foreground">
                  Musicians and performers creating an unforgettable evening.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {event && (
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <Card className="bg-slate-900 text-white">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Join the Night Market</h2>
                    <p className="opacity-90">
                      Become a vendor or sponsor this unique evening event!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {event.vendor_signup_url && (
                      <a href={event.vendor_signup_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" data-testid="button-vendor-signup">
                          <Users className="h-4 w-4 mr-2" />
                          Become a Vendor
                        </Button>
                      </a>
                    )}
                    {event.sponsor_url && (
                      <a href={event.sponsor_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-sponsor">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Sponsor
                        </Button>
                      </a>
                    )}
                    {event.register_url && (
                      <a href={event.register_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" data-testid="button-register">
                          <Ticket className="h-4 w-4 mr-2" />
                          RSVP
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Be a Vendor?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            The Night Market welcomes artisans, food vendors, and local businesses. 
            Visit our Vendors page to learn more.
          </p>
          <Link href="/vendors">
            <Button size="lg" data-testid="button-learn-vending">
              Vendor Information
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
