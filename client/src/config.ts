// CMS Configuration
// Replace with your actual Google Apps Script Web App URL
export const CMS_BASE_URL = "<APPS_SCRIPT_WEB_APP_URL>";

// Sponsor logos JSON endpoint (existing)
export const SPONSORS_LOGO_JSON_URL = "https://jotform-sponsor-fetch.replit.app/api/sponsors.json";

// Cache duration in milliseconds (10 minutes)
export const CACHE_DURATION_MS = 10 * 60 * 1000;

// Cache keys for localStorage
export const CACHE_KEYS = {
  site: "ibpa_cache_site",
  events: "ibpa_cache_events",
  sponsorTiers: "ibpa_cache_sponsorTiers",
  sponsorLogos: "ibpa_cache_sponsorLogos",
} as const;
