import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, FileText, CheckCircle, ExternalLink, Users, Loader2, Calendar } from "lucide-react";
import { Link } from "wouter";
import { useEvents } from "@/hooks/useCMS";
import { type CMSEvent, getEventUrls } from "@/lib/content";
import { SEO } from "@/components/SEO";

function EventVendorCard({ event }: { event: CMSEvent }) {
  const statusColors = {
    open: "bg-green-500",
    upcoming: "bg-blue-500",
    closed: "bg-gray-500",
  };

  const statusLabels = {
    open: "Accepting Vendors",
    upcoming: "Coming Soon",
    closed: "Closed",
  };

  const displayDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="hover-elevate" data-testid={`card-vendor-event-${event.slug}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-lg">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>{displayDate}</span>
            </div>
          </div>
          <Badge className={statusColors[event.status]}>
            {statusLabels[event.status]}
          </Badge>
        </div>
        
        {event.cap && (
          <div className="text-sm text-muted-foreground mb-4">
            <span className="font-medium">{event.cap}</span> vendor spots available
          </div>
        )}

        {(() => {
          const urls = getEventUrls(event);
          return urls.vendorUrl ? (
            <a href={urls.vendorUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full" disabled={event.status === "closed"} data-testid={`button-vendor-${event.slug}`}>
                <Users className="h-4 w-4 mr-2" />
                Apply for This Event
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          ) : (
            <Link href={`/events/${event.slug}`}>
              <Button variant="outline" className="w-full" data-testid={`button-details-${event.slug}`}>
                View Event Details
              </Button>
            </Link>
          );
        })()}
      </CardContent>
    </Card>
  );
}

export default function Vendors() {
  const { data: events, isLoading } = useEvents();
  
  const vendorEvents = events?.filter(e => {
    const urls = getEventUrls(e);
    return urls.vendorUrl || e.status === "open";
  }) || [];

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Become a Vendor" 
        description="Join Downtown Irwin community events as a vendor! Apply to sell at the Irwin Car Cruise, Street Market, Night Market, and seasonal festivals."
        path="/vendors"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Become a Vendor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join our community events as a vendor! Whether you're selling handmade crafts, 
            delicious food, or unique products, we'd love to have you at our events.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : vendorEvents.length > 0 ? (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Apply for Upcoming Events</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorEvents.map((event) => (
                <EventVendorCard key={event.slug} event={event} />
              ))}
            </div>
          </section>
        ) : null}

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Vendor Information</h2>
              <p className="text-muted-foreground mb-6">
                Downtown Irwin / IBPA hosts multiple events throughout the year where 
                vendors can showcase their products and services to our community. 
                Our events draw thousands of visitors, providing excellent exposure 
                for your business.
              </p>
              <h3 className="font-semibold mb-3">Featured Events:</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <Link href="/car-cruise">
                    <span className="hover:text-foreground cursor-pointer">Irwin Car Cruise (Annual)</span>
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <Link href="/street-market">
                    <span className="hover:text-foreground cursor-pointer">Street Market</span>
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <Link href="/night-market">
                    <span className="hover:text-foreground cursor-pointer">Night Market</span>
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Seasonal Festivals</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">How to Apply</h2>
              <p className="text-muted-foreground mb-6">
                Each event has its own vendor application. Select an event above to apply, 
                or browse our Events page to see all upcoming opportunities.
              </p>
              
              <div className="bg-accent rounded-lg p-4 mb-6">
                <h4 className="font-semibold mb-2 text-sm">Per-Event Applications</h4>
                <p className="text-sm text-muted-foreground">
                  Vendor applications are specific to each event. Each has different booth 
                  sizes, pricing, and requirements. Select an event to see its specific 
                  vendor application.
                </p>
              </div>

              <h3 className="font-semibold mb-3">General Requirements:</h3>
              <ul className="space-y-2 text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Business name and contact information</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Description of products/services</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Photos of your booth/products (recommended)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary shrink-0" />
                  <span>Valid business license (if applicable)</span>
                </li>
              </ul>

              <Link href="/events">
                <Button size="lg" className="w-full" data-testid="button-browse-events">
                  Browse All Events
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Vending?</h2>
            <p className="opacity-90 mb-6 max-w-2xl mx-auto">
              Our vendor coordinator is here to help! Contact us with any questions 
              about booth fees, setup requirements, or event details.
            </p>
            <Link href="/contact">
              <Button variant="secondary" size="lg" data-testid="button-vendor-contact">
                Contact Vendor Coordinator
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
