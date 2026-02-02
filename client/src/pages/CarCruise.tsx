import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, Calendar, MapPin, Music, Utensils, Users, Crown, Award, Medal, Heart, ExternalLink, Loader2, Ticket } from "lucide-react";
import { Link } from "wouter";
import { useEventsByType, useSponsorLogos } from "@/hooks/useCMS";
import { getEventUrls } from "@/lib/content";
import type { SponsorLogosData } from "@shared/types";
import { SEO } from "@/components/SEO";

function SponsorSection({ sponsors }: { sponsors: SponsorLogosData }) {
  const allEmpty = 
    (sponsors.presenting?.length || 0) === 0 && 
    (sponsors.gold?.length || 0) === 0 && 
    (sponsors.silver?.length || 0) === 0 && 
    (sponsors.supporting?.length || 0) === 0;

  if (allEmpty) {
    return (
      <section className="py-12 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Sponsors</h2>
          <p className="text-muted-foreground">Sponsors to be announced soon...</p>
        </div>
      </section>
    );
  }

  const tiers = [
    { key: 'presenting' as const, label: 'Presenting Sponsors', icon: Crown, color: 'bg-amber-500', sponsors: sponsors.presenting || [] },
    { key: 'gold' as const, label: 'Gold Sponsors', icon: Award, color: 'bg-yellow-500', sponsors: sponsors.gold || [] },
    { key: 'silver' as const, label: 'Silver Sponsors', icon: Medal, color: 'bg-slate-400', sponsors: sponsors.silver || [] },
  ];

  return (
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Thank You to Our Sponsors</h2>
        
        {tiers.map((tier) => {
          if (tier.sponsors.length === 0) return null;
          const Icon = tier.icon;
          
          return (
            <div key={tier.key} className="mb-12 last:mb-0">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className={`w-8 h-8 rounded-full ${tier.color} flex items-center justify-center`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{tier.label}</h3>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {tier.sponsors.filter(s => s && s.name).map((sponsor, index) => (
                  <a
                    key={index}
                    href={sponsor.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    data-testid={`link-sponsor-${tier.key}-${index}`}
                  >
                    <Card className="hover-elevate p-4 min-w-[150px] text-center">
                      {sponsor.logo_url ? (
                        <img 
                          src={sponsor.logo_url} 
                          alt={sponsor.name}
                          className="h-16 w-auto mx-auto mb-2 object-contain"
                        />
                      ) : (
                        <div className="h-16 w-16 mx-auto mb-2 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-muted-foreground">
                            {sponsor.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                      <p className="text-sm font-medium">{sponsor.name}</p>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          );
        })}

        {(sponsors.supporting?.length || 0) > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Supporting Sponsors</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-muted-foreground">
              {(sponsors.supporting || []).map((name, index) => (
                <span key={index} className="text-sm">
                  {name}{index < (sponsors.supporting?.length || 0) - 1 ? " •" : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CarCruise() {
  const { data: carCruiseEvents, isLoading: eventsLoading } = useEventsByType("car-cruise");
  const { data: sponsors, isLoading: sponsorsLoading } = useSponsorLogos();
  
  const event = carCruiseEvents?.[0];
  const isLoading = eventsLoading || sponsorsLoading;

  const statusLabels = {
    open: "Registration Open",
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
        title="Irwin Car Cruise" 
        description="Join us for the biggest car cruise in the region! Classic cars, live music, delicious food, and family fun in the heart of Downtown Irwin."
        path="/car-cruise"
      />
      <section className="relative bg-primary text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">Annual Event</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Irwin Car Cruise
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Join us for the biggest car cruise in the region! Classic cars, live music, 
              delicious food, and family fun in the heart of Downtown Irwin.
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
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>Coming Summer 2026</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Main Street, Irwin PA</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Classic Cars</h3>
                <p className="text-sm text-muted-foreground">
                  Hundreds of classic, vintage, and custom cars on display throughout Main Street.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Music className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Live Music</h3>
                <p className="text-sm text-muted-foreground">
                  Local bands and DJs playing hits from every era throughout the event.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Food Vendors</h3>
                <p className="text-sm text-muted-foreground">
                  Local restaurants and food trucks serving up delicious eats for everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Family Fun</h3>
                <p className="text-sm text-muted-foreground">
                  Activities for all ages including games, contests, and giveaways.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 border-t border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Sponsorship Tiers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-2">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Presenting</h3>
              <p className="text-lg font-bold text-primary">$2,500</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-2">
                <Award className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Gold</h3>
              <p className="text-lg font-bold text-primary">$1,500</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="w-10 h-10 rounded-full bg-slate-400 flex items-center justify-center mx-auto mb-2">
                <Medal className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Silver</h3>
              <p className="text-lg font-bold text-primary">$750</p>
            </div>
            <div className="text-center p-4 bg-card rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mx-auto mb-2">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Supporting</h3>
              <p className="text-lg font-bold text-primary">$250</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/sponsors">
              <Button data-testid="button-view-sponsor-details">
                View Sponsor Benefits
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <SponsorSection sponsors={sponsors || { presenting: [], gold: [], silver: [], supporting: [] }} />
      )}

      {event && (
        <section className="py-12 border-t">
          <div className="container mx-auto px-4">
            <Card className="bg-accent">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Get Involved</h2>
                    <p className="text-muted-foreground">
                      Register your vehicle, become a vendor, or sponsor the event!
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(() => {
                      const urls = getEventUrls(event);
                      return (
                        <>
                          {urls.attendeeUrl && (
                            <a href={urls.attendeeUrl} target="_blank" rel="noopener noreferrer">
                              <Button data-testid="button-register-vehicle">
                                <Ticket className="h-4 w-4 mr-2" />
                                Register Vehicle
                              </Button>
                            </a>
                          )}
                          {urls.vendorUrl && (
                            <a href={urls.vendorUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" data-testid="button-vendor-signup">
                                <Users className="h-4 w-4 mr-2" />
                                Vendor Signup
                              </Button>
                            </a>
                          )}
                          {urls.sponsorUrl && (
                            <a href={urls.sponsorUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" data-testid="button-sponsor-event">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Sponsor
                              </Button>
                            </a>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {!event && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Register Your Vehicle
                </h2>
                <p className="opacity-90 mb-6 max-w-2xl mx-auto">
                  Want to show off your classic car at the Irwin Car Cruise? 
                  Registration will open in Spring 2026. Contact us to get notified!
                </p>
                <Link href="/contact">
                  <Button size="lg" variant="secondary" data-testid="button-get-notified">
                    Get Notified
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}
