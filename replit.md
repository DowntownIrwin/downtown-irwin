# Downtown Irwin / IBPA Website

## Overview
A responsive community website for Downtown Irwin and the Irwin Business & Professional Association (IBPA). Features community events, the Irwin Car Cruise, vendor/sponsor information, and an admin panel.

## Project Structure

```
client/                    # Frontend React application
  src/
    components/
      Layout.tsx          # Header, Footer, and main layout
      ui/                 # shadcn/ui components
    pages/
      Home.tsx            # Homepage with hero, announcements, features
      About.tsx           # About IBPA page
      Events.tsx          # Events listing page
      Calendar.tsx        # Calendar embed placeholder
      Vendors.tsx         # Vendor signup information
      Sponsors.tsx        # Sponsorship tiers and benefits
      CarCruise.tsx       # Irwin Car Cruise page with sponsors
      Contact.tsx         # Contact form
      Admin.tsx           # Admin panel (passcode protected)
    App.tsx               # Main app with routes

server/                    # Backend Express application
  routes.ts               # API routes for admin, events, contact
  storage.ts              # In-memory storage for admin data

shared/                    # Shared types and schemas
  schema.ts               # Zod schemas
  types.ts                # TypeScript types and external URL constants
```

## Key Features

### Pages
- **Home**: Hero section, announcements banner, feature cards, featured events, CTA
- **About**: Mission, history, values, membership info
- **Events**: Event cards from API (ready for Google Sheets integration)
- **Calendar**: EventsCalendar.co embed placeholder
- **Vendors**: Info and external signup form link
- **Sponsors**: 4 tiers (Presenting, Gold, Silver, Supporting) with benefits
- **Car Cruise**: Event info, sponsor tiers, sponsors section from JSON
- **Contact**: Form with validation
- **Admin**: Passcode-protected admin for announcements and featured events

### API Endpoints
- `GET /api/admin/data` - Get admin data (announcements, featured events)
- `POST /api/admin/verify` - Verify admin passcode
- `POST /api/admin/data` - Save admin data (requires X-Admin-Passcode header)
- `GET /api/events` - Get all events
- `GET /api/sponsors.json` - Get car cruise sponsors
- `POST /api/contact` - Submit contact form

## Environment Variables
- `ADMIN_PASSCODE`: Password for admin access (default: "irwin2026")

## External URLs (configurable in shared/types.ts)
- Vendor signup form (Google Forms placeholder)
- Events Google Sheet JSON endpoint
- EventsCalendar.co embed code
- Square payment links for sponsor tiers

## Running the App
```bash
npm run dev    # Development server on port 5000
```

## Recent Changes
- Initial build: Complete 8-page community website with admin panel
- Responsive design with mobile navigation
- Professional civic/community styling with blue primary color
- Admin panel for managing homepage content
