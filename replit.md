# Downtown Irwin / IBPA Website

## Overview
A production-ready community website for Downtown Irwin and the Irwin Business & Professional Association (IBPA). Built with React + Vite for static deployment to GitHub Pages. Content is driven by JSON from a Google Apps Script CMS endpoint.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: Wouter (client-side)
- **Data Fetching**: TanStack Query with localStorage caching
- **Build**: Static site output for GitHub Pages

## Project Structure

```
client/
  src/
    config.ts              # CMS endpoints configuration
    hooks/
      useCMS.ts            # React Query hooks for CMS data
    lib/
      cms.ts               # CMS fetching with localStorage cache
    components/
      Layout.tsx           # Header, Footer, Navigation
      SEO.tsx              # Per-page meta tags
      ui/                  # shadcn/ui components
    pages/
      Home.tsx             # Homepage with hero, events, CTAs
      Events.tsx           # Events index (grouped by status)
      EventDetail.tsx      # Event detail page (/events/:slug)
      Calendar.tsx         # EventsCalendar.co embed from CMS
      Vendors.tsx          # Per-event vendor signup links
      Sponsors.tsx         # Tiers from CMS + logo fetch
      CarCruise.tsx        # Car Cruise hub page
      StreetMarket.tsx     # Street Market hub page
      NightMarket.tsx      # Night Market hub page
      Contact.tsx          # Contact form
    App.tsx                # Routes and providers

shared/
  types.ts                 # TypeScript interfaces for CMS data
```

## Pages
- **Home** (`/`) - Hero, signature events, upcoming events, CTAs
- **Events** (`/events`) - Event cards grouped by status (Open/Upcoming/Closed)
- **Event Detail** (`/events/:slug`) - Individual event with vendor/sponsor/register buttons
- **Calendar** (`/calendar`) - EventsCalendar.co embed from CMS
- **Vendors** (`/vendors`) - Per-event vendor signup links
- **Sponsors** (`/sponsors`) - Tier cards from CMS + sponsor logos section
- **Car Cruise** (`/car-cruise`) - Hub page for car cruise event
- **Street Market** (`/street-market`) - Hub page for street market
- **Night Market** (`/night-market`) - Hub page for night market
- **Contact** (`/contact`) - Contact form

## CMS Configuration

### Endpoints (in `client/src/config.ts`)
```typescript
CMS_BASE_URL = "<APPS_SCRIPT_WEB_APP_URL>"
SPONSORS_LOGO_JSON_URL = "https://jotform-sponsor-fetch.replit.app/api/sponsors.json"
```

### CMS Routes
- `${CMS_BASE_URL}?route=site` - Site configuration (name, tagline, contact, calendar embed)
- `${CMS_BASE_URL}?route=events` - Events list with status, vendor/sponsor URLs
- `${CMS_BASE_URL}?route=sponsorTiers` - Sponsorship tiers with benefits and Square URLs

### Caching
- All CMS responses are cached in localStorage for 10 minutes
- React Query handles cache invalidation and refetching

## Expected CMS Data Structures

### Site Config
```json
{
  "site_name": "Downtown Irwin",
  "tagline": "Your Community, Your Downtown",
  "contact_email": "info@irwinbpa.com",
  "contact_phone": "(412) 555-0100",
  "address": "Main Street, Irwin, PA 15642",
  "events_calendar_embed": "<iframe src='...'></iframe>",
  "hero_title": "Welcome to Downtown Irwin",
  "hero_subtitle": "..."
}
```

### Events
```json
[
  {
    "id": "1",
    "slug": "car-cruise-2026",
    "title": "Irwin Car Cruise 2026",
    "date": "August 15, 2026",
    "time": "10:00 AM - 8:00 PM",
    "location": "Main Street, Irwin",
    "description": "Annual car cruise event...",
    "status": "upcoming",
    "vendor_signup_url": "https://...",
    "sponsor_url": "https://...",
    "register_url": "https://...",
    "vendor_cap": 100,
    "vendor_count": 45,
    "is_car_cruise": true
  }
]
```

### Sponsor Tiers
```json
[
  {
    "id": "presenting",
    "name": "Presenting Sponsor",
    "price": 2500,
    "benefits": ["Premier logo placement", "VIP tent", "..."],
    "square_url": "https://square.link/...",
    "order": 1
  }
]
```

### Sponsor Logos (from jotform endpoint)
```json
{
  "presenting": [{"name": "Sponsor A", "logo_url": "...", "website": "..."}],
  "gold": [...],
  "silver": [...],
  "supporting": ["Sponsor Name 1", "Sponsor Name 2"]
}
```

## Development

```bash
npm run dev    # Start development server on port 5000
npm run build  # Build static site to dist/
```

## GitHub Pages Deployment

1. Build the static site:
   ```bash
   npm run build
   ```

2. Copy index.html to 404.html for client-side routing:
   ```bash
   cp dist/index.html dist/404.html
   ```

3. Deploy the `dist/` folder to GitHub Pages

4. If using a custom domain, add a CNAME file to `dist/`

## Key Features

- **CMS-Driven Content**: All events, sponsors, and site config from Google Sheets
- **Status-Based Events**: Events grouped as Open, Upcoming, or Closed
- **Per-Event Actions**: Vendor signup, sponsor, and register buttons per event
- **Hub Pages**: Dedicated pages for Car Cruise, Street Market, Night Market
- **Responsive Design**: Mobile-first with hamburger menu
- **SEO**: Per-page title, description, and Open Graph tags
- **Caching**: 10-minute localStorage cache for CMS data

## Styling
- Clean, civic/professional design
- Blue primary color (#2b5a8a)
- Mobile-first responsive layout
- shadcn/ui component library
