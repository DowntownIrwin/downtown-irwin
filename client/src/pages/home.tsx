import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { IBPA_INFO, CAR_CRUISE_INFO, PARTNERS } from "@/lib/constants";
import { usePageTitle } from "@/hooks/use-page-title";
import type { Event, Business } from "@shared/schema";
import {
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Car,
  Users,
  Store,
  Heart,
  ChevronRight,
} from "lucide-react";
import aerialPhoto from "@assets/72dpi_Photo_Oct_19_2024,_5_56_10_AM_Downsized_edited_1770661424918.jpg";

function HeroSection() {
  return (
    <section className="relative overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0">
        <img
          src={aerialPhoto}
          alt="Aerial view of Downtown Irwin, Pennsylvania"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 lg:py-44">
        <div className="max-w-2xl">
          <Badge variant="secondary" className="mb-4 bg-primary/20 text-white border-primary/30">
            Community Driven
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 font-serif leading-tight" data-testid="text-hero-title">
            Welcome to Downtown Irwin
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-4 font-medium italic">
            The biggest little town in Pennsylvania
          </p>
          <p className="text-base md:text-lg text-white/70 mb-8 leading-relaxed max-w-lg">
            The {IBPA_INFO.shortName} brings our community together through vibrant events, local businesses, and community spirit. Enjoy 15+ free events annually on historic Main Street.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/events">
              <Button size="lg" data-testid="button-explore-events">
                View Events
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20" data-testid="button-about-ibpa">
                Learn About IBPA
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CarCruiseBanner() {
  return (
    <section className="bg-card border-y" data-testid="section-car-cruise-banner">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/3 overflow-hidden rounded-md">
            <img
              src="/images/hero-carcruise.png"
              alt="Irwin Car Cruise"
              className="w-full h-48 object-cover"
            />
          </div>
          <div className="flex-1">
            <Badge variant="secondary" className="mb-2">Upcoming Event</Badge>
            <h2 className="text-2xl font-bold mb-2 font-serif" data-testid="text-cruise-title">
              {CAR_CRUISE_INFO.name}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {CAR_CRUISE_INFO.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> {CAR_CRUISE_INFO.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {CAR_CRUISE_INFO.location}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{CAR_CRUISE_INFO.description}</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/car-cruise/register">
                <Button data-testid="button-register-vehicle">
                  Register Your Vehicle
                </Button>
              </Link>
              <Link href="/car-cruise">
                <Button variant="outline" data-testid="button-learn-more-cruise">
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16" data-testid="section-stats">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Calendar, value: "15+", label: "Annual Events", color: "text-primary" },
          { icon: Users, value: "1,000+", label: "Annual Attendees", color: "text-accent" },
          { icon: Store, value: "50+", label: "Local Businesses", color: "text-chart-3" },
          { icon: Heart, value: "100%", label: "Volunteer Run", color: "text-chart-5" },
        ].map((stat) => (
          <Card key={stat.label} className="p-6 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
            <p className="text-2xl md:text-3xl font-bold mb-1" data-testid={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}>
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function UpcomingEventsSection() {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const featured = events?.filter((e) => e.featured).slice(0, 3) || [];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16" data-testid="section-upcoming-events">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif">Upcoming Events</h2>
          <p className="text-sm text-muted-foreground mt-1">Free community events for everyone</p>
        </div>
        <Link href="/events">
          <Button variant="outline" size="sm" data-testid="button-view-all-events">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
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
      ) : featured.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featured.map((event) => (
            <Card key={event.id} className="overflow-hidden hover-elevate" data-testid={`card-event-${event.id}`}>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <Badge variant="secondary" className="mb-2 text-xs">{event.category}</Badge>
                <h3 className="font-semibold mb-1">{event.title}</h3>
                <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {event.location}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Check back soon for upcoming events!</p>
        </Card>
      )}
    </section>
  );
}

function BusinessHighlights() {
  const { data: businesses, isLoading } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

  const highlighted = businesses?.slice(0, 4) || [];

  return (
    <section className="bg-card border-y" data-testid="section-businesses">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif">Explore Downtown</h2>
            <p className="text-sm text-muted-foreground mt-1">Discover local shops, restaurants, and services</p>
          </div>
          <Link href="/businesses">
            <Button variant="outline" size="sm" data-testid="button-view-directory">
              Full Directory
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-5 w-2/3 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ))}
          </div>
        ) : highlighted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlighted.map((biz) => (
              <Card key={biz.id} className="p-4 hover-elevate" data-testid={`card-business-${biz.id}`}>
                <Badge variant="secondary" className="mb-2 text-xs">{biz.category}</Badge>
                <h3 className="font-semibold text-sm mb-1">{biz.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{biz.description}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {biz.address}
                </p>
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16" data-testid="section-partners">
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">Community Partners</h2>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Working together to strengthen Downtown Irwin
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PARTNERS.map((partner) => (
          <Card key={partner.name} className="p-6 text-center">
            <Users className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold text-sm mb-1">{partner.name}</h3>
            <p className="text-xs text-muted-foreground">{partner.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  usePageTitle("Home", "Discover Downtown Irwin, Pennsylvania. Explore 15+ free community events, local businesses, and the annual car cruise.");
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CarCruiseBanner />
      <StatsSection />
      <UpcomingEventsSection />
      <BusinessHighlights />
      <PartnersSection />
    </div>
  );
}
