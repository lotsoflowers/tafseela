# Tafseela (تفصيلة)

Mobile-first, bilingual (AR/EN) multi-vendor fashion marketplace for Kuwait. Talabat-model for local fashion: one cart, multiple stores, one checkout. Default language is Arabic (RTL).

> **Tagline:** Where every detail matters. / تفصيلة تهتم بكل التفاصيل

---

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui (New York style)
- **Fonts:** Inter (Latin) + IBM Plex Sans Arabic (Arabic) via `next/font/google`
- **Data:** Mock only — no API calls, no Supabase, no Stripe (yet)
- **State:** React Context (Language, Auth, Cart, Wishlist) — no Zustand/Redux
- **Icons:** `lucide-react`
- **Animations:** `tailwindcss-animate` + custom keyframes (`heart-pop`, `slide-up`, `fade-in`, `shimmer`)

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

---

## Brand palette

The **only** colors that should appear in code. Old palette (`#450427`, `#860348`, `#CB2342`, `#E24720`, `#F3A446`, `#FDF8F0`, `#F9E8EF`) has been retired — flag any reappearance.

| Token | Hex | Usage |
|---|---|---|
| `hero` | `#BF066A` | Primary CTAs, active nav, accents |
| `plum` | `#5C0A3D` | Headers, deep accents |
| `soft` | `#ED93B1` | Tags, secondary icons |
| `blush` | `#FBE0E8` | Alt card backgrounds, hover |
| `cream` | `#FFF4ED` | Page backgrounds |
| `ink` | `#2C2C2A` | Body text |
| `white` | `#FFFFFF` | Primary card backgrounds |
| `destructive` | `#DC2626` | Destructive actions / errors only |

Defined in [tailwind.config.ts](tailwind.config.ts).

---

## Bilingual conventions

- **Every user-visible string** is a `BilingualText` object: `{ en: string; ar: string }`. No hardcoded strings in JSX.
- Resolve via `t()` from `useLanguage()`:

  ```tsx
  const { t, language, direction } = useLanguage();
  <h1>{t({ en: "My Cart", ar: "سلتي" })}</h1>
  ```

- **RTL:** use Tailwind logical properties — `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`. Never `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-` for layout offsets.
- Language preference persists to `localStorage` under key `tafseela-language`. Default is `ar`.

`LanguageContext` lives at [src/contexts/LanguageContext.tsx](src/contexts/LanguageContext.tsx).

---

## Pricing

- All prices in Kuwaiti Dinar with **3 decimal places**: `29.500 KD`.
- Format via `formatPrice()` in [src/lib/format.ts](src/lib/format.ts) — never inline string concatenation.

---

## Auth gate

- Browsing is fully open. **Auth modal only triggers on the first "Add to Cart" tap.**
- Three sign-in options: Google OAuth, Apple, phone + 6-digit OTP. **No email/password, no usernames.**
- Phone numbers default to Kuwait `+965`.
- After auth, the user returns to wherever they were.

Wired in [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) and [src/contexts/CartContext.tsx](src/contexts/CartContext.tsx).

---

## Cart model

- Items are **grouped by store** in the UI. Each store has its own delivery fee.
- Header copy: "طلبك فيه [X] متاجر — كل متجر يوصل بشكل منفصل" / "Your order has [X] stores — each delivers separately."
- Cart state in [src/contexts/CartContext.tsx](src/contexts/CartContext.tsx).

---

## Mock data

All in [src/data/](src/data):

- `stores.ts` — Gozline, lam_sheen, Boz.kw, Loveable_kw, Tyoor Al Jannah, Grade Boutique
- `products.ts` — abayas (30–75 KD), co-ords (40–78 KD), dresses (46–95 KD), tops (18–42 KD)
- `categories.ts` — All / Abayas / Casual / Evening / Co-ords / Tops / Dresses
- `reviews.ts` — bilingual, with fit tags
- `areas.ts` — Kuwait delivery areas
- `orders.ts` — mock order/tracking

**Do not invent data.** If a store, product, or area isn't in these files, don't reference it.

---

## Fit recommendation

Pure conditional logic (no AI) in [src/lib/fit-logic.ts](src/lib/fit-logic.ts):

- True-to-size product → recommend user's usual size
- Runs small → recommend size up
- Runs large → recommend size down
- Adjust further by user's fit preference (Fitted / Regular / Loose)

---

## Routes (16 screens)

| # | Route | Purpose |
|---|---|---|
| 1 | `/` | Splash → auto-redirect to `/home` |
| 2 | `/home` | Feed: search, categories, Products/Stores tabs |
| 3 | `/product/[id]` | Product detail + fit questionnaire + reviews |
| 4 | `/store/[id]` | Store page |
| 5 | `/search` | Search results + filters |
| 6 | `/auth` | Sign-in (Google / Apple / phone+OTP) |
| 7 | `/cart` | Multi-store cart |
| 8 | `/checkout` | Delivery → Payment → Confirm |
| 9 | `/payment-confirmation` | Success splash |
| 10 | `/order/[id]` | Order confirmation |
| 11 | `/order/track/[id]` | Order tracking stepper |
| 12 | `/wishlist` | Wishlisted products |
| 13 | `/review/[productId]` | Write a review |
| 14 | `/profile` | User profile + menu |
| 15 | `/returns` | Static returns policy |
| 16 | `/notifications` | Notification toggles |

---

## Component conventions

- **Named exports only.** Files are `PascalCase.tsx`.
- Every component accepts an optional `className` prop and merges via `cn()` from `src/lib/utils.ts`.
- shadcn primitives live in [src/components/ui/](src/components/ui). Domain components live in sibling folders (`product/`, `store/`, `cart/`, `fit/`, `auth/`, `checkout/`, `review/`, `order/`, `layout/`, `shared/`).
- Sticky **bottom nav** (Home / Search / Cart / Wishlist / Profile) is hidden at `lg:` breakpoint.

---

## What this project is NOT

- Not a real backend — every "submit" is mock state.
- Not a CMS — no admin panel.
- Not a vendor portal — shopper-facing only.
- Not the place for new features without spec alignment. The 16 screens above are the agreed scope.
