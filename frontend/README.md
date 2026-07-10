# GlowRoot — Ayurvedic Skincare E-commerce Frontend

A production-ready, luxury ecommerce storefront built for an Ayurvedic
skincare brand. React + Vite + Tailwind CSS + Framer Motion + Swiper + Axios.

## Design system

| Token | Value | Use |
|---|---|---|
| `primary` | `#4E7A3A` | CTAs, ingredient panel, headings accent |
| `secondary` | `#C9A34E` | Hairlines, eyebrows, hover states |
| `background` | `#FAF8F4` | Page canvas |
| `accent` | `#FFF8EC` | Cards, panels |
| `ink` | `#22301D` | Body text |

Fonts: **Cormorant Garamond** (display/headings), **Poppins** (body copy),
**Inter** (buttons/UI labels, tracked uppercase).

Signature element: `RootMotif` — a single continuous line-drawing of a
root/leaf, echoing the brand name. Reused in the hero, footer watermark,
and empty states rather than a generic icon set.

## Getting started

```bash
npm install
cp .env.example .env   # point at your real API when ready
npm run dev
```

```bash
npm run build     # production build to /dist
npm run preview   # preview the production build locally
```

## Folder structure

```
src/
  components/
    common/        # Reveal, SectionHeading, ScrollToTop, RootMotif
    layout/         # Navbar, Footer
    home/            # One component per homepage section
    product/       # ProductCard (reused in Best Sellers, Shop, related)
  data/            # Mock catalog + editorial content (swap for API easily)
  pages/           # Route-level components (Home, Shop, ProductDetail, Cart, 404)
  services/        # Axios instance + API functions
  hooks/           # Reserved for shared hooks (cart, wishlist, etc.)
  App.jsx          # Route map + persistent layout
  main.jsx         # Entry point
  index.css        # Design tokens applied via Tailwind layers
```

## Notes for going to production

- Swap `src/data/*.js` for real API calls via `src/services/api.js` —
  component props are already shaped to match.
- Add a `CartContext` (or Zustand/Redux) in `src/hooks/` to wire the
  "Add to Bag" button in `ProductDetail.jsx` and the `Cart.jsx` page to
  real state.
- Replace Unsplash placeholder imagery with licensed product photography
  before launch — filenames/alt text are already descriptive and SEO-ready.
- `index.html` ships full meta/OG/Twitter tags; update `og-cover.jpg` and
  canonical URLs to your live domain, and generate `sitemap.xml`.
