export type { 
  Announcement, 
  FeaturedEvent, 
  AdminData, 
  Event, 
  Sponsor, 
  CarCruiseSponsors,
  ContactForm 
} from "./schema";

// Site configuration from CMS
export interface SiteConfig {
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  events_calendar_embed: string;
  hero_image_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
}

// Event status types
export type EventStatus = "open" | "upcoming" | "closed";

// Event from CMS
export interface CMSEvent {
  id: string;
  slug: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description: string;
  image_url?: string;
  status: EventStatus;
  vendor_signup_url?: string;
  sponsor_url?: string;
  register_url?: string;
  vendor_cap?: number;
  vendor_count?: number;
  is_car_cruise?: boolean;
  is_street_market?: boolean;
  is_night_market?: boolean;
}

// Sponsor tier from CMS
export interface SponsorTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  square_url: string;
  order: number;
}

// Sponsor logo data from external endpoint
export interface SponsorLogo {
  name: string;
  logo_url?: string;
  website?: string;
}

export interface SponsorLogosData {
  presenting: SponsorLogo[];
  gold: SponsorLogo[];
  silver: SponsorLogo[];
  supporting: string[];
}

// Cache wrapper for localStorage
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export const EXTERNAL_URLS = {
  vendorSignupForm: 'https://forms.google.com/your-vendor-signup-form',
  eventsGoogleSheetJson: 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json',
  carCruiseSponsorsJson: '/api/sponsors.json',
  sponsorSquarePresenting: 'https://square.link/presenting-sponsor',
  sponsorSquareGold: 'https://square.link/gold-sponsor',
  sponsorSquareSilver: 'https://square.link/silver-sponsor',
  sponsorSquareSupporting: 'https://square.link/supporting-sponsor',
  eventsCalendarEmbed: 'YOUR_EVENTSCALENDAR_EMBED_CODE',
} as const;
