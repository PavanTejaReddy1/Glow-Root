import Reveal from './Reveal.jsx';
import GoldenDivider from '../ui/GoldenDivider.jsx';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}) {
  const alignClass = align === 'left' ? 'items-start text-left' : 'items-center text-center';

  return (
    <Reveal className={`flex flex-col ${alignClass} max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <span className={`eyebrow mb-4 ${light ? 'text-gold-light' : 'text-gold-dark'}`}>
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-4xl leading-[1.1] md:text-5xl lg:text-[3.25rem] ${
          light ? 'text-cream' : 'text-text'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-5 font-body text-[15px] leading-relaxed md:text-base ${
            light ? 'text-cream/75' : 'text-text-muted'
          }`}
        >
          {subtitle}
        </p>
      )}
      <GoldenDivider className={`mt-8 ${align === 'left' ? '!justify-start' : ''}`} />
    </Reveal>
  );
}
