# Downtown Irwin App

## Overview
Community web application for Downtown Irwin, Pennsylvania featuring information from the Irwin Business & Professional Association (IBPA) and multiple event programs (Car Cruise, Night Market, Street Market). Built with React + Express + PostgreSQL. Includes admin authentication system for managing events, businesses, sponsors, vendors, and content. Mobile app available in `mobile/` directory.

## Recent Changes
- Major navigation overhaul: replaced sidebar with top navigation bar, desktop dropdown menus, mobile hamburger menu
- Events dropdown submenu: Car Cruise links externally to irwincarcruise.org, Night Market and Street Market have dedicated pages
- Replaced custom vendor registration forms with embedded JotForm (form ID: 260276438583061) on Night Market and Street Market pages
- Added vendor registration system with approve/deny workflow for Night Market and Street Market
- Extended sponsors table with eventType and sponsorImageUrl for multi-event sponsor management
- Created Night Market page with event info, vendor registration form, and sponsorship section with Square payment links
- Created Street Market page with event info, vendor registration form, and sponsorship section with Square payment links
- Added Square checkout payment links for Car Cruise sponsorship levels (presenting: $600, gold: $400, silver: $200)
- Square merchant ID: MLG8T1X8MJFZT
- Added admin Vendors tab for managing vendor registrations with event/status filters and approve/deny workflow
- Enhanced admin Sponsors form with eventType selector and sponsor image upload
- Added photo albums feature: create albums, drag-and-drop multi-photo upload, public gallery with lightbox viewer
- Photo albums displayed as "Past Events" section at bottom of Events page
- GitHub integration: push project code to GitHub from admin dashboard
- Default admin credentials: username `admin`, password `admin123`

## Architecture

### Frontend (React + Vite) — Web App
- **Pages**: Home, Events, Night Market, Street Market, Car Cruise Register, Sponsorship, Businesses, About, Contact, Admin Login, Admin Dashboard
- **Navigation**: Top navigation bar with dropdown menus (Events submenu), mobile hamburger menu using shadcn Sheet
- **Routing**: wouter
- **State**: @tanstack/react-query
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Warm community-focused palette (primary: warm red-orange, accent: blue)
- **Key Components**: `client/src/components/navigation.tsx` (top nav), `client/src/components/footer.tsx`

### Mobile App (React Native + Expo) — `mobile/` directory
- **Screens**: Home, Events, Car Cruise, Vehicle Registration, Business Directory, More, About IBPA, Sponsorship, Contact
- **Navigation**: React Navigation (bottom tabs + native stacks)
- **Icons**: @expo/vector-icons (Ionicons)
- **API**: Connects to Express backend via REST API with CORS
- **Build**: Expo EAS Build for iOS/Android app store submissions

### Backend (Express)
- **Public API Routes**: `/api/events`, `/api/businesses`, `/api/sponsors`, `/api/sponsors/event/:eventType`, `/api/vehicle-registrations`, `/api/vendor-registrations`, `/api/sponsorship-inquiries`, `/api/contact`, `/api/photo-albums`, `/api/photo-albums/:id`, `/api/photo-albums/:id/photos`
- **Auth Routes**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Admin Routes** (require auth): `/api/admin/events`, `/api/admin/businesses`, `/api/admin/sponsors`, `/api/admin/upload`, `/api/admin/vehicle-registrations`, `/api/admin/vendor-registrations`, `/api/admin/sponsorship-inquiries`, `/api/admin/contact-messages`, `/api/admin/photo-albums`, `/api/admin/album-photos`
- **GitHub Routes** (require auth): `/api/admin/github/user`, `/api/admin/github/repos`, `/api/admin/github/push`
- **Authentication**: Session-based with express-session + connect-pg-simple (PostgreSQL session store) + bcrypt password hashing
- **Image Uploads**: multer-based, stored in `server/uploads/`, served at `/uploads/*`
- **Database**: PostgreSQL with Drizzle ORM
- **Seed Data**: Events, sponsors, businesses, and default admin user auto-seeded on startup
- **CORS**: Enabled for mobile app access

### Data Models
- `events` - Community events with categories and featured flag
- `vehicleRegistrations` - Car cruise vehicle registration entries
- `vendorRegistrations` - Night Market / Street Market vendor applications with status (pending/approved/denied)
- `sponsorshipInquiries` - Sponsorship interest form submissions
- `sponsors` - Event sponsors with eventType field (car-cruise, night-market, street-market, general)
- `businesses` - Downtown business directory
- `contactMessages` - General contact form submissions
- `photoAlbums` - Photo albums for past events
- `albumPhotos` - Individual photos within albums

### Key Files
- `shared/schema.ts` - All Drizzle schemas and Zod validators
- `server/routes.ts` - API endpoints
- `server/storage.ts` - Database storage layer
- `server/seed.ts` - Seed data for initial load
- `client/src/lib/constants.ts` - IBPA info, car cruise details, sponsorship levels, Night Market/Street Market info, vendor categories, Square payment links
- `client/src/components/navigation.tsx` - Top navigation with Events dropdown
- `client/src/pages/night-market.tsx` - Night Market event page
- `client/src/pages/street-market.tsx` - Street Market event page

## User Preferences
- Community-focused, warm design aesthetic
- Real data from irwinbpa.com and irwincarcruise.org
- Top navigation bar layout (not sidebar)
- Events submenu: Car Cruise links externally, Night Market and Street Market have in-app pages
- Square payment integration for sponsorship payments
- Self-managed database (moving away from Google Sheets dependency)
- Native mobile app for App Store and Google Play
