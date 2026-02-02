import { useQuery } from "@tanstack/react-query";
import {
  fetchSiteConfig,
  fetchEvents,
  fetchSponsorTiers,
  fetchSponsorLogos,
} from "@/lib/cms";

export function useSiteConfig() {
  return useQuery({
    queryKey: ["cms", "site"],
    queryFn: fetchSiteConfig,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["cms", "events"],
    queryFn: fetchEvents,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSponsorTiers() {
  return useQuery({
    queryKey: ["cms", "sponsorTiers"],
    queryFn: fetchSponsorTiers,
    staleTime: 10 * 60 * 1000,
  });
}

export function useSponsorLogos() {
  return useQuery({
    queryKey: ["cms", "sponsorLogos"],
    queryFn: fetchSponsorLogos,
    staleTime: 10 * 60 * 1000,
  });
}
