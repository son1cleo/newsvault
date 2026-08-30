# News Vault

News Vault is a news archive website. The core idea: **an article's position in the archive is controlled by the date the admin assigns it, not by when it was actually typed and saved.**

That means you can sit down today and write a story, tell the system "this happened on March 3, 2019," and it will slot into the archive at exactly that date — appearing under 2019, in March, on the 3rd — instead of jumping to the top of the site as "latest news." The site is built to feel like a real broadsheet newspaper's archive: aged paper, serif headlines, dated print styling, and a browsing experience organized entirely around *when something is dated*, not when it was published to the database.

---

## What it does

### The public site

- **A cinematic landing page.** The homepage carries no news content at all — it's a full-screen, scroll-driven title sequence (today's date typing itself out, the masthead assembling, a promise line, then a "Check the Vault" button) that leads into the archive. It respects "reduce motion" accessibility settings and simply shows a static version if the visitor has that turned on.
- **The Vault.** The main archive listing, showing every published article ordered by its assigned date, newest first. It never shows drafts.
- **Browse by year, month, day, or category.** `/vault/2024`, `/vault/2024/03`, and `/vault/Technology` all work as real, linkable pages — and there's a search/filter bar (Year → Month → Day → Category) so a visitor can jump straight to a specific slice of the archive.
- **Individual article pages** with a full read layout, the correct dateline, a byline, a cover image if one was set, and links to the previous/next article in the archive (by date, not by category).
- **Search-engine friendly by design.** Every article page carries the correct structured metadata (including the *real* publish date, not today's date), and the site automatically generates a sitemap and robots file so search engines can index it correctly.
- **Fully responsive.** The site adapts across phone, tablet, and desktop sizes. On narrow screens the navigation collapses into a hamburger menu that opens as a slide-in panel from the right edge of the screen, and the full "News Vault" wordmark is swapped for a compact "NV" mark so nothing overlaps or overflows.

### The admin panel

Reachable at `/admin` (see **Getting Started** below for how to log in). This is where articles actually get written.

- **One admin account.** There's no user list, roles, or permissions system to manage — just a single login protected by a password and rate-limited against repeated guesses.
- **A real rich-text editor** (bold, italics, headings, lists, quotes, links, and images) for writing the article body — no HTML knowledge required.
- **Two ways to add an image**: paste a URL, or click "Choose File" to upload an image straight from your computer, both for the article's cover image and for images inside the body text.
- **The date control that makes the whole site work.** Every article has a "Published Date" field — a calendar picker restricted to today or any day in the past. Whatever date is chosen there is exactly where the article will appear in the public archive.
- **Draft vs. Published.** An article can be saved as a draft (only visible in the admin panel) and flipped to Published whenever it's ready to go live.
- **A searchable, filterable article list** — filter by status (All / Published / Drafts), category, author, or exact date, or just type into the search box. Select multiple articles with checkboxes and delete them in bulk, or manage them one at a time.
- **Responsive here too** — on smaller screens the admin's sidebar tucks away behind a hamburger menu (also opening from the right) so the article list and editor stay usable on a phone or tablet.

---

## Tech stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, with a custom "aged newsprint" design system (custom color tokens, Playfair Display / Public Sans / JetBrains Mono typefaces, zero border-radius, rule-based dividers instead of drop shadows)
- **Database:** PostgreSQL via [Neon](https://neon.tech), accessed through [Drizzle ORM](https://orm.drizzle.team)
- **Rich text editor:** [TipTap](https://tiptap.dev)
- **Landing page animation:** [Motion](https://motion.dev) (scroll-linked reveals) + [Lenis](https://lenis.darkroom.engineering) (smooth scrolling)
- **Auth:** argon2 password hashing + signed session cookies (via `jose`), enforced at the edge by Next.js middleware
- **Validation:** Zod

---

## Getting started

### 1. Prerequisites

- [Node.js](https://nodejs.org) 20 or newer
- A free [Neon](https://neon.tech) Postgres database (or any Postgres connection string)

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill it in:

```bash
cp .env.example .env.local
```

Open `.env.local` and set:

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Your Postgres connection string. In Neon: project dashboard → **Connection Details** → copy the connection string (the pooled one, with `-pooler` in the hostname, is recommended). |
| `AUTH_SECRET` | A random secret used to sign admin login sessions. Generate one with `openssl rand -base64 32`, or any long random string. |
| `ADMIN_EMAIL` | The email address you'll log into `/admin` with. |
| `ADMIN_PASSWORD_HASH` | The **hashed** admin password (never store it in plain text). Generate it by running the command below and pasting the output line into `.env.local`. |
| `NEXT_PUBLIC_SITE_URL` | The public URL of the site (used for SEO tags and the sitemap). Use `http://localhost:3000` for local development. |

To generate the password hash:

```bash
npx tsx scripts/hash-password.ts "your-password-here"
```

This prints a ready-to-paste `ADMIN_PASSWORD_HASH=...` line. (It's base64-encoded specifically so the hash's special characters can't be misread as variable references by Next.js's env-file loader — just copy the whole line as-is.)

### 4. Set up the database

Push the schema to your database:

```bash
npm run db:push
```

Optionally, seed it with ~15 sample articles spread across 2023–2026 so you can see the backdating behavior immediately:

```bash
npm run db:seed
```

### 5. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site, and `http://localhost:3000/admin/login` to sign in to the admin panel with the email/password you configured above.

### Other useful commands

```bash
npm run build       # production build
npm run start        # run a production build
npm run lint          # check code quality
npm run db:studio  # open Drizzle Studio, a visual browser for your database
```

---

## Using the admin panel (a quick walkthrough)

1. Go to `/admin/login` and sign in.
2. You'll land on the **Articles** list — every article that exists, published or draft.
3. Click **New Article**.
4. Fill in the title, a short excerpt (used in listings and search results), pick a category, set the author name, and optionally add a cover image (paste a URL or click "Choose File").
5. Set the **Published Date** — this is the important one. It's the date the article will appear under in the public archive. It can be any day up to and including today.
6. Write the body using the toolbar (bold, headings, lists, quotes, links, images).
7. Choose **Draft** (saved but not visible publicly) or **Published** (goes live immediately at the date you chose), then save.
8. Back on the Articles list, you can filter by status/category/author/date, search by keyword, edit any article, or delete one (or several at once with the checkboxes).

---

## Project structure

```
src/
  app/
    (site)/          public site pages (vault, article, layout with header/footer)
    admin/            admin login + protected admin panel
    api/admin/        admin-only API routes (login, articles CRUD, image upload)
    page.tsx           the animated landing page
    sitemap.ts, robots.ts
  components/         shared UI components (public site + admin)
  db/                  Drizzle schema, database client, seed script
  lib/                  business logic: queries, auth, pagination, validation
  middleware.ts     edge middleware guarding /admin routes
design-system/         the project's design tokens and style guidelines
```

---

## A note on image uploads

Uploaded images are currently saved to `public/uploads/` on the server's local disk. This works well for local development and traditional always-on servers. If you deploy to a serverless/edge platform with an ephemeral or read-only filesystem (e.g. Vercel), local uploads won't persist between deployments — you'd want to swap the upload handler (`src/app/api/admin/upload/route.ts`) for a cloud storage provider (S3, Cloudinary, Vercel Blob, etc.) before relying on it in production.
