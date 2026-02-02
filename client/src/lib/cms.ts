import { CMS_BASE_URL, SPONSORS_LOGO_JSON_URL, CACHE_DURATION_MS, CACHE_KEYS } from "@/config";
import type { SiteConfig, CMSEvent, SponsorTier, SponsorLogosData, CacheEntry } from "@shared/types";

// Generic cache functions
function getFromCache<T>(key: string): T | null {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    if (now - entry.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(key);
      return null;
    }
    
    return entry.data;
  } catch {
    return null;
  }
}

function setToCache<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable, continue without caching
  }
}

// Fetch with cache
async function fetchWithCache<T>(
  url: string,
  cacheKey: string,
  fallback: T
): Promise<T> {
  // Try cache first
  const cached = getFromCache<T>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    setToCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return fallback;
  }
}

// CMS API functions
export async function fetchSiteConfig(): Promise<SiteConfig> {
  const fallback: SiteConfig = {
    site_name: "Downtown Irwin",
    tagline: "Your Community, Your Downtown",
    contact_email: "info@irwinbpa.com",
    contact_phone: "(412) 555-0100",
    address: "Main Street, Irwin, PA 15642",
    events_calendar_embed: "",
  };
  
  return fetchWithCache<SiteConfig>(
    `${CMS_BASE_URL}?route=site`,
    CACHE_KEYS.site,
    fallback
  );
}

export async function fetchEvents(): Promise<CMSEvent[]> {
  return fetchWithCache<CMSEvent[]>(
    `${CMS_BASE_URL}?route=events`,
    CACHE_KEYS.events,
    []
  );
}

export async function fetchSponsorTiers(): Promise<SponsorTier[]> {
  return fetchWithCache<SponsorTier[]>(
    `${CMS_BASE_URL}?route=sponsorTiers`,
    CACHE_KEYS.sponsorTiers,
    []
  );
}

export async function fetchSponsorLogos(): Promise<SponsorLogosData> {
  const fallback: SponsorLogosData = {
    presenting: [],
    gold: [],
    silver: [],
    supporting: [],
  };
  
  // Check cache first
  const cached = getFromCache<SponsorLogosData>(CACHE_KEYS.sponsorLogos);
  if (cached) return cached;
  
  try {
    const response = await fetch(SPONSORS_LOGO_JSON_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    // Normalize data to ensure consistent SponsorLogo objects
    const normalizeSponsorArray = (arr: any[]): { name: string; logo_url?: string; website?: string }[] => {
      if (!Array.isArray(arr)) return [];
      return arr
        .filter(item => item != null)
        .map(item => {
          if (typeof item === 'string') {
            return { name: item, logo_url: '', website: '' };
          }
          return {
            name: item.name || '',
            logo_url: item.logo_url || '',
            website: item.website || ''
          };
        })
        .filter(item => item.name);
    };

    const normalizedData: SponsorLogosData = {
      presenting: normalizeSponsorArray(data.presenting),
      gold: normalizeSponsorArray(data.gold),
      silver: normalizeSponsorArray(data.silver),
      supporting: Array.isArray(data.supporting) 
        ? data.supporting.filter((s: any) => typeof s === 'string' && s.trim())
        : [],
    };
    
    setToCache(CACHE_KEYS.sponsorLogos, normalizedData);
    return normalizedData;
  } catch (error) {
    console.error(`Failed to fetch sponsor logos:`, error);
    return fallback;
  }
}

// Helper to get event by slug
export function findEventBySlug(events: CMSEvent[], slug: string): CMSEvent | undefined {
  return events.find(e => e.slug === slug);
}

// Helper to find hub events
export function findCarCruiseEvent(events: CMSEvent[]): CMSEvent | undefined {
  return events.find(e => e.is_car_cruise || e.slug.includes("car-cruise"));
}

export function findStreetMarketEvent(events: CMSEvent[]): CMSEvent | undefined {
  return events.find(e => e.is_street_market || e.slug.includes("street-market"));
}

export function findNightMarketEvent(events: CMSEvent[]): CMSEvent | undefined {
  return events.find(e => e.is_night_market || e.slug.includes("night-market"));
}

// Group events by status
export function groupEventsByStatus(events: CMSEvent[]): {
  open: CMSEvent[];
  upcoming: CMSEvent[];
  closed: CMSEvent[];
} {
  return {
    open: events.filter(e => e.status === "open"),
    upcoming: events.filter(e => e.status === "upcoming"),
    closed: events.filter(e => e.status === "closed"),
  };
}

// Clear all CMS cache
export function clearCMSCache(): void {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
