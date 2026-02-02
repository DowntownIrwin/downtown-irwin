import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Award, Medal, Heart, ExternalLink, CheckCircle, Loader2 } from "lucide-react";
import { useSponsorTiers, useSponsorLogos } from "@/hooks/useCMS";
import type { SponsorTier, SponsorLogosData } from "@shared/types";
import { SEO } from "@/components/SEO";

const tierIcons: Record<string, typeof Crown> = {
  presenting: Crown,
  gold: Award,
  silver: Medal,
  supporting: Heart,
};

const tierColors: Record<string, string> = {
  presenting: "bg-amber-500",
  gold: "bg-yellow-500",
  silver: "bg-slate-400",
  supporting: "bg-primary",
};

function SponsorTierCard({ tier }: { tier: SponsorTier }) {
  const tierKey = tier.name.toLowerCase().split(" ")[0];
  const Icon = tierIcons[tierKey] || Heart;
  const color = tierColors[tierKey] || "bg-primary";
  
  return (
    <Card className="relative overflow-hidden" data-testid={`card-tier-${tier.id}`}>
      <CardHeader className="pb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <div className="text-3xl font-bold text-primary">
          ${tier.price.toLocaleString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {tier.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
        <a href={tier.square_url} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full" data-testid={`button-sponsor-${tier.id}`}>
            Sponsor Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

function SponsorLogosSection({ logos }: { logos: SponsorLogosData | undefined }) {
  if (!logos) {
    return (
      <section className="py-12 bg-card rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Sponsors</h2>
          <p className="text-muted-foreground">Loading sponsors...</p>
        </div>
      </section>
    );
  }

  const allEmpty = 
    (logos.presenting?.length || 0) === 0 && 
    (logos.gold?.length || 0) === 0 && 
    (logos.silver?.length || 0) === 0 && 
    (logos.supporting?.length || 0) === 0;

  if (allEmpty) {
    return (
      <section className="py-12 bg-card rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Our Sponsors</h2>
          <p className="text-muted-foreground">Sponsors to be announced soon...</p>
        </div>
      </section>
    );
  }

  const tiers = [
    { key: 'presenting' as const, label: 'Presenting Sponsors', icon: Crown, color: 'bg-amber-500', sponsors: logos.presenting || [] },
    { key: 'gold' as const, label: 'Gold Sponsors', icon: Award, color: 'bg-yellow-500', sponsors: logos.gold || [] },
    { key: 'silver' as const, label: 'Silver Sponsors', icon: Medal, color: 'bg-slate-400', sponsors: logos.silver || [] },
  ];

  return (
    <section className="py-12 bg-card rounded-lg">
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

        {(logos.supporting?.length || 0) > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Supporting Sponsors</h3>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-muted-foreground">
              {(logos.supporting || []).map((name, index) => (
                <span key={index} className="text-sm">
                  {name}{index < (logos.supporting?.length || 0) - 1 ? " •" : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Sponsors() {
  const { data: tiers, isLoading: tiersLoading } = useSponsorTiers();
  const { data: logos, isLoading: logosLoading } = useSponsorLogos();

  const isLoading = tiersLoading || logosLoading;

  const fallbackTiers: SponsorTier[] = [
    {
      id: "presenting",
      name: "Presenting Sponsor",
      price: 2500,
      benefits: [
        "Premier logo placement on all event materials",
        "Exclusive banner placement at main stage",
        "Featured in all press releases",
        "VIP tent with premium viewing area",
        "10 event passes",
        "Speaking opportunity",
      ],
      square_url: "#",
      order: 1,
    },
    {
      id: "gold",
      name: "Gold Sponsor",
      price: 1500,
      benefits: [
        "Large logo on event banners",
        "Featured on event website",
        "Included in press releases",
        "Premium vendor booth",
        "6 event passes",
      ],
      square_url: "#",
      order: 2,
    },
    {
      id: "silver",
      name: "Silver Sponsor",
      price: 750,
      benefits: [
        "Logo on event signage",
        "Listed on event website",
        "Standard vendor booth",
        "4 event passes",
      ],
      square_url: "#",
      order: 3,
    },
    {
      id: "supporting",
      name: "Supporting Sponsor",
      price: 250,
      benefits: [
        "Name on sponsor board",
        "Listed on website",
        "2 event passes",
      ],
      square_url: "#",
      order: 4,
    },
  ];

  const displayTiers = tiers && tiers.length > 0 
    ? [...tiers].sort((a, b) => a.order - b.order)
    : fallbackTiers;

  const displayLogos = logos || {
    presenting: [],
    gold: [],
    silver: [],
    supporting: [],
  };

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Become a Sponsor" 
        description="Partner with Downtown Irwin and IBPA to support community events. Choose from Presenting, Gold, Silver, or Supporting sponsorship tiers."
        path="/sponsors"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Sponsor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partner with Downtown Irwin / IBPA to support community events and grow 
            your brand visibility in our thriving community.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
              {displayTiers.map((tier) => (
                <SponsorTierCard key={tier.id} tier={tier} />
              ))}
            </div>

            <SponsorLogosSection logos={displayLogos} />
          </>
        )}

        <div className="mt-12 bg-accent rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Custom Sponsorship Packages</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Looking for something different? We can create a custom sponsorship 
            package tailored to your business goals and budget.
          </p>
          <a href="/contact">
            <Button size="lg" variant="outline" data-testid="button-custom-sponsor">
              Discuss Custom Options
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
