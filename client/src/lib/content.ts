// Content types for the CMS

// Scheduling fields for time-based visibility
export interface SchedulingFields {
  visibleFrom?: string | null;
  visibleUntil?: string | null;
  registrationOpensAt?: string | null;
  registrationClosesAt?: string | null;
}

export interface EventLinks {
  vendorUrl?: string | null;
  sponsorUrl?: string | null;
  attendeeUrl?: string | null;
  forceShowButtons?: boolean;
}

// New nested CMS event structure
export interface CMSEventNested {
  basics?: {
    title: string;
    startDate: string;
    endDate?: string | null;
    timeText?: string;
    location?: string;
    eventType: "car-cruise" | "street-market" | "night-market" | "other";
    status: "open" | "upcoming" | "closed";
  };
  content?: {
    description: string;
    heroImage?: string | null;
  };
  links?: EventLinks;
  scheduling?: SchedulingFields;
  options?: {
    featured: boolean;
    cap?: number | null;
    gallerySlug?: string | null;
  };
}

// Normalized event interface used throughout the app
export interface CMSEvent {
  slug?: string;
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
  forceShowButtons?: boolean;
  links?: EventLinks;
  heroImage?: string | null;
  gallerySlug?: string | null;
  featured: boolean;
  eventType: "car-cruise" | "street-market" | "night-market" | "other";
  // Scheduling fields
  visibleFrom?: string | null;
  visibleUntil?: string | null;
  registrationOpensAt?: string | null;
  registrationClosesAt?: string | null;
}

// Announcement type
export interface CMSAnnouncement {
  slug?: string;
  title: string;
  body: string;
  image?: string | null;
  link?: string | null;
  linkText?: string;
  scheduling?: {
    publishAt?: string | null;
    expireAt?: string | null;
    pinned?: boolean;
  };
  // Flattened for convenience
  publishAt?: string | null;
  expireAt?: string | null;
  pinned?: boolean;
}

// Helper to get URLs from event (supports both old flat and new nested structure)
export function getEventUrls(event: CMSEvent): EventLinks {
  return {
    vendorUrl: event.links?.vendorUrl || event.vendorUrl || null,
    sponsorUrl: event.links?.sponsorUrl || event.sponsorUrl || null,
    attendeeUrl: event.links?.attendeeUrl || event.attendeeUrl || null,
    forceShowButtons: event.links?.forceShowButtons || event.forceShowButtons || false,
  };
}

// Time-based visibility helpers
export function isEventVisible(event: CMSEvent): boolean {
  const now = new Date();
  
  if (event.visibleFrom) {
    const visibleFrom = new Date(event.visibleFrom);
    if (now < visibleFrom) return false;
  }
  
  if (event.visibleUntil) {
    const visibleUntil = new Date(event.visibleUntil);
    if (now > visibleUntil) return false;
  }
  
  return true;
}

// Get the effective status based on scheduling
export function getEffectiveStatus(event: CMSEvent): "open" | "upcoming" | "closed" {
  const now = new Date();
  
  // Check registration opens
  if (event.registrationOpensAt) {
    const opensAt = new Date(event.registrationOpensAt);
    if (now < opensAt) return "upcoming";
  }
  
  // Check registration closes
  if (event.registrationClosesAt) {
    const closesAt = new Date(event.registrationClosesAt);
    if (now > closesAt) return "closed";
  }
  
  // If registrationOpensAt is set and we're past it, and no closesAt or we're before it
  if (event.registrationOpensAt) {
    const opensAt = new Date(event.registrationOpensAt);
    if (now >= opensAt) {
      if (!event.registrationClosesAt) return "open";
      const closesAt = new Date(event.registrationClosesAt);
      if (now <= closesAt) return "open";
    }
  }
  
  // Fall back to manual status
  return event.status;
}

// Check if registration buttons should be shown
export function shouldShowRegistrationButtons(event: CMSEvent): boolean {
  const urls = getEventUrls(event);
  
  // Force show if editor set it
  if (urls.forceShowButtons) return true;
  
  const effectiveStatus = getEffectiveStatus(event);
  return effectiveStatus === "open";
}

