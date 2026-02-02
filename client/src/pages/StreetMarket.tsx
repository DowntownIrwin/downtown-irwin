import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ShoppingBag, Users, Utensils, Music, Loader2, ExternalLink, Ticket } from "lucide-react";
import { Link } from "wouter";
import { useEventsByType } from "@/hooks/useCMS";
import { SEO } from "@/components/SEO";

export default function StreetMarket() {
  const { data: streetMarketEvents, isLoading } = useEventsByType("street-market");
  const event = streetMarketEvents?.[0];

  const statusLabels = {
    open: "Open for Vendors",
    upcoming: "Coming Soon",
    closed: "Event Ended",
  };

  const displayDate = event ? new Date(event.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }) : null;

  return (
    <div>
      <SEO 
        title="Irwin Street Market" 
        description="Shop local vendors, enjoy live music, and discover unique finds at the Irwin Street Market in Downtown Irwin."
        path="/street-market"
      />
      
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Community Event</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Irwin Street Market
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Shop local vendors, enjoy live music, and discover unique finds at our 
              vibrant street market in the heart of Downtown Irwin.
            </p>
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : event ? (
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{displayDate}</span>
                </div>
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
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Find</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Local Vendors</h3>
                <p className="text-sm text-muted-foreground">
                  Handmade crafts, artisan goods, and unique treasures from local makers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Food & Drinks</h3>
                <p className="text-sm text-muted-foreground">
                  Local restaurants and food trucks serving up delicious treats.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Live Entertainment</h3>
                <p className="text-sm text-muted-foreground">
                  Local musicians and performers adding to the festive atmosphere.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Community Fun</h3>
                <p className="text-sm text-muted-foreground">
                  Family-friendly activities and a great way to connect with neighbors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {event && (
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <Card className="bg-accent">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Join Us at the Market</h2>
                    <p className="text-muted-foreground">
                      Whether you're shopping or selling, we'd love to see you there!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {event.vendorUrl && (
                      <a href={event.vendorUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" data-testid="button-vendor-signup">
                          <Users className="h-4 w-4 mr-2" />
                          Become a Vendor
                        </Button>
                      </a>
                    )}
                    {event.sponsorUrl && (
                      <a href={event.sponsorUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" data-testid="button-sponsor">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Sponsor
                        </Button>
                      </a>
                    )}
                    {event.attendeeUrl && (
                      <a href={event.attendeeUrl} target="_blank" rel="noopener noreferrer">
                        <Button data-testid="button-register">
                          <Ticket className="h-4 w-4 mr-2" />
                          Register
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
          <h2 className="text-2xl font-bold mb-4">Interested in Becoming a Vendor?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We welcome local artisans, crafters, and small businesses. Visit our Vendors page 
            for more information and to sign up.
          </p>
          <Link href="/vendors">
            <Button size="lg" data-testid="button-learn-vending">
              Learn About Vending
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
