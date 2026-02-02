import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Car, MapPin, ArrowRight, ShoppingBag, Moon } from "lucide-react";
import { useEvents, useSiteConfig } from "@/hooks/useCMS";
import { groupEventsByStatus } from "@/lib/cms";
import { SEO } from "@/components/SEO";

function HeroSection() {
  const { data: siteConfig } = useSiteConfig();

  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {siteConfig?.hero_title || "Welcome to Downtown Irwin"}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
            {siteConfig?.hero_subtitle || 
              "The Irwin Business & Professional Association brings our community together through vibrant events, local businesses, and the famous Irwin Car Cruise."}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/events">
              <Button size="lg" variant="secondary" data-testid="button-view-events">
                View Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/car-cruise">
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-car-cruise">
                Irwin Car Cruise
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Calendar,
      title: "Community Events",
      description: "From seasonal festivals to weekly markets, there's always something happening in Downtown Irwin.",
      link: "/events",
      linkText: "See Events",
    },
    {
      icon: Car,
      title: "Irwin Car Cruise",
      description: "Our signature event featuring classic cars, live music, food vendors, and family fun.",
      link: "/car-cruise",
      linkText: "Learn More",
    },
    {
      icon: ShoppingBag,
      title: "Street Market",
      description: "Shop local vendors and artisans at our vibrant street market events.",
      link: "/street-market",
      linkText: "Explore",
    },
    {
      icon: Moon,
      title: "Night Market",
      description: "Experience Downtown Irwin after dark with unique evening shopping and entertainment.",
      link: "/night-market",
      linkText: "Discover",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Signature Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you're a resident, business owner, or visitor, there are many ways 
            to be part of the Downtown Irwin community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="hover-elevate">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                <Link href={feature.link}>
                  <span className="text-sm font-medium text-primary hover:underline cursor-pointer inline-flex items-center gap-1">
                    {feature.linkText}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function UpcomingEventsSection() {
  const { data: events } = useEvents();
  const grouped = events ? groupEventsByStatus(events) : { open: [], upcoming: [], closed: [] };
  
  const upcomingEvents = [...grouped.open, ...grouped.upcoming].slice(0, 3);

  if (upcomingEvents.length === 0) return null;

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Upcoming Events</h2>
          <Link href="/events">
            <Button variant="ghost" data-testid="button-view-all-events">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Link key={event.id} href={`/events/${event.slug}`}>
              <Card className="hover-elevate cursor-pointer h-full" data-testid={`card-event-${event.slug}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={event.status === "open" ? "default" : "secondary"}>
                      {event.status === "open" ? "Open" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="text-sm text-primary font-medium mb-2">{event.date}</div>
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolvedSection() {
  const items = [
    {
      icon: Users,
      title: "Become a Vendor",
      description: "Sell your products at our events",
      link: "/vendors",
    },
    {
      icon: MapPin,
      title: "Become a Sponsor",
      description: "Support community events",
      link: "/sponsors",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Involved</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Partner with Downtown Irwin to grow your business and support our community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {items.map((item) => (
            <Link key={item.title} href={item.link}>
              <Card className="hover-elevate cursor-pointer h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-lg p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join the Downtown Irwin Community
          </h2>
          <p className="opacity-90 mb-6 max-w-2xl mx-auto">
            Stay connected with upcoming events, vendor opportunities, and community news. 
            Contact us to learn how you can get involved!
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" data-testid="button-contact-us">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SEO 
        title="Home" 
        description="Downtown Irwin and the Irwin Business & Professional Association bring community together through events, the Irwin Car Cruise, Street Market, Night Market, and more."
        path="/"
      />
      <HeroSection />
      <FeaturesSection />
      <UpcomingEventsSection />
      <GetInvolvedSection />
      <CTASection />
    </>
  );
}
