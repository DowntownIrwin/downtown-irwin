export type { 
  Announcement, 
  FeaturedEvent, 
  AdminData, 
  Event, 
  Sponsor, 
  CarCruiseSponsors,
  ContactForm 
} from "./schema";

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
