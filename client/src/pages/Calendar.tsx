import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarIcon, ExternalLink } from "lucide-react";
import { EXTERNAL_URLS } from "@shared/types";
import { SEO } from "@/components/SEO";

export default function Calendar() {
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
            <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-center p-8">
              <CalendarIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Calendar Embed Placeholder</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                Replace this placeholder with your EventsCalendar.co embed code.
              </p>
              <div className="bg-background rounded-md p-4 text-left w-full max-w-lg">
                <code className="text-sm text-muted-foreground break-all">
                  {`<!-- EventsCalendar.co Embed Code -->`}
                  <br />
                  {`<!-- Embed ID: ${EXTERNAL_URLS.eventsCalendarEmbed} -->`}
                  <br />
                  {`<iframe src="https://eventscalendar.co/embed/YOUR_ID" ...></iframe>`}
                </code>
              </div>
            </div>
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
