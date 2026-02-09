import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CAR_CRUISE_INFO, SPONSORSHIP_LEVELS } from "@/lib/constants";
import type { Sponsor } from "@shared/schema";
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  ArrowRight,
  Trophy,
  Music,
  UtensilsCrossed,
  Users,
  CheckCircle2,
} from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

function CruiseHero() {
  return (
    <section className="relative overflow-hidden" data-testid="section-cruise-hero">
      <div className="absolute inset-0">
        <img
          src="/images/hero-carcruise.png"
          alt="Irwin Car Cruise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
        <Badge variant="secondary" className="mb-4 bg-primary/20 text-white border-primary/30">
          <Car className="w-3 h-3 mr-1" /> Spring 2026
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 font-serif" data-testid="text-cruise-title">
          {CAR_CRUISE_INFO.name}
        </h1>
        <p className="text-lg text-white/80 mb-2">{CAR_CRUISE_INFO.date}</p>
        <p className="text-base text-white/60 mb-8">{CAR_CRUISE_INFO.time} &middot; {CAR_CRUISE_INFO.location}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/car-cruise/register">
            <Button size="lg" data-testid="button-register-cta">
              Register Your Vehicle
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/sponsorship">
            <Button size="lg" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20" data-testid="button-sponsor-cta">
              Become a Sponsor
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function EventDetails() {
  const features = [
    { icon: Car, title: "Vehicle Display", desc: "Classic, custom, and modern vehicles along Main Street" },
    { icon: Trophy, title: "Awards & Trophies", desc: "Custom awards in multiple categories with sponsor recognition" },
    { icon: Music, title: "Live Music", desc: "Entertainment and music throughout the afternoon" },
    { icon: UtensilsCrossed, title: "Food & Vendors", desc: "Local food vendors and downtown restaurants" },
    { icon: Users, title: "Community Gathering", desc: "Thousands of enthusiasts and families welcome" },
    { icon: MapPin, title: "Downtown Location", desc: "Centered on Main Street in the heart of Irwin" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16" data-testid="section-event-details">
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">Event Highlights</h2>
      <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
        {CAR_CRUISE_INFO.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <Card key={f.title} className="p-6" data-testid={`card-feature-${f.title.toLowerCase().replace(/\s/g, "-")}`}>
            <f.icon className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function EventSchedule() {
  const schedule = [
    { time: "10:00 AM", event: "Vehicle Check-In Opens", desc: "Registered vehicles arrive for placement" },
    { time: "11:30 AM", event: "Final Setup", desc: "All vehicles should be in position" },
    { time: "12:00 PM", event: "Cruise Opens to Public", desc: "Main Street opens for viewing" },
    { time: "12:30 PM", event: "Live Music Begins", desc: "Entertainment throughout the afternoon" },
    { time: "2:00 PM", event: "Judging Begins", desc: "Awards committee reviews entries" },
    { time: "3:30 PM", event: "Awards Ceremony", desc: "Trophies presented to winners" },
    { time: "4:00 PM", event: "Event Concludes", desc: "Thank you for attending!" },
  ];

  return (
    <section className="bg-card border-y" data-testid="section-schedule">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">Event Schedule</h2>
        <p className="text-muted-foreground text-center mb-10">{CAR_CRUISE_INFO.date}</p>

        <div className="space-y-0">
          {schedule.map((item, i) => (
            <div key={i} className="flex gap-4 group" data-testid={`schedule-item-${i}`}>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary shrink-0 mt-1.5" />
                {i < schedule.length - 1 && <div className="w-px flex-1 bg-border" />}
              </div>
              <div className="pb-8">
                <p className="text-xs text-primary font-semibold mb-0.5">{item.time}</p>
                <h3 className="font-semibold text-sm">{item.event}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SponsorsPreview() {
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({
    queryKey: ["/api/sponsors"],
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-16" data-testid="section-sponsors-preview">
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">Our Sponsors</h2>
      <p className="text-muted-foreground text-center mb-8">
        Thank you to our generous sponsors for supporting the community.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : sponsors && sponsors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="p-6 text-center" data-testid={`card-sponsor-${sponsor.id}`}>
              <Badge variant="secondary" className="mb-2 text-xs">{sponsor.level}</Badge>
              <h3 className="font-semibold text-sm">{sponsor.name}</h3>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Sponsors will be announced soon!</p>
        </Card>
      )}

      <div className="text-center mt-8">
        <Link href="/sponsorship">
          <Button variant="outline" data-testid="button-become-sponsor">
            Become a Sponsor
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function RegistrationCTA() {
  return (
    <section className="bg-primary" data-testid="section-registration-cta">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Car className="w-10 h-10 text-primary-foreground mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground font-serif mb-3">
          Ready to Show Your Ride?
        </h2>
        <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
          Register your vehicle for the {CAR_CRUISE_INFO.name}. Free registration for all vehicle types.
        </p>
        <Link href="/car-cruise/register">
          <Button size="lg" variant="secondary" data-testid="button-register-now">
            Register Now
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default function CarCruise() {
  usePageTitle("Car Cruise 2026", "Downtown Irwin Car Cruise - Saturday, April 25, 2026. Register your vehicle and join the community.");
  return (
    <div className="min-h-screen">
      <CruiseHero />
      <EventDetails />
      <EventSchedule />
      <SponsorsPreview />
      <RegistrationCTA />
    </div>
  );
}
