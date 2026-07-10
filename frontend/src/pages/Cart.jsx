import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function Cart() {
  useEffect(() => {
    document.title = 'Your Bag — GlowRoot';
  }, []);

  return (
    <div className="py-16 md:py-24" style={{ backgroundColor: '#F8F2E8' }}>
      <div className="mx-auto max-w-content px-4">
        <div className="flex flex-col items-center text-center">
          <img src={logo} alt="GlowRoot" className="mb-8 h-16 w-auto" />
          
          <h1
            className="mb-4 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
          >
            Your bag awaits its first ritual
          </h1>
          
          <p
            className="mb-8 max-w-md text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            Begin a ritual — everything in the GlowRoot catalog is formulated to work together.
          </p>
          
          <Link
            to="/shop"
            className="rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90"
            style={{
              fontFamily: '"Poppins", sans-serif',
              backgroundColor: '#6E4B2A',
              color: '#F8F2E8'
            }}
          >
            Explore The Rituals
          </Link>
        </div>
      </div>
    </div>
  );
}
