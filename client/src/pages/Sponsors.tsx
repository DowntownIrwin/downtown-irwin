import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Award, Medal, Heart, ExternalLink, CheckCircle } from "lucide-react";
import { EXTERNAL_URLS } from "@shared/types";
import { SEO } from "@/components/SEO";

const sponsorshipTiers = [
  {
    name: "Presenting Sponsor",
    price: "$2,500",
    icon: Crown,
    color: "bg-amber-500",
    badge: "Most Popular",
    url: EXTERNAL_URLS.sponsorSquarePresenting,
    benefits: [
      "Premier logo placement on all event materials",
      "Exclusive banner placement at main stage",
      "Featured in all press releases and media coverage",
      "VIP tent with premium viewing area",
      "10 event passes for staff/guests",
      "Speaking opportunity at event opening",
      "Social media spotlight (dedicated posts)",
      "Logo on event t-shirts",
      "First right of refusal for next year",
    ],
  },
  {
    name: "Gold Sponsor",
    price: "$1,500",
    icon: Award,
    color: "bg-yellow-500",
    badge: null,
    url: EXTERNAL_URLS.sponsorSquareGold,
    benefits: [
      "Large logo on event banners and signage",
      "Featured placement on event website",
      "Included in press releases",
      "Premium vendor booth location",
      "6 event passes for staff/guests",
      "Social media recognition",
      "Logo on event programs",
      "PA announcements during event",
    ],
  },
  {
    name: "Silver Sponsor",
    price: "$750",
    icon: Medal,
    color: "bg-slate-400",
    badge: null,
    url: EXTERNAL_URLS.sponsorSquareSilver,
    benefits: [
      "Logo on event signage",
      "Listed on event website",
      "Standard vendor booth location",
      "4 event passes for staff/guests",
      "Social media mention",
      "Logo in event program",
      "Recognition at event",
    ],
  },
  {
    name: "Supporting Sponsor",
    price: "$250",
    icon: Heart,
    color: "bg-primary",
    badge: null,
    url: EXTERNAL_URLS.sponsorSquareSupporting,
    benefits: [
      "Name listed on sponsor board",
      "Listed on event website",
      "2 event passes",
      "Recognition in event program",
      "Social media thank you",
    ],
  },
];

function SponsorTierCard({ tier }: { tier: typeof sponsorshipTiers[0] }) {
  const Icon = tier.icon;
  
  return (
    <Card className="relative overflow-hidden" data-testid={`card-sponsor-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}>
      {tier.badge && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary">{tier.badge}</Badge>
        </div>
      )}
      <CardHeader className="pb-4">
        <div className={`w-12 h-12 rounded-lg ${tier.color} flex items-center justify-center mb-4`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <div className="text-3xl font-bold text-primary">{tier.price}</div>
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
        <a href={tier.url} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full" data-testid={`button-sponsor-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}>
            Sponsor Now
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

export default function Sponsors() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {sponsorshipTiers.map((tier) => (
            <SponsorTierCard key={tier.name} tier={tier} />
          ))}
        </div>

        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Sponsor?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground">Annual Event Attendees</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">30+</div>
                <p className="text-muted-foreground">Years in the Community</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <p className="text-muted-foreground">Events Per Year</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-card rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Custom Sponsorship Packages</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Looking for something different? We can create a custom sponsorship 
            package tailored to your business goals and budget. Contact us to discuss options.
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
