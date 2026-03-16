# Public Data Dashboard

A modern web application built with Next.js (App Router), Tailwind CSS, Shadcn UI, Turso (SQLite), and NextAuth.js.

## Features

- **Next.js App Router**: Modern, fast, and feature-rich React framework.
- **Tailwind CSS & Shadcn UI**: Beautiful, accessible, and customizable components.
- **NextAuth.js**: Seamless authentication using Google OAuth.
- **Turso Database**: Edge SQLite database for storing users and guestbook entries.
- **Auto Sign-up Middleware**: Automatic user registration upon Google Login with Edge middleware protecting internal routes.
- **Real-time Map Visualization**: Integrated `react-leaflet` to display live bike station statuses interactively.
- **Interactive Guestbook**: Open discussion board powered by seamless Next.js Server Actions.

## Prerequisites

Ensure you have Node.js installed and the following environment variables set in `.env.local`:

- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID.
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret.
- `TURSO_DATABASE_URL`: Your Turso database connection URL.
- `TURSO_AUTH_TOKEN`: Your Turso authentication token.
- `NEXTAUTH_SECRET`: A secure random string for NextAuth.
- `NEXTAUTH_URL`: The canonical URL of your site (e.g., `http://localhost:3000`).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the database seed script to initialize the `allowed_users` table with the initial admin account (`insung4616@gmail.com`):
   ```bash
   npx tsx scripts/seed.ts
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
