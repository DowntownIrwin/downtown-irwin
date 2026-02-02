import { Link } from "wouter";
import { Camera, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { allGalleries, type CMSGallery } from "@/lib/content";

function GalleryCard({ gallery }: { gallery: CMSGallery }) {
  const photoCount = gallery.photos?.length || 0;
  
  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`card-gallery-${gallery.slug}`}>
      <div className="aspect-video relative bg-muted">
        {gallery.coverImage ? (
          <img
            src={gallery.coverImage}
            alt={gallery.title}
            className="w-full h-full object-cover"
          />
        ) : gallery.photos && gallery.photos.length > 0 ? (
          <img
            src={gallery.photos[0].image}
            alt={gallery.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Camera className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        {gallery.featured && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{gallery.title}</h3>
        {gallery.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {gallery.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {photoCount} {photoCount === 1 ? "photo" : "photos"}
          </span>
          {gallery.sourceType === "uploaded" && photoCount > 0 ? (
            <Link href={`/galleries/${gallery.slug}`}>
              <Button variant="outline" size="sm" data-testid={`button-view-gallery-${gallery.slug}`}>
                View Gallery
              </Button>
            </Link>
          ) : gallery.sourceUrl ? (
            <a href={gallery.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" data-testid={`button-external-gallery-${gallery.slug}`}>
                <ExternalLink className="h-4 w-4 mr-1" />
                View Photos
              </Button>
            </a>
          ) : (
            <span className="text-sm text-muted-foreground italic">Coming soon</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Galleries() {
  const featuredGalleries = allGalleries.filter(g => g.featured);
  const otherGalleries = allGalleries.filter(g => !g.featured);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-galleries-title">Photo Galleries</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse photos from our community events and celebrations in Downtown Irwin.
        </p>
      </div>

      {allGalleries.length === 0 ? (
        <div className="text-center py-16">
          <Camera className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No galleries yet</h2>
          <p className="text-muted-foreground">
            Check back soon for photos from our upcoming events!
          </p>
        </div>
      ) : (
        <>
          {featuredGalleries.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Featured Galleries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredGalleries.map((gallery) => (
                  <GalleryCard key={gallery.slug} gallery={gallery} />
                ))}
              </div>
            </section>
          )}

          {otherGalleries.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6">All Galleries</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherGalleries.map((gallery) => (
                  <GalleryCard key={gallery.slug} gallery={gallery} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
