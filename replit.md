# Downtown Irwin / IBPA Website

## Overview
A production-ready community website for Downtown Irwin and the Irwin Business & Professional Association (IBPA). Built with React + Vite for static deployment. Content is managed via Decap CMS (formerly Netlify CMS) with a Wix-like admin dashboard.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: Wouter (client-side)
- **CMS**: Decap CMS with Netlify Identity + Git Gateway
- **Data**: JSON content files in `client/src/content/`
- **Build**: Static site output

## Project Structure

```
client/
  public/
    admin/
      index.html           # Decap CMS admin dashboard
      config.yml           # CMS collection configuration
    uploads/               # Media uploads from CMS
  src/
    content/               # Editable JSON content (managed by Decap CMS)
      events/              # Event JSON files
      pages/               # Page content (home, about, vendors, contact)
      sponsors/            # Sponsor tier configuration
      galleries/           # Photo gallery entries
      site.json            # Global site settings
    hooks/
      useCMS.ts            # React Query hooks for content
    lib/
      content.ts           # Content imports and helpers
      cms.ts               # External API fetching (sponsor logos)
    components/
      Layout.tsx           # Header, Footer, Navigation
      SEO.tsx              # Per-page meta tags
      ui/                  # shadcn/ui components
    pages/
      Home.tsx             # Homepage with hero, events, CTAs
      Events.tsx           # Events index with search
      EventDetail.tsx      # Event detail page (/events/:slug)
      Calendar.tsx         # EventsCalendar.co embed
      Vendors.tsx          # Per-event vendor signup links
      Sponsors.tsx         # Tiers + sponsor logos
      CarCruise.tsx        # Car Cruise hub page
      StreetMarket.tsx     # Street Market hub page
      NightMarket.tsx      # Night Market hub page
      Contact.tsx          # Contact form
    App.tsx                # Routes and providers

shared/
  types.ts                 # TypeScript interfaces
```

## Pages
- **Home** (`/`) - Hero, signature events, upcoming events, CTAs
- **Events** (`/events`) - Event cards with search, grouped by status
- **Event Detail** (`/events/:slug`) - Individual event details
- **Calendar** (`/calendar`) - EventsCalendar.co embed
- **Vendors** (`/vendors`) - Per-event vendor signup links
- **Sponsors** (`/sponsors`) - Tier cards + sponsor logos
- **Car Cruise** (`/car-cruise`) - Hub page for car cruise event
- **Street Market** (`/street-market`) - Hub page for street market
- **Night Market** (`/night-market`) - Hub page for night market
- **Contact** (`/contact`) - Contact form
- **Admin** (`/admin`) - Decap CMS dashboard (requires login)

## Decap CMS Admin Dashboard

### Accessing the Admin
Navigate to `/admin` to access the content management system. Non-technical editors can:
- Add/edit/delete events
- Update page content (home, about, vendors, contact)
- Manage sponsor tiers and pricing
- Create photo galleries with links
- Update site settings

### How It Works
1. Editors log in via Netlify Identity
2. Make changes in the visual editor
3. Click "Publish" to save
4. Changes are committed directly to GitHub
5. GitHub Actions rebuilds and deploys the site automatically

## Content Structure

### Events (`client/src/content/events/*.json`)
```json
{
  "id": "car-cruise-2026",
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
  "is_car_cruise": true
}
```

### Sponsor Tiers (`client/src/content/sponsors/tiers.json`)
```json
{
  "tiers": [
    {
      "id": "presenting",
      "name": "Presenting Sponsor",
      "price": 2500,
      "benefits": ["Premier logo placement", "VIP tent", "..."],
      "square_url": "https://square.link/...",
      "order": 1
    }
  ]
}
```

### Site Settings (`client/src/content/site.json`)
```json
{
  "site_name": "Downtown Irwin",
  "tagline": "The biggest little town in Pennsylvania",
  "contact_email": "jmsmaligo@gmail.com",
  "contact_phone": "(412) 555-0100",
  "address": "Main Street, Irwin, PA 15642",
  "facebook_url": "https://www.facebook.com/...",
  "instagram_url": ""
}
```

## Development

```bash
npm run dev    # Start development server on port 5000
npm run build  # Build static site to dist/
npm run check  # TypeScript type checking
```

## Netlify Setup for Decap CMS (One-Time)

### 1. Deploy to Netlify
1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`
5. Deploy the site

### 2. Enable Netlify Identity
1. Go to Site settings → Identity
2. Click "Enable Identity"
3. Under Registration, select **"Invite only"** (important for security)
4. Under External providers, optionally enable Google/GitHub login

### 3. Enable Git Gateway
1. Go to Site settings → Identity → Services
2. Click "Enable Git Gateway"
3. This allows the CMS to commit to your GitHub repo

### 4. Invite Editors
1. Go to Identity tab
2. Click "Invite users"
3. Enter email addresses of content editors
4. They'll receive an invitation to create an account

### 5. Set Roles (Optional)
For more granular control:
1. Go to Site settings → Identity → Registration
2. Set up roles if you want different permission levels

### Required GitHub Permissions
The Git Gateway needs these permissions on your repo:
- Read and write access to code
- Read access to metadata

## Publishing Workflow

### Content Updates (No Deploy Needed)
When editors save changes in the CMS:
1. Changes are committed to GitHub automatically
2. GitHub Actions triggers a rebuild
3. Site is deployed with new content

### Code Changes
For code/design changes, push to GitHub:
```bash
git add -A && git commit -m "Update" && git push origin main
```

Or use the publish script:
```bash
bash scripts/publish.sh
```

## Key Features

- **Wix-like Admin**: Visual CMS at `/admin` for non-technical editors
- **No Git Knowledge Required**: Editors just click Publish
- **Automatic Deploys**: GitHub Actions rebuilds on content changes
- **Event Search**: Users can search events by title, description, location
- **Back to Top**: Floating button for easy navigation
- **Status-Based Events**: Events grouped as Open, Upcoming, or Closed
- **Per-Event Actions**: Vendor signup, sponsor, and register buttons
- **Hub Pages**: Dedicated pages for Car Cruise, Street Market, Night Market
- **Responsive Design**: Mobile-first with hamburger menu
- **SEO**: Per-page title, description, and Open Graph tags

## Styling
- Clean, civic/professional design
- Blue primary color (#2b5a8a)
- Mobile-first responsive layout
- shadcn/ui component library

## Live Site
GitHub Pages: https://downtownirwin.github.io/downtown-irwin/
