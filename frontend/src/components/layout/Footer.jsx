import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';
import { categoryService } from '../../services/categoryService.js';
import { useSettings } from '../../context/SettingsContext.jsx';

const SUPPORT_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'Shipping',   to: '/shipping' },
  { label: 'Returns',    to: '/returns'  },
  { label: 'FAQs',       to: '/faq'      },
];

const ABOUT_LINKS = [
  { label: 'Our Story',      to: '/#why-glowroot'  },
  { label: 'Ingredients',    to: '/#ingredients'   },
  { label: 'Sustainability', to: '/#why-glowroot'  },
];

function SocialIcon({ name }) {
  const icons = {
    Instagram: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.3.5.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.5 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.5 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.5-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.3-.5-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.5-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.5-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.5C8.4 2.2 8.8 2.2 12 2.2M12 0C8.7 0 8.3 0 7 .1 5.7.2 4.8.5 4 .9c-.8.4-1.5 1-2.1 1.7C1.3 3.2.7 3.9.3 4.7c-.4.8-.7 1.7-.8 3-.1 1.3-.1 1.7-.1 5s0 3.7.1 5c.1 1.3.4 2.2.8 3 .4.8 1 1.5 1.7 2.1.6.6 1.3 1.1 2.1 1.5.8.4 1.7.7 3 .8 1.3.1 1.7.1 5 .1s3.7 0 5-.1c1.3-.1 2.2-.4 3-.8.8-.4 1.5-1 2.1-1.5.6-.6 1.1-1.3 1.5-2.1.4-.8.7-1.7.8-3 .1-1.3.1-1.7.1-5s0-3.7-.1-5c-.1-1.3-.4-2.2-.8-3-.4-.8-1-1.5-1.7-2.1C20.8 1.3 20.1.7 19.3.3c-.8-.4-1.7-.7-3-.8C15 0 14.6 0 12 0Zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.1a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8Z" />
      </svg>
    ),
    Pinterest: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 5.1 3.2 9.4 7.6 11.2-.1-1-.2-2.5 0-3.6.2-.9 1.5-6.1 1.5-6.1s-.4-.8-.4-2c0-1.9 1.1-3.3 2.5-3.3 1.2 0 1.7.9 1.7 2 0 1.2-.8 3.1-1.2 4.8-.3 1.4.7 2.6 2.1 2.6 2.5 0 4.5-2.7 4.5-6.6 0-3.4-2.4-5.8-5.9-5.8-4 0-6.4 3-6.4 6.1 0 1.2.5 2.5 1.1 3.2.1.1.1.2.1.3-.1.4-.3 1.3-.4 1.5-.1.2-.3.3-.5.2-1.4-.6-2.2-2.5-2.2-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6.1 0 3.6-2.3 6.5-5.5 6.5-1.1 0-2.1-.6-2.4-1.3l-.7 2.6c-.2.9-.8 2-1.2 2.7C9.2 23.8 10.6 24 12 24c6.6 0 12-5.4 12-12S18.6 0 12 0Z" />
      </svg>
    ),
    Facebook: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9v8.4C19.6 23.1 24 18.1 24 12.1Z" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Footer() {
  const { settings } = useSettings();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getCategories()
      .then(r => setCategories(r.data?.categories || []))
      .catch(() => {});
  }, []);

  // Build social links from settings — only show if URL is set
  const socials = [
    { name: 'Instagram', href: settings?.instagramUrl },
    { name: 'Pinterest', href: settings?.pinterestUrl },
    { name: 'Facebook',  href: settings?.facebookUrl  },
  ].filter(s => s.href);

  const columns = [
    {
      title: 'Rituals',
      links: [
        { label: 'All Products', to: '/shop' },
        ...categories.slice(0, 5).map(c => ({ label: c.name, to: `/shop/${c.slug}` })),
      ],
    },
    {
      title: 'About',
      links: ABOUT_LINKS,
    },
    {
      title: 'Support',
      links: SUPPORT_LINKS,
    },
  ];

  return (
    <footer style={{ backgroundColor: '#2D1B0E' }}>
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(197,155,69,0.5), transparent)' }} />

      <div className="mx-auto max-w-content px-4 py-16 lg:px-8 md:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/">
              <img src={logo} alt={settings?.storeName || 'GlowRoot'} className="h-14 w-auto" />
            </Link>
            <p className="mt-5 max-w-xs text-[13px] leading-[1.8]"
              style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.55)' }}>
              {settings?.footerTagline || 'Small-batch Ayurvedic skincare, formulated from root to skin — where real glow begins.'}
            </p>

            {socials.length > 0 && (
              <div className="mt-7 flex gap-2.5">
                {socials.map(s => (
                  <motion.a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    whileHover={{ y: -3, backgroundColor: 'rgba(197,155,69,0.2)' }}
                    className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                    style={{ border: '1px solid rgba(197,155,69,0.25)', color: 'rgba(248,242,232,0.65)' }}
                  >
                    <SocialIcon name={s.name} />
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="mb-5 text-[10px] font-bold uppercase tracking-widest"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}>
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[13px] transition-colors hover:text-amber-400"
                      style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.55)' }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-14 border-t pt-8 flex flex-col items-center justify-between gap-4 md:flex-row"
          style={{ borderColor: 'rgba(197,155,69,0.12)' }}>
          <p className="text-[12px]"
            style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.35)' }}>
            © {new Date().getFullYear()} {settings?.storeName || 'GlowRoot'}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(label => (
              <a key={label} href="#"
                className="text-[11px] transition-colors hover:text-amber-400"
                style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.35)' }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
