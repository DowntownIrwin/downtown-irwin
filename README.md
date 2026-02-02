# Downtown Irwin / IBPA Website

A responsive community website for Downtown Irwin and the Irwin Business & Professional Association (IBPA), featuring events, the Irwin Car Cruise, vendor information, and sponsor opportunities.

## Features

- **Home Page**: Hero section, announcements, featured events, and CTAs
- **About**: IBPA mission, history, and membership info
- **Events**: Event cards sourced from API (ready for Google Sheets integration)
- **Calendar**: EventsCalendar.co embed placeholder
- **Vendors**: Vendor signup information and external form link
- **Sponsors**: Four sponsorship tiers with benefits and Square payment links
- **Car Cruise**: Dedicated page for the annual Irwin Car Cruise with sponsors section
- **Contact**: Contact form with validation
- **Admin**: Password-protected admin panel for managing announcements and featured events

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: Wouter
- **State**: TanStack Query
- **Backend**: Express.js (for development)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app runs on `http://localhost:5000`

## Configuration

### Environment Variables

- `ADMIN_PASSCODE`: Password for admin access (default: "irwin2026")

### External URLs (update in `shared/types.ts`)

- `vendorSignupForm`: Google Form URL for vendor applications
- `eventsGoogleSheetJson`: Google Sheets JSON endpoint for events
- `eventsCalendarEmbed`: EventsCalendar.co embed code/ID
- `sponsorSquare*`: Square payment links for each sponsor tier

## Deployment to GitHub Pages

For static deployment (GitHub Pages, Netlify, etc.), you'll need to build the frontend only:

### Option 1: Simple Static Build

```bash
# Build the frontend
cd client
npm run build

# The built files will be in client/dist
```

### Option 2: GitHub Pages Deployment

1. **Update `vite.config.ts`** (if using a subdirectory):
   ```ts
   export default defineConfig({
     base: '/your-repo-name/', // Add this for GitHub Pages subdirectory
     // ... rest of config
   })
   ```

2. **Create GitHub Actions workflow** (`.github/workflows/deploy.yml`):
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node
           uses: actions/setup-node@v3
           with:
             node-version: '20'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: cd client && npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./client/dist
   ```

3. **Enable GitHub Pages** in your repository settings (Settings > Pages > Source: gh-pages branch)

### Static Export Notes

For a fully static export:
- The current setup uses an Express backend for API routes
- For GitHub Pages (static-only), you'll need to:
  1. Host the JSON data files externally (Google Sheets API, GitHub Gist, etc.)
  2. Replace API calls with direct JSON file fetches
  3. Use a serverless function provider (Vercel, Netlify Functions) for the contact form

## Future Integrations

### Google Sheets Integration for Events
1. Create a Google Sheet with columns: `title`, `date`, `time`, `location`, `description`, `imageUrl`, `featured`
2. Publish the sheet: File → Share → Publish to web → Select CSV format
3. Get the JSON endpoint: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:json`
4. Update `EXTERNAL_URLS.eventsGoogleSheetJson` in `shared/types.ts` with your URL
5. Set `USE_GOOGLE_SHEETS = true` in `client/src/pages/Events.tsx`

**Note:** Google Sheets CORS may require a proxy for production. Consider using a serverless function or a CORS proxy service.

### EventsCalendar.co
- Replace the calendar placeholder with your EventsCalendar.co embed code
- Update `EXTERNAL_URLS.eventsCalendarEmbed` with your calendar ID

### Square Payments
- Update sponsor tier URLs with your Square payment links
- Links should point to your Square checkout pages

## Admin Panel

Access the admin panel at `/admin` with the configured passcode.

Features:
- Manage homepage announcements (add/edit/delete, toggle visibility)
- Manage featured events (add/edit/delete)

**Note**: Data is persisted to `data/admin-data.json`. For production, integrate with Google Sheets API for external storage and easier updates.

## License

Copyright © Downtown Irwin / IBPA. All rights reserved.
