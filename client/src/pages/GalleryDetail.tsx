import { useParams, Link } from "wouter";
import { ArrowLeft, Camera, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGalleryBySlug } from "@/lib/content";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function GalleryDetail() {
  const params = useParams<{ slug: string }>();
  const gallery = getGalleryBySlug(params.slug || "");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!gallery) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Gallery Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The gallery you're looking for doesn't exist.
        </p>
        <Link href="/galleries">
          <Button data-testid="button-back-to-galleries">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Galleries
          </Button>
        </Link>
      </div>
    );
  }

  const photos = gallery.photos || [];
  // Support both new googleDriveUrl and legacy sourceUrl field
  const externalAlbumUrl = (gallery as any).googleDriveUrl || (gallery as any).sourceUrl;

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/galleries">
        <Button variant="ghost" className="mb-6" data-testid="button-back-to-galleries">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Galleries
        </Button>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-gallery-title">{gallery.title}</h1>
        {gallery.description && (
          <p className="text-lg text-muted-foreground max-w-3xl mb-4">
            {gallery.description}
          </p>
        )}
        {externalAlbumUrl && (
          <a
            href={externalAlbumUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" data-testid="button-google-drive-album">
              <ExternalLink className="h-4 w-4 mr-2" />
              View full album on Google Drive
            </Button>
          </a>
        )}
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <Camera className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No photos yet</h2>
          <p className="text-muted-foreground">
            Photos will be added soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover-elevate"
              onClick={() => setSelectedImage(index)}
              data-testid={`photo-${index}`}
            >
              <img
                src={photo.image}
                alt={photo.caption || `Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedImage !== null && photos[selectedImage] && (
            <div className="relative">
              <img
                src={photos[selectedImage].image}
                alt={photos[selectedImage].caption || `Photo ${selectedImage + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {photos[selectedImage].caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                  <p>{photos[selectedImage].caption}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
