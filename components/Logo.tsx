export function BeanMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(16 16) rotate(-30)">
        <ellipse rx="9" ry="13" fill="#B5652B" />
        <path d="M0 -12 C -4 -4, 4 4, 0 12" stroke="#F6EFE6" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** The "Brewly" wordmark. Renders plain text so link names stay "Brewly". */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-2 text-2xl font-semibold tracking-tight ${className}`}>
      <BeanMark />
      Brewly
    </span>
  );
}
