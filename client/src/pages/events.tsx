import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import type { Event, PhotoAlbum, AlbumPhoto } from "@shared/schema";
import { Calendar, Clock, MapPin, Sparkles, ExternalLink, Camera, ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import { usePageTitle } from "@/hooks/use-page-title";

const categories = ["All", "Festival", "Shopping", "Holiday", "Car Show", "Community"];

export default function Events() {
  usePageTitle("Community Events", "15+ free community events annually in Downtown Irwin including Ladies Night, Light Up Night, and more.");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: albums } = useQuery<PhotoAlbum[]>({
    queryKey: ["/api/photo-albums"],
  });

  const filtered = activeCategory === "All"
    ? events
    : events?.filter((e) => e.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <Badge variant="secondary" className="mb-3">
            <Sparkles className="w-3 h-3 mr-1" /> 15+ Annual Events
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2" data-testid="text-events-title">
            Community Events
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Downtown Irwin hosts free community events year-round, open to everyone.
            From holiday celebrations to car shows, there's always something happening on Main Street.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="flex-wrap h-auto gap-1" data-testid="tabs-event-categories">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} data-testid={`tab-${cat.toLowerCase()}`}>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => (
              <Card key={event.id} className="overflow-hidden hover-elevate" data-testid={`card-event-${event.id}`}>
                {event.imageUrl && (
                  <div className="relative">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    {event.featured && (
                      <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                  </div>
                )}
                <div className="p-5">
                  <Badge variant="secondary" className="mb-3 text-xs">{event.category}</Badge>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-event-title-${event.id}`}>
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 shrink-0" /> {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 shrink-0" /> {event.time}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" /> {event.location}
                    </span>
                  </div>
                  {event.externalLink && (
                    <a
                      href={event.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                      data-testid={`link-event-external-${event.id}`}
                    >
                      More Info <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No Events Found</h3>
            <p className="text-sm text-muted-foreground">
              {activeCategory === "All"
                ? "Check back soon for upcoming events!"
                : `No ${activeCategory} events scheduled at the moment.`}
            </p>
            {activeCategory !== "All" && (
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setActiveCategory("All")} data-testid="button-show-all-events">
                Show All Events
              </Button>
            )}
          </Card>
        )}
      </div>

      {albums && albums.length > 0 && (
        <PastEventsAlbums albums={albums} />
      )}
    </div>
  );
}

function PastEventsAlbums({ albums }: { albums: PhotoAlbum[] }) {
  const [selectedAlbum, setSelectedAlbum] = useState<PhotoAlbum | null>(null);

  return (
    <section className="border-t bg-card">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold font-serif" data-testid="text-past-events-title">
            Past Events
          </h2>
        </div>
        <p className="text-muted-foreground mb-8">
          Browse photos from our previous community events and celebrations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Card
              key={album.id}
              className="overflow-hidden cursor-pointer hover-elevate group"
              onClick={() => setSelectedAlbum(album)}
              data-testid={`card-past-event-album-${album.id}`}
            >
              {album.coverPhotoUrl ? (
                <div className="relative overflow-hidden">
                  <img
                    src={album.coverPhotoUrl}
                    alt={album.title}
                    className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-lg text-white" data-testid={`text-past-album-title-${album.id}`}>
                      {album.title}
                    </h3>
                    {album.description && (
                      <p className="text-sm text-white/80 mt-1 line-clamp-1">{album.description}</p>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/50 text-white border-0">
                      <Images className="w-3 h-3 mr-1" /> View Photos
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="w-full h-40 bg-muted rounded-md flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg" data-testid={`text-past-album-title-${album.id}`}>
                    {album.title}
                  </h3>
                  {album.description && (
                    <p className="text-sm text-muted-foreground mt-1">{album.description}</p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {selectedAlbum && (
        <AlbumViewer album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
      )}
    </section>
  );
}

function AlbumViewer({ album, onClose }: { album: PhotoAlbum; onClose: () => void }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: photos, isLoading } = useQuery<AlbumPhoto[]>({
    queryKey: ["/api/photo-albums", album.id, "photos"],
  });

  const goNext = () => {
    if (photos && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  };

  const goPrev = () => {
    if (photos && lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <>
      <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <div className="p-6 pb-0">
            <h2 className="text-xl font-bold font-serif" data-testid="text-album-viewer-title">{album.title}</h2>
            {album.description && <p className="text-sm text-muted-foreground mt-1">{album.description}</p>}
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="aspect-square rounded-md" />)}
              </div>
            ) : photos && photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="aspect-square rounded-md overflow-hidden cursor-pointer hover-elevate"
                    onClick={() => setLightboxIndex(index)}
                    data-testid={`gallery-photo-${photo.id}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No photos in this album yet.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {lightboxIndex !== null && photos && photos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
          data-testid="lightbox-overlay"
        >
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            data-testid="button-close-lightbox"
          >
            <X className="w-6 h-6" />
          </Button>

          {photos.length > 1 && (
            <>
              <Button
                size="icon"
                variant="ghost"
                className="absolute left-4 text-white hover:bg-white/20 z-10"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                data-testid="button-lightbox-prev"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 text-white hover:bg-white/20 z-10"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                data-testid="button-lightbox-next"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </>
          )}

          <img
            src={photos[lightboxIndex].url}
            alt={photos[lightboxIndex].caption || "Photo"}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onClick={(e) => e.stopPropagation()}
            data-testid="img-lightbox-photo"
          />

          <div className="absolute bottom-4 text-white/70 text-sm" data-testid="text-lightbox-counter">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}