// Get registration status message
export function getRegistrationMessage(event: CMSEvent): string | null {
  const now = new Date();
  
  if (event.registrationOpensAt) {
    const opensAt = new Date(event.registrationOpensAt);
    if (now < opensAt) {
      return `Registration opens ${opensAt.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
    }
  }
  
  if (event.registrationClosesAt) {
    const closesAt = new Date(event.registrationClosesAt);
    if (now > closesAt) {
      return "Registration closed";
    }
  }
  
  return null;
}

// Check if announcement is visible
export function isAnnouncementVisible(announcement: CMSAnnouncement): boolean {
  const now = new Date();
  const publishAt = announcement.scheduling?.publishAt || announcement.publishAt;
  const expireAt = announcement.scheduling?.expireAt || announcement.expireAt;
  
  if (publishAt) {
    const publishDate = new Date(publishAt);
    if (now < publishDate) return false;
  }
  
  if (expireAt) {
    const expireDate = new Date(expireAt);
    if (now > expireDate) return false;
  }
  
  return true;
}

// Generate slug from title if not present
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Normalize event from CMS format to flat format
function normalizeEvent(rawEvent: any, filename: string): CMSEvent {
  // Handle new nested structure
  if (rawEvent.basics) {
    const nested = rawEvent as CMSEventNested;
    const slug = slugify(nested.basics?.title || '') || filename.replace('.json', '');
    return {
      slug,
      title: nested.basics?.title || '',
      startDate: nested.basics?.startDate || '',
      endDate: nested.basics?.endDate,
      timeText: nested.basics?.timeText,
      location: nested.basics?.location,
      eventType: nested.basics?.eventType || 'other',
      status: nested.basics?.status || 'upcoming',
      description: nested.content?.description || '',
      heroImage: nested.content?.heroImage,
      vendorUrl: nested.links?.vendorUrl,
      sponsorUrl: nested.links?.sponsorUrl,
      attendeeUrl: nested.links?.attendeeUrl,
      forceShowButtons: nested.links?.forceShowButtons,
      links: nested.links,
      visibleFrom: nested.scheduling?.visibleFrom,
      visibleUntil: nested.scheduling?.visibleUntil,
      registrationOpensAt: nested.scheduling?.registrationOpensAt,
      registrationClosesAt: nested.scheduling?.registrationClosesAt,
      featured: nested.options?.featured || false,
      cap: nested.options?.cap,
      gallerySlug: nested.options?.gallerySlug,
    };
  }
  
  // Handle old flat structure
  const event = rawEvent as CMSEvent;
  const slug = event.slug || slugify(event.title) || filename.replace('.json', '');
  return { ...event, slug };
}

// Normalize gallery to ensure it has a slug
function normalizeGallery(gallery: CMSGallery, filename: string): CMSGallery {
  const slug = gallery.slug || slugify(gallery.title) || filename.replace('.json', '');
  return { ...gallery, slug };
}

// Normalize announcement
function normalizeAnnouncement(raw: any, filename: string): CMSAnnouncement {
  const slug = slugify(raw.title || '') || filename.replace('.json', '');
  return {
    slug,
    title: raw.title || '',
    body: raw.body || '',
    image: raw.image,
    link: raw.link,
    linkText: raw.linkText || 'Learn More',
    publishAt: raw.scheduling?.publishAt || raw.publishAt,
    expireAt: raw.scheduling?.expireAt || raw.expireAt,
    pinned: raw.scheduling?.pinned || raw.pinned || false,
    scheduling: raw.scheduling,
  };
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

export interface AnnouncementsSection {
  type: "announcements";
  heading: string;
  maxAnnouncements: number;
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
  | GalleriesListSection
  | AnnouncementsSection;

export interface CMSPage {
  title: string;
  slug?: string;
  navLabel?: string;
  showInNav: boolean;
  navOrder?: number;
  parentMenu?: string | null;
  template: "landing" | "basic" | "gallery" | "eventHub";
  sections: PageSection[];
  // New nested menu structure
  menu?: {
    showInNav: boolean;
    navLabel?: string;
    parentMenu?: string | null;
    navOrder?: number;
  };
}

// Normalize page to handle nested menu structure
function normalizePage(raw: any, filename: string): CMSPage {
  const slug = raw.slug || slugify(raw.title || '') || filename.replace('.json', '');
  
  // Handle nested menu structure
  if (raw.menu) {
    return {
      ...raw,
      slug,
      showInNav: raw.menu.showInNav ?? true,
      navLabel: raw.menu.navLabel || raw.title,
      parentMenu: raw.menu.parentMenu,
      navOrder: raw.menu.navOrder || 100,
    };
  }
  
  return { ...raw, slug };
}

export interface CMSGallery {
  slug: string;
  title: string;
  description?: string;
  featured: boolean;
  coverImage?: string | null;
  photos?: Array<{
    image: string;
    caption?: string;
  }>;
  googleDriveUrl?: string | null;
  // Legacy fields for backward compatibility
  sourceType?: "uploaded" | "drive" | "facebook";
  sourceUrl?: string | null;
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

// Dynamic imports using Vite's glob import
// This automatically loads all JSON files from these directories
const pageModules = import.meta.glob("@/content/pages/*.json", { eager: true });
const eventModules = import.meta.glob("@/content/events/*.json", { eager: true });
const galleryModules = import.meta.glob("@/content/galleries/*.json", { eager: true });
const announcementModules = import.meta.glob("@/content/announcements/*.json", { eager: true });

// Helper to extract filename from path
function getFilename(path: string): string {
  return path.split('/').pop() || '';
}

// Exports
export const site = siteSettings as SiteSettings;
export const sponsorTiers = sponsorTiersData.tiers as SponsorTier[];

// Dynamically load all pages from the pages folder
export const allPages: CMSPage[] = Object.entries(pageModules).map(
  ([path, mod]: [string, any]) => normalizePage(mod.default, getFilename(path))
);

// Dynamically load all events from the events folder (with normalization)
export const allEvents: CMSEvent[] = Object.entries(eventModules).map(
  ([path, mod]: [string, any]) => normalizeEvent(mod.default, getFilename(path))
);

// Dynamically load all galleries from the galleries folder (with slug normalization)
export const allGalleries: CMSGallery[] = Object.entries(galleryModules).map(
  ([path, mod]: [string, any]) => normalizeGallery(mod.default as CMSGallery, getFilename(path))
);

// Dynamically load all announcements
export const allAnnouncements: CMSAnnouncement[] = Object.entries(announcementModules).map(
  ([path, mod]: [string, any]) => normalizeAnnouncement(mod.default, getFilename(path))
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

// Get gallery by title (used for relation field lookups)
export function getGalleryByTitle(title: string): CMSGallery | undefined {
  return allGalleries.find(g => g.title === title);
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

// Get visible events (respects scheduling)
export function getVisibleEvents(): CMSEvent[] {
  return allEvents.filter(isEventVisible);
}

// Get visible events with effective status calculated
export function getVisibleEventsWithStatus(): (CMSEvent & { effectiveStatus: "open" | "upcoming" | "closed" })[] {
  return getVisibleEvents().map(e => ({
    ...e,
    effectiveStatus: getEffectiveStatus(e),
  }));
}

export function groupEventsByStatus() {
  const visibleEvents = getVisibleEvents();
  return {
    open: visibleEvents.filter(e => getEffectiveStatus(e) === "open"),
    upcoming: visibleEvents.filter(e => getEffectiveStatus(e) === "upcoming"),
    closed: visibleEvents.filter(e => getEffectiveStatus(e) === "closed"),
  };
}

export function getFeaturedGalleries(): CMSGallery[] {
  return allGalleries.filter(g => g.featured);
}

// Get visible announcements (respects scheduling), sorted by pinned first then newest
export function getVisibleAnnouncements(): CMSAnnouncement[] {
  return allAnnouncements
    .filter(isAnnouncementVisible)
    .sort((a, b) => {
      // Pinned first
      const aPinned = a.scheduling?.pinned || a.pinned || false;
      const bPinned = b.scheduling?.pinned || b.pinned || false;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      // Then by publish date (newest first)
      const aDate = new Date(a.publishAt || 0);
      const bDate = new Date(b.publishAt || 0);
      return bDate.getTime() - aDate.getTime();
    });
}
