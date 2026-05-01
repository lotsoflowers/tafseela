# Tafseela (تفصيلة)

Mobile-first, bilingual (AR/EN) multi-vendor fashion marketplace for Kuwait. Built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. Uses mock data only — no backend required.

> Where every detail matters. / تفصيلة تهتم بكل التفاصيل

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Local dev server with hot reload |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

## Project layout

```
src/
├── app/             # Next.js App Router — 16 screens
├── components/      # ui/ (shadcn) + domain components
├── contexts/        # Language, Auth, Cart, Wishlist
├── data/            # Mock stores / products / reviews / areas
├── lib/             # utils, format, fit-logic
└── types/           # TypeScript types
```

See [CLAUDE.md](CLAUDE.md) for conventions (brand palette, bilingual rules, pricing format, auth gate).

## Status

MVP scope — 16 shopper-facing screens, mock data, ready for Supabase/Stripe wiring later.
