// Content types for the CMS
export interface CMSEvent {
  slug: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  timeText?: string;
  location?: string;
  description: string;
  status: "open" | "upcoming" | "closed";
  cap?: number | null;
  vendorUrl?: string | null;
  sponsorUrl?: string | null;
  attendeeUrl?: string | null;
  heroImage?: string | null;
  gallerySlug?: string | null;
  featured: boolean;
  eventType: "car-cruise" | "street-market" | "night-market" | "other";
}

export interface SectionButton {
  text: string;
  url: string;
  style: "primary" | "secondary" | "outline";
}

export interface HeroSection {
  type: "hero";
  headline: string;
  subheadline?: string;
  backgroundImage?: string;
  buttons?: SectionButton[];
}

export interface TextSection {
  type: "text";
  heading?: string;
  body: string;
  alignment: "left" | "center" | "right";
}

export interface PhotoGridImage {
  image: string;
  caption?: string;
  linkUrl?: string;
}

export interface PhotoGridSection {
  type: "photoGrid";
  heading?: string;
  columns: "2" | "3" | "4";
  images: PhotoGridImage[];
}

export interface CTASection {
  type: "cta";
  heading: string;
  description?: string;
  backgroundColor: "default" | "primary" | "accent" | "muted";
  buttons?: SectionButton[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSection {
  type: "faq";
  heading: string;
  items: FAQItem[];
}

export interface EmbedSection {
  type: "embed";
  heading?: string;
  embedHtml: string;
  maxWidth: "full" | "large" | "medium" | "small";
}

export interface SponsorsSection {
  type: "sponsors";
  heading: string;
  showTierCards: boolean;
  showLogos: boolean;
}

export interface EventsListSection {
  type: "eventsList";
  heading: string;
  filterType: "all" | "car-cruise" | "street-market" | "night-market";
  featuredOnly: boolean;
  maxEvents: number;
}

export interface GalleriesListSection {
  type: "galleriesList";
  heading: string;
  featuredOnly: boolean;
  maxGalleries: number;
}

export type PageSection =
  | HeroSection
  | TextSection
  | PhotoGridSection
  | CTASection
  | FAQSection
  | EmbedSection
  | SponsorsSection
  | EventsListSection
  | GalleriesListSection;

export interface CMSPage {
  title: string;
  slug: string;
  navLabel?: string;
  showInNav: boolean;
  navOrder?: number;
  template: "landing" | "basic" | "gallery" | "eventHub";
  sections: PageSection[];
}

export interface CMSGallery {
  slug: string;
  title: string;
  description?: string;
  sourceType: "uploaded" | "drive" | "facebook";
  sourceUrl?: string | null;
  featured: boolean;
  coverImage?: string | null;
  photos: Array<{
    image: string;
    caption?: string;
  }>;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl?: string;
  instagramUrl?: string;
  logo?: string | null;
  favicon?: string | null;
}

export interface SponsorTier {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  squareUrl: string;
  order: number;
}

// Import all content files
import siteSettings from "@/content/site.json";
import sponsorTiersData from "@/content/sponsors/tiers.json";

// Import pages
import homePage from "@/content/pages/home.json";
import aboutPage from "@/content/pages/about.json";
import eventsPage from "@/content/pages/events.json";
import carCruisePage from "@/content/pages/car-cruise.json";
import streetMarketPage from "@/content/pages/street-market.json";
import nightMarketPage from "@/content/pages/night-market.json";
import vendorsPage from "@/content/pages/vendors.json";
import sponsorsPage from "@/content/pages/sponsors.json";
import calendarPage from "@/content/pages/calendar.json";
import contactPage from "@/content/pages/contact.json";

// Dynamic imports using Vite's glob import
// This automatically loads all JSON files from these directories
const eventModules = import.meta.glob("@/content/events/*.json", { eager: true });
const galleryModules = import.meta.glob("@/content/galleries/*.json", { eager: true });

// Exports
export const site = siteSettings as SiteSettings;
export const sponsorTiers = sponsorTiersData.tiers as SponsorTier[];

export const allPages: CMSPage[] = [
  homePage as CMSPage,
  aboutPage as CMSPage,
  eventsPage as CMSPage,
  carCruisePage as CMSPage,
  streetMarketPage as CMSPage,
  nightMarketPage as CMSPage,
  vendorsPage as CMSPage,
  sponsorsPage as CMSPage,
  calendarPage as CMSPage,
  contactPage as CMSPage,
];

// Dynamically load all events from the events folder
export const allEvents: CMSEvent[] = Object.values(eventModules).map(
  (mod: any) => mod.default as CMSEvent
);

// Dynamically load all galleries from the galleries folder
export const allGalleries: CMSGallery[] = Object.values(galleryModules).map(
  (mod: any) => mod.default as CMSGallery
);

// Helper functions
export function getPageBySlug(slug: string): CMSPage | undefined {
  return allPages.find(p => p.slug === slug);
}

export function getEventBySlug(slug: string): CMSEvent | undefined {
  return allEvents.find(e => e.slug === slug);
}

export function getGalleryBySlug(slug: string): CMSGallery | undefined {
  return allGalleries.find(g => g.slug === slug);
}

export function getNavPages(): CMSPage[] {
  return allPages
    .filter(p => p.showInNav)
    .sort((a, b) => (a.navOrder || 100) - (b.navOrder || 100));
}

export function getEventsByType(type: CMSEvent["eventType"]): CMSEvent[] {
  return allEvents.filter(e => e.eventType === type);
}

export function getFeaturedEvents(): CMSEvent[] {
  return allEvents.filter(e => e.featured);
}

export function getEventsByStatus(status: CMSEvent["status"]): CMSEvent[] {
  return allEvents.filter(e => e.status === status);
}

export function groupEventsByStatus() {
  return {
    open: allEvents.filter(e => e.status === "open"),
    upcoming: allEvents.filter(e => e.status === "upcoming"),
    closed: allEvents.filter(e => e.status === "closed"),
  };
}

export function getFeaturedGalleries(): CMSGallery[] {
  return allGalleries.filter(g => g.featured);
}
