import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Car, MapPin, ArrowRight, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { AdminData } from "@shared/types";
import { SEO } from "@/components/SEO";

function HeroSection() {
  return (
    <section className="relative bg-primary text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      <div className="relative container mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Welcome to<br />Downtown Irwin
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl">
            The Irwin Business & Professional Association brings our community together 
            through vibrant events, local businesses, and the famous Irwin Car Cruise.
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

function AnnouncementBanner() {
  const { data } = useQuery<AdminData>({
    queryKey: ['/api/admin/data'],
  });

  const activeAnnouncements = data?.announcements?.filter(a => a.active) || [];

  if (activeAnnouncements.length === 0) return null;

  return (
    <section className="bg-accent border-b">
      <div className="container mx-auto px-4 py-4">
        {activeAnnouncements.map((announcement) => (
          <div key={announcement.id} className="flex items-start gap-3">
            <Megaphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">{announcement.title}:</span>{" "}
              <span className="text-muted-foreground">{announcement.content}</span>
            </div>
          </div>
        ))}
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
      icon: Users,
      title: "Local Businesses",
      description: "Support our community of shops, restaurants, and services that make Irwin special.",
      link: "/vendors",
      linkText: "Become a Vendor",
    },
    {
      icon: MapPin,
      title: "Sponsor Opportunities",
      description: "Partner with us to support community events and grow your brand visibility.",
      link: "/sponsors",
      linkText: "Sponsor Now",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Involved</h2>
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

function FeaturedEventsSection() {
  const { data } = useQuery<AdminData>({
    queryKey: ['/api/admin/data'],
  });

  const featuredEvents = data?.featuredEvents || [];

  if (featuredEvents.length === 0) return null;

  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
          <Link href="/events">
            <Button variant="ghost" data-testid="button-view-all-events">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.slice(0, 3).map((event) => (
            <Card key={event.id} className="hover-elevate">
              <CardContent className="p-6">
                <div className="text-sm text-primary font-medium mb-2">{event.date}</div>
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
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
        description="Downtown Irwin and the Irwin Business & Professional Association bring community together through events, the Irwin Car Cruise, local vendors, and sponsors."
        path="/"
      />
      <HeroSection />
      <AnnouncementBanner />
      <FeaturesSection />
      <FeaturedEventsSection />
      <CTASection />
    </>
  );
}
