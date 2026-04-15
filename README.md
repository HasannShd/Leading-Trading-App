# LTE Frontend

React + Vite frontend for the LTE public website and internal portals.

## What This App Contains

- Public marketing and catalog website
- Customer auth, cart, checkout, and order history
- Visible admin portal under `/admin`
- Staff portal under `/staff`
- Legacy hidden admin URLs now redirected into the visible admin portal for compatibility

## Runtime Surfaces

Public website:

- `/`
- `/categories`
- `/categories/:slug`
- `/shop`
- `/product/:id`
- `/about`
- `/careers`
- `/contact`
- `/cart`
- `/sign-in`
- `/sign-up`
- `/checkout`
- `/orders`

Staff portal:

- `/staff/login`
- `/staff/dashboard`
- `/staff/attendance`
- `/staff/reports`
- `/staff/orders`
- `/staff/clients`
- `/staff/visits`
- `/staff/messages`
- `/staff/notifications`
- `/staff/account`

Admin portal:

- `/admin/login`
- `/admin/dashboard`
- `/admin/staff`
- `/admin/attendance`
- `/admin/reports`
- `/admin/orders`
- `/admin/clients`
- `/admin/visits`
- `/admin/notifications`
- `/admin/logs`
- `/admin/catalog/categories`
- `/admin/catalog/products`
- `/admin/catalog/import`
- `/admin/site-orders`
- `/admin/marketing`
- `/admin/account`

## Key Frontend Structure

- [src/App.jsx](./src/App.jsx): route map and portal/public shell switching
- [src/context](./src/context): user, admin, and staff auth/session contexts
- [src/components/Homepage](./src/components/Homepage): public landing page
- [src/components/Shop](./src/components/Shop): catalog browsing and product detail
- [src/components/Admin](./src/components/Admin): catalog and website-management screens
- [src/components/Portal](./src/components/Portal): staff/admin operations portal screens
- [src/services](./src/services): API and auth wrappers

## Environment

Copy `.env.example` to `.env` and set:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Admin Catalog Import

- `/admin/catalog/import` accepts CSV uploads only
- export Excel or Google Sheets files to `.csv` before importing
- the download action still exports the current catalog from the backend

## CI

- GitHub Actions now runs lint and build checks on pushes to `main` and on pull requests

## Notes

- Admin, staff, and customer sessions are stored separately.
- Scroll-based cinematic effects automatically back off on reduced-motion, save-data, and small-screen sessions.
- Admin and staff push notifications can be enabled from their account pages when the backend is configured with VAPID keys.
- iPhone/iPad web push requires opening the installed home-screen web app and granting notification permission there.
- This repo currently has build verification but no dedicated frontend unit-test suite.
