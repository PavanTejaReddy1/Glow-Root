import LuxuryButton from '../components/ui/LuxuryButton.jsx';
import MoonGlow from '../components/ui/MoonGlow.jsx';
import logo from '../assets/logo.png';

export default function NotFound() {
  return (
    <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden section-bg-cream section-pad text-center">
      <MoonGlow size="sm" className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25" />
      <img src={logo} alt="GlowRoot" className="relative mb-8 h-16 w-auto opacity-70" />
      <h1 className="relative font-display text-6xl text-gold md:text-7xl">404</h1>
      <p className="relative mt-4 font-body text-sm text-text-muted md:text-base">
        This path hasn't been formulated yet.
      </p>
      <LuxuryButton to="/" className="relative mt-10">Back to GlowRoot</LuxuryButton>
    </div>
  );
}
