# Downtown Irwin App

## Overview
Community web application and native mobile app for Downtown Irwin, Pennsylvania featuring information from the Irwin Business & Professional Association (IBPA) and the annual Downtown Irwin Car Cruise. Built with React + Express + PostgreSQL for the web, and React Native + Expo for the mobile app.

## Recent Changes
- Initial build: Full-stack web app with 7 pages, database-backed content, vehicle registration, sponsorship inquiries, contact form
- Added native mobile app (React Native + Expo) in `mobile/` directory with 9 screens
- Added CORS middleware to backend for mobile app API access
- Added aerial photo of Downtown Irwin and IBPA logo to hero sections
- Added admin authentication system (session-based with express-session + connect-pg-simple + bcrypt)
- Added admin dashboard with CRUD management for events, businesses, and sponsors
- Added image upload support for admin content management
- Default admin credentials: username `admin`, password `admin123`
- Added GitHub integration: push project code to GitHub from admin dashboard
- GitHub client uses Replit's native GitHub connection (OAuth via @octokit/rest)

## Architecture

### Frontend (React + Vite) — Web App
- **Pages**: Home, Events, Car Cruise, Car Cruise Register, Sponsorship, Businesses, About, Contact, Admin Login, Admin Dashboard
- **Routing**: wouter
- **State**: @tanstack/react-query
- **Styling**: Tailwind CSS with shadcn/ui components
- **Theme**: Warm community-focused palette (primary: warm red-orange, accent: blue)

### Mobile App (React Native + Expo) — `mobile/` directory
- **Screens**: Home, Events, Car Cruise, Vehicle Registration, Business Directory, More, About IBPA, Sponsorship, Contact
- **Navigation**: React Navigation (bottom tabs + native stacks)
- **Icons**: @expo/vector-icons (Ionicons)
- **API**: Connects to Express backend via REST API with CORS
- **Build**: Expo EAS Build for iOS/Android app store submissions
- **Key files**:
  - `mobile/App.tsx` - Entry point
  - `mobile/src/navigation/AppNavigator.tsx` - Tab + stack navigation
  - `mobile/src/screens/` - All 9 screens
  - `mobile/src/lib/api.ts` - API client (update API_BASE for your deployment)
  - `mobile/src/lib/theme.ts` - Shared design tokens
  - `mobile/src/lib/constants.ts` - IBPA info, car cruise details, sponsorship tiers

### Backend (Express)
- **Public API Routes**: `/api/events`, `/api/businesses`, `/api/sponsors`, `/api/vehicle-registrations`, `/api/sponsorship-inquiries`, `/api/contact`
- **Auth Routes**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Admin Routes** (require auth): `/api/admin/events`, `/api/admin/businesses`, `/api/admin/sponsors`, `/api/admin/upload`, `/api/admin/vehicle-registrations`, `/api/admin/sponsorship-inquiries`, `/api/admin/contact-messages`
- **GitHub Routes** (require auth): `/api/admin/github/user`, `/api/admin/github/repos`, `/api/admin/github/push`
- **Authentication**: Session-based with express-session + connect-pg-simple (PostgreSQL session store) + bcrypt password hashing
- **Image Uploads**: multer-based, stored in `server/uploads/`, served at `/uploads/*`
- **Database**: PostgreSQL with Drizzle ORM
- **Seed Data**: Events, sponsors, businesses, and default admin user auto-seeded on startup
- **CORS**: Enabled for mobile app access

### Data Models
- `events` - Community events with categories and featured flag
- `vehicleRegistrations` - Car cruise vehicle registration entries
- `sponsorshipInquiries` - Sponsorship interest form submissions
- `sponsors` - Current event sponsors
- `businesses` - Downtown business directory
- `contactMessages` - General contact form submissions

### Key Files
- `shared/schema.ts` - All Drizzle schemas and Zod validators
- `server/routes.ts` - API endpoints
- `server/storage.ts` - Database storage layer
- `server/seed.ts` - Seed data for initial load
- `client/src/lib/constants.ts` - IBPA info, car cruise details, sponsorship levels

## User Preferences
- Community-focused, warm design aesthetic
- Real data from irwinbpa.com and irwincarcruise.org
- Native mobile app for App Store and Google Play
