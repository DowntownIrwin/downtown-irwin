import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, Users, ExternalLink, Ticket } from "lucide-react";
import { SEO } from "@/components/SEO";

interface PreviewEvent {
  basics?: {
    title: string;
    startDate: string;
    endDate?: string;
    timeText?: string;
    location?: string;
    eventType: string;
    status: string;
  };
  content?: {
    description: string;
    heroImage?: string;
  };
  links?: {
    vendorUrl?: string;
    sponsorUrl?: string;
    attendeeUrl?: string;
  };
}

interface PreviewGallery {
  title: string;
  description?: string;
  coverImage?: string;
  photos?: Array<{ image: string; caption?: string }>;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function EventPreview({ data }: { data: PreviewEvent }) {
  const title = data.basics?.title || "Untitled Event";
  const description = data.content?.description || "";
  const heroImage = data.content?.heroImage;
  const status = data.basics?.status || "upcoming";
  const startDate = data.basics?.startDate;
  const timeText = data.basics?.timeText;
  const location = data.basics?.location;
  const eventType = data.basics?.eventType || "other";
  const links = data.links || {};

  return (
    <div className="py-12 md:py-16">
      <SEO title={`Preview: ${title}`} description="Preview mode" path="/preview/event" />
      
      <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 text-sm">
        Preview Mode - This is how the event will look when published
      </div>

      {heroImage && (
        <div className="relative h-64 md:h-96 w-full">
          <img
            src={heroImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{title}</h1>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {!heroImage && (
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge variant={status === "open" ? "default" : status === "upcoming" ? "secondary" : "outline"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
          <Badge variant="outline">
            {eventType.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br/>") }} />
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                {startDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{formatDate(startDate)}</span>
                  </div>
                )}
                {timeText && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>{timeText}</span>
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{location}</span>
                  </div>
                )}

                <div className="pt-4 space-y-2">
                  {links.attendeeUrl && (
                    <Button className="w-full">
                      <Ticket className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  )}
                  {links.vendorUrl && (
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Vendor Signup
                    </Button>
                  )}
                  {links.sponsorUrl && (
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Become a Sponsor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryPreview({ data }: { data: PreviewGallery }) {
  const { title, description, coverImage, photos = [] } = data;

  return (
    <div className="py-12 md:py-16">
      <SEO title={`Preview: ${title}`} description="Preview mode" path="/preview/gallery" />
      
      <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 text-sm">
        Preview Mode - This is how the gallery will look when published
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title || "Untitled Gallery"}</h1>
        {description && <p className="text-lg text-muted-foreground mb-8">{description}</p>}

        {coverImage && (
          <div className="mb-8">
            <img src={coverImage} alt={title} className="w-full h-64 object-cover rounded-lg" />
          </div>
        )}

        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div key={idx} className="aspect-square">
                <img
                  src={photo.image}
                  alt={photo.caption || `Photo ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PagePreview({ data }: { data: any }) {
  return (
    <div className="py-12 md:py-16">
      <SEO title={`Preview: ${data.title}`} description="Preview mode" path="/preview/page" />
      
      <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 text-sm">
        Preview Mode - This is how the page will look when published
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{data.title || "Untitled Page"}</h1>
        <p className="text-muted-foreground">Page preview with sections will render here.</p>
        
        {data.sections && data.sections.length > 0 && (
          <div className="mt-8 space-y-4">
            {data.sections.map((section: any, idx: number) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{section.type}</Badge>
                  <pre className="text-xs overflow-auto">{JSON.stringify(section, null, 2)}</pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Preview() {
  const [, params] = useRoute("/preview/:type");
  const type = params?.type || "event";
  const [previewData, setPreviewData] = useState<any>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "preview") {
        setPreviewData(event.data.payload);
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Also check for data in sessionStorage (for draft saves)
    const stored = sessionStorage.getItem(`preview-${type}`);
    if (stored) {
      try {
        setPreviewData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse preview data", e);
      }
    }

    return () => window.removeEventListener("message", handleMessage);
  }, [type]);

  if (!previewData) {
    return (
      <div className="py-12 md:py-16">
        <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-center py-2 text-sm">
          Preview Mode
        </div>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Waiting for Preview Data...</h1>
          <p className="text-muted-foreground">
            Save a draft in the CMS editor to see a preview here, or use the preview link on the edit screen.
          </p>
        </div>
      </div>
    );
  }

  switch (type) {
    case "event":
      return <EventPreview data={previewData} />;
    case "gallery":
      return <GalleryPreview data={previewData} />;
    case "page":
      return <PagePreview data={previewData} />;
    default:
      return <EventPreview data={previewData} />;
  }
}
