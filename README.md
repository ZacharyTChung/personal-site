# Zachary Chung — Personal Site

**Live site: [zacharychung.vercel.app](https://zacharychung.vercel.app)**

Modern personal site built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and 21st.dev / shadcn components.

## Stack

- **Framework**: Next.js 14 (App Router, RSC)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables (shadcn theme)
- **Animation**: Framer Motion
- **3D**: Spline (`@splinetool/react-spline`)
- **Icons**: lucide-react

## Featured components

- `components/ui/splite.tsx` — lazy-loaded Spline 3D scene (hero)
- `components/ui/spotlight.tsx` — Aceternity spotlight effect (hero)
- `components/ui/container-scroll-animation.tsx` — Aceternity tilt-on-scroll card (projects)
- `components/blocks/scroll-expansion-hero.tsx` — scroll-to-expand media block (Ironman section)

## Folder structure

```
personal-site/
├── app/
│   ├── globals.css         # Tailwind + theme tokens
│   ├── layout.tsx          # Root layout, fonts, metadata
│   └── page.tsx            # Stitches all sections together
├── components/
│   ├── ui/                 # shadcn + 21st.dev primitives
│   │   ├── card.tsx
│   │   ├── button.tsx
│   │   ├── splite.tsx
│   │   ├── spotlight.tsx
│   │   └── container-scroll-animation.tsx
│   ├── blocks/
│   │   └── scroll-expansion-hero.tsx
│   └── sections/           # Page sections
│       ├── nav.tsx
│       ├── hero.tsx
│       ├── about.tsx
│       ├── projects.tsx
│       ├── interests.tsx
│       ├── ironman.tsx
│       └── contact.tsx
├── lib/
│   └── utils.ts            # `cn()` helper
├── tailwind.config.ts      # custom palette: forest, ember, ink
├── components.json         # shadcn CLI config
└── package.json
```

## Run locally (development)

To view the site, just visit [zacharychung.vercel.app](https://zacharychung.vercel.app). The steps below are only for local development.

```bash
cd personal-site
npm install
npm run dev
```

This starts a dev server at [http://localhost:3000](http://localhost:3000).

## Personalization checklist

The site is wired up with placeholder content keyed off your USC email. Update these to make it yours:

- `components/sections/hero.tsx` — name, tagline, social URLs
- `components/sections/about.tsx` — bio + stat cards
- `components/sections/projects.tsx` — `projects` array (title, description, tags, images, live/repo links)
- `components/sections/interests.tsx` — `interests` array (swap copy or images)
- `components/sections/ironman.tsx` — race goal, distances, narrative
- `components/sections/contact.tsx` — email, GitHub, LinkedIn handles
- `app/layout.tsx` — page metadata + OG tags

All images are pulled from Unsplash CDN. Drop in your own by replacing the `image` URLs (or move them to `/public` and reference as `/your-photo.jpg`).

## Color palette

Defined in `tailwind.config.ts`:

- **forest** — deep green, primary accent (links, highlights)
- **ember** — warm orange, CTA / energy
- **ink** — near-black neutral background

Tweak the HSL variables in `app/globals.css` to shift the whole theme.

## Deploy

Push to GitHub and import into Vercel — zero-config Next.js deploy. The `next.config.js` already allowlists Unsplash / Pexels / Aceternity image hosts.
