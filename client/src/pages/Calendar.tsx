import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { SEO } from "@/components/SEO";

const CALENDAR_APP_ID = "proj_dJGH0ihOCO4zdcz1EA5VE";

export default function Calendar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://dist.eventscalendar.co/embed.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://dist.eventscalendar.co/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="py-12 md:py-16">
      <SEO 
        title="Event Calendar" 
        description="View our full calendar of community events, meetings, and activities happening in Downtown Irwin throughout the year."
        path="/calendar"
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event Calendar</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View our full calendar of community events, meetings, and activities 
            happening in Downtown Irwin.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div 
              ref={containerRef}
              className="w-full min-h-[600px]"
              data-events-calendar-app={CALENDAR_APP_ID}
              data-testid="calendar-embed"
            />
          </CardContent>
        </Card>

        <div className="bg-accent rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-2">Subscribe to Our Calendar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Never miss an event! Subscribe to our calendar feed to stay updated on all 
            community happenings.
          </p>
          <a 
            href="https://eventscalendar.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
            data-testid="link-eventscalendar"
          >
            <span>View on EventsCalendar.co</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
