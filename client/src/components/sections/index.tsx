import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, ExternalLink, Users, Ticket, Check } from "lucide-react";
import {
  type PageSection,
  type HeroSection,
  type TextSection,
  type PhotoGridSection,
  type CTASection,
  type FAQSection,
  type EmbedSection,
  type SponsorsSection,
  type EventsListSection,
  type GalleriesListSection,
  type CMSEvent,
  allEvents,
  sponsorTiers,
  allGalleries,
  getEventUrls,
} from "@/lib/content";
import { useSponsorLogos } from "@/hooks/useCMS";
import heroBackground from "@assets/72dpi_Photo_Oct_19_2024__5_56_10_AM_Downsized_edited_1770042251001.jpg";

// Hero Section Component
function HeroSectionComponent({ section }: { section: HeroSection }) {
  const bgImage = section.backgroundImage || heroBackground;
  
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10 text-center text-white px-4 py-16 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4" data-testid="text-hero-headline">
          {section.headline}
        </h1>
        {section.subheadline && (
          <p className="text-xl md:text-2xl mb-8 text-white/90" data-testid="text-hero-subheadline">
            {section.subheadline}
          </p>
        )}
        {section.buttons && section.buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {section.buttons.map((btn, i) => (
              <Link key={i} href={btn.url}>
                <Button
                  size="lg"
                  variant={btn.style === "outline" ? "outline" : btn.style === "secondary" ? "secondary" : "default"}
                  className={btn.style === "outline" ? "border-white text-white hover:bg-white/20" : ""}
                  data-testid={`button-hero-${i}`}
                >
                  {btn.text}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Text Section Component
function TextSectionComponent({ section }: { section: TextSection }) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center mx-auto",
    right: "text-right ml-auto",
  }[section.alignment];

  return (
    <section className="py-12 md:py-16">
      <div className={`container mx-auto px-4 max-w-4xl ${alignmentClass}`}>
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{section.heading}</h2>
        )}
        <div 
          className="prose prose-lg max-w-none text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: section.body.replace(/\n/g, '<br/>') }}
        />
      </div>
    </section>
  );
}

// Photo Grid Section Component
function PhotoGridSectionComponent({ section }: { section: PhotoGridSection }) {
  const colsClass = {
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[section.columns];

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{section.heading}</h2>
        )}
        <div className={`grid ${colsClass} gap-4`}>
          {section.images.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              {img.linkUrl ? (
                <a href={img.linkUrl} target="_blank" rel="noopener noreferrer">
                  <img src={img.image} alt={img.caption || ""} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                </a>
              ) : (
                <img src={img.image} alt={img.caption || ""} className="w-full h-full object-cover" />
              )}
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section Component
function CTASectionComponent({ section }: { section: CTASection }) {
  const bgClass = {
    default: "bg-background",
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent",
    muted: "bg-muted",
  }[section.backgroundColor];

  return (
    <section className={`py-12 md:py-16 ${bgClass}`}>
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{section.heading}</h2>
        {section.description && (
          <p className="text-lg mb-8 opacity-90">{section.description}</p>
        )}
        {section.buttons && section.buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4">
            {section.buttons.map((btn, i) => (
              <Link key={i} href={btn.url}>
                <Button
                  size="lg"
                  variant={btn.style === "outline" ? "outline" : btn.style === "secondary" ? "secondary" : "default"}
                  data-testid={`button-cta-${i}`}
                >
                  {btn.text}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// FAQ Section Component
function FAQSectionComponent({ section }: { section: FAQSection }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{section.heading}</h2>
        <div className="space-y-4">
          {section.items.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: item.answer.replace(/\n/g, '<br/>') }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Embed Section Component
function EmbedSectionComponent({ section }: { section: EmbedSection }) {
  const maxWidthClass = {
    full: "max-w-full",
    large: "max-w-5xl",
    medium: "max-w-3xl",
    small: "max-w-xl",
  }[section.maxWidth];

  return (
    <section className="py-12 md:py-16">
      <div className={`container mx-auto px-4 ${maxWidthClass}`}>
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{section.heading}</h2>
        )}
        <div 
          className="w-full"
          dangerouslySetInnerHTML={{ __html: section.embedHtml }}
        />
      </div>
    </section>
  );
}

// Sponsors Section Component
function SponsorsSectionComponent({ section }: { section: SponsorsSection }) {
  const { data: logos } = useSponsorLogos();

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{section.heading}</h2>
        
        {section.showTierCards && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sponsorTiers.sort((a, b) => a.order - b.order).map(tier => (
              <Card key={tier.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <p className="text-2xl font-bold text-primary">${tier.price}</p>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <a href={tier.squareUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" data-testid={`button-sponsor-${tier.id}`}>
                      Become a Sponsor
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {section.showLogos && logos && (
          <div className="space-y-8">
            {logos.presenting && logos.presenting.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-center">Presenting Sponsors</h3>
                <div className="flex flex-wrap justify-center gap-8">
                  {logos.presenting.map((sponsor, i) => (
                    <a key={i} href={sponsor.website} target="_blank" rel="noopener noreferrer">
                      {sponsor.logo_url ? (
                        <img src={sponsor.logo_url} alt={sponsor.name} className="h-20 object-contain" />
                      ) : (
                        <span className="text-lg font-medium">{sponsor.name}</span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Event Card Component
function EventCard({ event }: { event: CMSEvent }) {
  const statusColors = {
    open: "bg-green-500",
    upcoming: "bg-blue-500",
    closed: "bg-gray-500",
  };

  return (
    <Card className="hover-elevate overflow-hidden" data-testid={`card-event-${event.slug}`}>
      {event.heroImage && (
        <div className="aspect-video bg-muted overflow-hidden">
          <img src={event.heroImage} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={statusColors[event.status]}>
            {event.status === "open" ? "Open" : event.status === "upcoming" ? "Upcoming" : "Closed"}
          </Badge>
          {event.featured && <Badge variant="outline">Featured</Badge>}
        </div>
        
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary cursor-pointer">
            {event.title}
          </h3>
        </Link>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{new Date(event.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
          {event.timeText && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>{event.timeText}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {(() => {
            const urls = getEventUrls(event);
            return (
              <>
                {urls.vendorUrl && (
                  <a href={urls.vendorUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      <Users className="h-4 w-4 mr-1" />
                      Vendor Signup
                    </Button>
                  </a>
                )}
                {urls.sponsorUrl && (
                  <a href={urls.sponsorUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Sponsor
                    </Button>
                  </a>
                )}
                {urls.attendeeUrl && (
                  <a href={urls.attendeeUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      <Ticket className="h-4 w-4 mr-1" />
                      Register
                    </Button>
                  </a>
                )}
              </>
            );
          })()}
        </div>
      </CardContent>
    </Card>
  );
}

// Events List Section Component
function EventsListSectionComponent({ section }: { section: EventsListSection }) {
  let events = [...allEvents];
  
  if (section.filterType !== "all") {
    events = events.filter(e => e.eventType === section.filterType);
  }
  
  if (section.featuredOnly) {
    events = events.filter(e => e.featured);
  }
  
  events = events.slice(0, section.maxEvents);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{section.heading}</h2>
        )}
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <EventCard key={event.slug} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No events found.</p>
        )}
      </div>
    </section>
  );
}

// Galleries List Section Component
function GalleriesListSectionComponent({ section }: { section: GalleriesListSection }) {
  let galleries = [...allGalleries];
  
  if (section.featuredOnly) {
    galleries = galleries.filter(g => g.featured);
  }
  
  galleries = galleries.slice(0, section.maxGalleries);

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {section.heading && (
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{section.heading}</h2>
        )}
        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map(gallery => (
              <Card key={gallery.slug} className="hover-elevate overflow-hidden">
                {gallery.coverImage && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img src={gallery.coverImage} alt={gallery.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{gallery.title}</h3>
                  {gallery.description && (
                    <p className="text-sm text-muted-foreground">{gallery.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No galleries found.</p>
        )}
      </div>
    </section>
  );
}

// Section Renderer
export function SectionRenderer({ section }: { section: PageSection }) {
  switch (section.type) {
    case "hero":
      return <HeroSectionComponent section={section} />;
    case "text":
      return <TextSectionComponent section={section} />;
    case "photoGrid":
      return <PhotoGridSectionComponent section={section} />;
    case "cta":
      return <CTASectionComponent section={section} />;
    case "faq":
      return <FAQSectionComponent section={section} />;
    case "embed":
      return <EmbedSectionComponent section={section} />;
    case "sponsors":
      return <SponsorsSectionComponent section={section} />;
    case "eventsList":
      return <EventsListSectionComponent section={section} />;
    case "galleriesList":
      return <GalleriesListSectionComponent section={section} />;
    default:
      return null;
  }
}
