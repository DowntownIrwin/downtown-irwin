import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageTitle } from "@/hooks/use-page-title";
import { NIGHT_MARKET_INFO, SPONSORSHIP_LEVELS, IBPA_INFO } from "@/lib/constants";
import type { Sponsor } from "@shared/schema";
import {
  ArrowRight,
  Music,
  UtensilsCrossed,
  Users,
  CheckCircle2,
  Palette,
  Moon,
  Store,
  Mail,
  MapPin,
  Crown,
  Award,
  Medal,
  Heart,
  ExternalLink,
} from "lucide-react";

const levelIcons: Record<string, typeof Crown> = {
  "Presenting Sponsor": Crown,
  "Gold Sponsor": Award,
  "Silver Sponsor": Medal,
  "Supporting Sponsor": Heart,
};

const levelToSquareKey: Record<string, keyof typeof NIGHT_MARKET_INFO.squareLinks> = {
  "Presenting Sponsor": "presenting",
  "Gold Sponsor": "gold",
  "Silver Sponsor": "silver",
  "Supporting Sponsor": "supporting",
};

function NightMarketHero() {
  return (
    <section className="relative overflow-hidden" data-testid="section-nm-hero">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />

      <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-36 text-center">
        <Badge variant="secondary" className="mb-4 bg-primary/20 text-white border-primary/30">
          <Moon className="w-3 h-3 mr-1" /> Summer 2026
        </Badge>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 font-serif" data-testid="text-nm-title">
          {NIGHT_MARKET_INFO.name}
        </h1>
        <p className="text-lg text-white/80 mb-2">{NIGHT_MARKET_INFO.date}</p>
        <p className="text-base text-white/60 mb-8">{NIGHT_MARKET_INFO.time} &middot; {NIGHT_MARKET_INFO.location}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#vendor-registration">
            <Button size="lg" data-testid="button-nm-register-vendor">
              Register as Vendor
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </a>
          <a href="#sponsors">
            <Button size="lg" variant="outline" className="bg-white/10 text-white backdrop-blur-sm border-white/20" data-testid="button-nm-sponsor">
              Become a Sponsor
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function EventHighlights() {
  const features = [
    { icon: Palette, title: "Local Artisans", desc: "Handcrafted goods and artwork from talented local creators" },
    { icon: UtensilsCrossed, title: "Food Vendors", desc: "Delicious bites and beverages from area food vendors" },
    { icon: Music, title: "Live Entertainment", desc: "Music and performances throughout the evening" },
    { icon: Users, title: "Community Gathering", desc: "A welcoming space for neighbors and families to connect" },
    { icon: Moon, title: "Evening Atmosphere", desc: "Downtown Irwin comes alive under the evening lights" },
    { icon: MapPin, title: "Downtown Location", desc: "Centered on Main Street in the heart of Irwin" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16" data-testid="section-nm-highlights">
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">Event Highlights</h2>
      <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
        {NIGHT_MARKET_INFO.description}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f) => (
          <Card key={f.title} className="p-6" data-testid={`card-nm-feature-${f.title.toLowerCase().replace(/\s/g, "-")}`}>
            <f.icon className="w-6 h-6 text-primary mb-3" />
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function SponsorsSection() {
  const { data: sponsors, isLoading } = useQuery<Sponsor[]>({
    queryKey: ["/api/sponsors/event", "night-market"],
  });

  const sponsorLevels = SPONSORSHIP_LEVELS.filter(
    (level) => levelToSquareKey[level.name] !== undefined
  );

  return (
    <section id="sponsors" className="max-w-7xl mx-auto px-4 py-16" data-testid="section-nm-sponsors">
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-center mb-2">Our Sponsors</h2>
      <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
        Thank you to our generous sponsors for making the Night Market possible.
      </p>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : sponsors && sponsors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sponsors.map((sponsor) => (
            <Card key={sponsor.id} className="p-6 text-center" data-testid={`card-nm-sponsor-${sponsor.id}`}>
              {sponsor.sponsorImageUrl && (
                <img
                  src={sponsor.sponsorImageUrl}
                  alt={sponsor.name}
                  className="w-full h-24 object-contain mb-3"
                />
              )}
              <Badge variant="secondary" className="mb-2 text-xs">{sponsor.level}</Badge>
              <h3 className="font-semibold text-sm">{sponsor.name}</h3>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center mb-12">
          <p className="text-muted-foreground">Sponsors will be announced soon!</p>
        </Card>
      )}

      <h3 className="text-xl font-bold font-serif text-center mb-2">Sponsorship Levels</h3>
      <p className="text-muted-foreground text-center mb-8">Support the Night Market and gain visibility with the community</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sponsorLevels.map((level) => {
          const Icon = levelIcons[level.name] || Award;
          const squareKey = levelToSquareKey[level.name];
          const squareLink = squareKey ? NIGHT_MARKET_INFO.squareLinks[squareKey] : null;

          return (
            <Card
              key={level.name}
              className={`p-6 relative ${level.tag === "Best Value" ? "border-primary" : ""}`}
              data-testid={`card-nm-level-${level.name.toLowerCase().replace(/\s/g, "-")}`}
            >
              {level.tag && (
                <Badge className="absolute -top-2.5 left-4 bg-primary text-primary-foreground">
                  {level.tag}
                </Badge>
              )}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <Icon className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-bold text-lg mb-1">{level.name}</h3>
                  <p className="text-2xl font-bold mb-4">
                    ${level.price}
                    <span className="text-sm text-muted-foreground font-normal"> per event</span>
                  </p>
                  <ul className="space-y-2 mb-4">
                    {level.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {squareLink && (
                <a href={squareLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full" data-testid={`button-nm-pay-${squareKey}`}>
                    Pay via Square
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function VendorRegistrationForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js";
    script.async = true;
    script.onload = () => {
      if ((window as any).jotformEmbedHandler) {
        (window as any).jotformEmbedHandler(
          "iframe[id='JotFormIFrame-260276438583061']",
          "https://form.jotform.com/"
        );
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="vendor-registration" className="bg-card border-y">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-3">
            <Store className="w-3 h-3 mr-1" /> Vendor Application
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-2">Register as a Vendor</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Join the {NIGHT_MARKET_INFO.name} as a vendor. Complete the form below and we will be in touch with next steps.
          </p>
        </div>

        <div data-testid="jotform-nm-vendor-registration">
          <iframe
            id="JotFormIFrame-260276438583061"
            title="Vendor Registration Form"
            // @ts-ignore - JotForm requires this attribute
            allowtransparency="true"
            allow="geolocation; microphone; camera; fullscreen; payment"
            src="https://form.jotform.com/260276438583061"
            style={{ minWidth: "100%", maxWidth: "100%", height: "539px", border: "none" }}
            scrolling="no"
            data-testid="iframe-nm-vendor-form"
          />
        </div>
      </div>
    </section>
  );
}

function ContactCTA() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center" data-testid="section-nm-contact">
      <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
      <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3">Have Questions?</h2>
      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
        Reach out to us with any questions about the {NIGHT_MARKET_INFO.name}, vendor registration, or sponsorship opportunities.
      </p>
      <a href={`mailto:${IBPA_INFO.eventsEmail}`}>
        <Button variant="outline" data-testid="button-nm-contact-email">
          <Mail className="w-4 h-4 mr-2" />
          {IBPA_INFO.eventsEmail}
        </Button>
      </a>
    </section>
  );
}

export default function NightMarket() {
  usePageTitle("Irwin Night Market", "Irwin Night Market - an evening marketplace in Downtown Irwin featuring local artisans, food vendors, live entertainment, and community gathering.");
  return (
    <div className="min-h-screen">
      <NightMarketHero />
      <EventHighlights />
      <SponsorsSection />
      <VendorRegistrationForm />
      <ContactCTA />
    </div>
  );
}
