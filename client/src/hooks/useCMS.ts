import { useQuery } from "@tanstack/react-query";
import { fetchSponsorLogos } from "@/lib/cms";
import { 
  allEvents, 
  allPages,
  allGalleries,
  sponsorTiers, 
  site,
  getPageBySlug,
  getEventBySlug,
  getGalleryBySlug,
  getNavPages,
  getEventsByType,
  getFeaturedEvents,
  groupEventsByStatus,
  getFeaturedGalleries,
  type CMSEvent,
  type CMSPage,
  type CMSGallery,
  type SiteSettings,
  type SponsorTier,
} from "@/lib/content";

export function useSiteConfig() {
  return useQuery({
    queryKey: ["content", "site"],
    queryFn: async (): Promise<SiteSettings> => site,
    staleTime: Infinity,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["content", "events"],
    queryFn: async (): Promise<CMSEvent[]> => allEvents,
    staleTime: Infinity,
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ["content", "events", slug],
    queryFn: async (): Promise<CMSEvent | undefined> => getEventBySlug(slug),
    staleTime: Infinity,
  });
}

export function useEventsByType(type: CMSEvent["eventType"]) {
  return useQuery({
    queryKey: ["content", "events", "type", type],
    queryFn: async (): Promise<CMSEvent[]> => getEventsByType(type),
    staleTime: Infinity,
  });
}

export function useFeaturedEvents() {
  return useQuery({
    queryKey: ["content", "events", "featured"],
    queryFn: async (): Promise<CMSEvent[]> => getFeaturedEvents(),
    staleTime: Infinity,
  });
}

export function useGroupedEvents() {
  return useQuery({
    queryKey: ["content", "events", "grouped"],
    queryFn: async () => groupEventsByStatus(),
    staleTime: Infinity,
  });
}

export function usePages() {
  return useQuery({
    queryKey: ["content", "pages"],
    queryFn: async (): Promise<CMSPage[]> => allPages,
    staleTime: Infinity,
  });
}

export function usePage(slug: string) {
  return useQuery({
    queryKey: ["content", "pages", slug],
    queryFn: async (): Promise<CMSPage | undefined> => getPageBySlug(slug),
    staleTime: Infinity,
  });
}

export function useNavPages() {
  return useQuery({
    queryKey: ["content", "pages", "nav"],
    queryFn: async (): Promise<CMSPage[]> => getNavPages(),
    staleTime: Infinity,
  });
}

export function useGalleries() {
  return useQuery({
    queryKey: ["content", "galleries"],
    queryFn: async (): Promise<CMSGallery[]> => allGalleries,
    staleTime: Infinity,
  });
}

export function useGallery(slug: string) {
  return useQuery({
    queryKey: ["content", "galleries", slug],
    queryFn: async (): Promise<CMSGallery | undefined> => getGalleryBySlug(slug),
    staleTime: Infinity,
  });
}

export function useFeaturedGalleries() {
  return useQuery({
    queryKey: ["content", "galleries", "featured"],
    queryFn: async (): Promise<CMSGallery[]> => getFeaturedGalleries(),
    staleTime: Infinity,
  });
}

export function useSponsorTiers() {
  return useQuery({
    queryKey: ["content", "sponsorTiers"],
    queryFn: async (): Promise<SponsorTier[]> => sponsorTiers,
    staleTime: Infinity,
  });
}

// This still fetches from external endpoint for sponsor logos
export function useSponsorLogos() {
  return useQuery({
    queryKey: ["cms", "sponsorLogos"],
    queryFn: fetchSponsorLogos,
    staleTime: 10 * 60 * 1000,
  });
}
