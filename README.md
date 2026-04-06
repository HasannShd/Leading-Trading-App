# LTE Frontend

## Overview

This frontend now serves three surfaces inside one React + Vite app:

- public LTE website
- existing hidden admin product/category management pages
- new internal staff and admin operations portal

## Frontend Route Areas

Public:

- `/`
- `/products`
- `/categories/:slug`
- `/product/:id`
- `/about`
- `/careers`
- `/contact`
- `/cart`
- `/checkout`
- `/orders`

Staff portal:

- `/staff/login`
- `/staff/dashboard`
- `/staff/attendance`
- `/staff/schedule`
- `/staff/reports`
- `/staff/orders`
- `/staff/expenses`
- `/staff/clients`
- `/staff/visits`
- `/staff/followups`
- `/staff/quotations`
- `/staff/collections`
- `/staff/requests`
- `/staff/demand`
- `/staff/issues`
- `/staff/notifications`

Admin operations portal:

- `/admin/login`
- `/admin/dashboard`
- `/admin/staff`
- `/admin/attendance`
- `/admin/schedules`
- `/admin/reports`
- `/admin/orders`
- `/admin/expenses`
- `/admin/clients`
- `/admin/visits`
- `/admin/followups`
- `/admin/quotations`
- `/admin/collections`
- `/admin/requests`
- `/admin/demand`
- `/admin/issues`
- `/admin/logs`

Existing hidden admin routes remain in place for the current product/category website management system.

## Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set:

```bash
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Mobile-First Notes

The staff portal is designed mobile-first:

- bottom navigation
- touch-friendly cards and forms
- fast single-column task flow
- phone-friendly upload and date inputs

The admin portal is responsive, but more desktop-oriented for oversight and filtering.
