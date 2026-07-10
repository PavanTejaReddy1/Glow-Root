import { useEffect } from 'react';
import Hero from '../components/home/Hero.jsx';
import FeaturedCategories from '../components/home/FeaturedCategories.jsx';
import BestSellers from '../components/home/BestSellers.jsx';
import WhyGlowRoot from '../components/home/WhyGlowRoot.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import Newsletter from '../components/home/Newsletter.jsx';

export default function Home() {
  useEffect(() => {
    document.title = 'GlowRoot — Where Real Glow Begins | Ayurvedic Luxury Skincare';
  }, []);

  return (
    <>
      <Hero />
      <FeaturedCategories />
      <BestSellers />
      <WhyGlowRoot />
      <Testimonials />
      <Newsletter />
    </>
  );
}
