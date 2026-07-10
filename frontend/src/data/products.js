/**
 * Product catalog — mock data shaped exactly like the payload
 * `services/api.js` expects from a real backend, so swapping
 * to a live endpoint later requires no component changes.
 */
export const products = [
  {
    id: 'p1',
    slug: 'saffron-radiance-serum',
    name: 'Saffron Radiance Serum',
    category: 'Serums',
    price: 2450,
    ritualTime: 'AM · PM',
    description:
      'Cold-infused Kashmiri saffron and turmeric root, formulated to even tone and restore natural luminosity over 21 days.',
    hero: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1200&auto=format&fit=crop',
    ],
    bestseller: true,
    rating: 4.9,
    reviews: 312,
  },
  {
    id: 'p2',
    slug: 'kumkumadi-night-oil',
    name: 'Kumkumadi Night Oil',
    category: 'Oils',
    price: 3200,
    ritualTime: 'PM',
    description:
      'A 16-herb classical formulation slow-brewed in sesame base, traditionally used to repair skin overnight.',
    hero: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop',
    ],
    bestseller: true,
    rating: 5.0,
    reviews: 208,
  },
  {
    id: 'p3',
    slug: 'multani-clay-mask',
    name: 'Multani Clay Renewal Mask',
    category: 'Masks',
    price: 1650,
    ritualTime: 'Weekly',
    description:
      'Fuller\u2019s earth and rose clay drawn from Rajasthan, blended with neem to purify and refine pores.',
    hero: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop',
    ],
    bestseller: true,
    rating: 4.8,
    reviews: 176,
  },
  {
    id: 'p4',
    slug: 'chandan-jal-mist',
    name: 'Chandan Jal Hydrating Mist',
    category: 'Mists',
    price: 1350,
    ritualTime: 'AM · PM',
    description:
      'Sandalwood hydrosol steam-distilled in copper stills, mist-set to cool and prime skin before actives.',
    hero: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?q=80&w=1200&auto=format&fit=crop',
    ],
    bestseller: false,
    rating: 4.7,
    reviews: 94,
  },
  {
    id: 'p5',
    slug: 'neem-tulsi-cleanser',
    name: 'Neem Tulsi Clarifying Cleanser',
    category: 'Cleansers',
    price: 1150,
    ritualTime: 'AM · PM',
    description:
      'A silt-soft gel cleanser carrying neem, tulsi and licorice root to clear congestion without stripping.',
    hero: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
    ],
    bestseller: true,
    rating: 4.9,
    reviews: 261,
  },
  {
    id: 'p6',
    slug: 'bakuchi-eye-balm',
    name: 'Bakuchi Renewal Eye Balm',
    category: 'Eye Care',
    price: 1950,
    ritualTime: 'PM',
    description:
      'Ayurveda\u2019s answer to retinol — bakuchi seed extract in a ghee-rich balm for the eye contour.',
    hero: 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=1200&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?q=80&w=1200&auto=format&fit=crop',
    ],
    bestseller: false,
    rating: 4.6,
    reviews: 88,
  },
];

export const categories = [
  {
    id: 'c1',
    name: 'Serums',
    tagline: 'Concentrated root extracts',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'c2',
    name: 'Facial Oils',
    tagline: 'Slow-brewed herbal infusions',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'c3',
    name: 'Clay Masks',
    tagline: 'Earth-drawn mineral rituals',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'c4',
    name: 'Cleansers',
    tagline: 'Gentle daily clarity',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=900&auto=format&fit=crop',
  },
];

export const bestSellers = products.filter((p) => p.bestseller);

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
