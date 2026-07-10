/**
 * RootMotif — the brand's signature single-line botanical mark.
 * A continuous root/leaf line that echoes "GlowRoot" literally.
 * Reused (at different scales/opacities) in the hero, as section
 * dividers, and in the footer — the one recurring visual signature.
 */
export default function RootMotif({ className = '', stroke = '#C9A34E', strokeWidth = 1.2 }) {
  return (
    <svg
      viewBox="0 0 300 400"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M150 20 C150 120 150 160 150 200 C150 240 120 260 90 280 C65 297 50 320 45 360
           M150 200 C150 240 180 260 210 280 C235 297 250 320 255 360
           M150 130 C130 140 105 145 80 130
           M150 130 C170 140 195 145 220 130
           M150 260 C135 268 118 270 100 262
           M150 260 C165 268 182 270 200 262"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <circle cx="150" cy="20" r="4" fill={stroke} />
    </svg>
  );
}
