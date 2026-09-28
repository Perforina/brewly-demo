import { getProductStyle } from "@/lib/productStyles";

type Props = {
  productId: string;
  /**
   * Printed on the bag label. Rendered via a CSS pseudo-element so it is
   * visual only and never adds a second text match for the product name.
   */
  label?: string;
  className?: string;
};

export function CoffeeBag({ productId, label, className = "" }: Props) {
  const { bag, shade } = getProductStyle(productId);

  return (
    <div className={`@container relative aspect-[3/4] ${className}`}>
      <svg viewBox="0 0 120 160" className="pointer-events-none h-full w-full drop-shadow-md" aria-hidden="true" focusable="false">
        {/* Crimped top */}
        <path d="M22 8 L26 4 L30 8 L34 4 L38 8 L42 4 L46 8 L50 4 L54 8 L58 4 L62 8 L66 4 L70 8 L74 4 L78 8 L82 4 L86 8 L90 4 L94 8 L98 4 L98 26 L22 26 Z" fill={shade} />
        {/* Tin tie */}
        <rect x="18" y="24" width="84" height="5" rx="2" fill="#C9B79F" />
        {/* Bag body */}
        <path d="M22 29 L98 29 L106 148 Q106 156 98 156 L22 156 Q14 156 14 148 Z" fill={bag} stroke="#fff" strokeOpacity="0.14" />
        {/* Side shading */}
        <path d="M22 29 L32 29 L28 156 L22 156 Q14 156 14 148 Z" fill={shade} opacity="0.45" />
        <path d="M88 29 L98 29 L106 148 Q106 156 98 156 L92 156 Z" fill="#fff" opacity="0.08" />
        {/* Degassing valve */}
        <circle cx="60" cy="44" r="5" fill={shade} />
        <circle cx="60" cy="44" r="2" fill="#F6EFE6" opacity="0.7" />
        {/* Label */}
        <rect x="28" y="60" width="64" height="72" rx="6" fill="#F6EFE6" />
        <rect x="31" y="63" width="58" height="66" rx="4" fill="none" stroke="#3B2418" strokeOpacity="0.25" />
        {/* Bean mark on label */}
        <g transform="translate(60 76) rotate(-25)">
          <ellipse rx="5" ry="7" fill="#3B2418" />
          <path d="M0 -6.5 C -2 -2, 2 2, 0 6.5" stroke="#F6EFE6" strokeWidth="1.2" fill="none" />
        </g>
        <rect x="46" y="122" width="28" height="2" rx="1" fill="#B5652B" />
      </svg>
      {label && (
        <div
          data-label={label}
          className="font-display pointer-events-none absolute top-[54%] right-[26%] left-[26%] flex h-[20%] items-center justify-center text-center text-[clamp(0.45rem,9cqw,0.85rem)] leading-tight font-semibold text-[#3B2418] after:content-[attr(data-label)]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
