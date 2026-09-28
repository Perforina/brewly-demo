export function BeanMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(16 16) rotate(-30)">
        <ellipse rx="9" ry="13" fill="#C8783A" />
        <path d="M0 -12 C -4 -4, 4 4, 0 12" stroke="#180A06" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** The "Brewly" wordmark. Renders plain text so link names stay "Brewly". */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-center gap-2 text-2xl ${className}`}>
      <BeanMark />
      Brewly
    </span>
  );
}

/** A simple coffee branch: curved stem, paired leaves and two cherries. */
export function Laurel({ flip = false, className = "" }: { flip?: boolean; className?: string }) {
  const leaves = [
    { y: 18, r: -40 },
    { y: 34, r: -32 },
    { y: 50, r: -24 },
    { y: 66, r: -16 },
  ];
  return (
    <svg
      viewBox="0 0 48 96"
      className={`pointer-events-none h-20 w-10 opacity-60 sm:h-24 sm:w-12 ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M34 92 C 18 70, 16 40, 30 6" stroke="#C8783A" strokeWidth="2" fill="none" strokeLinecap="round" />
      {leaves.map(({ y, r }) => (
        <g key={y}>
          <ellipse cx={14} cy={y} rx="8" ry="3.6" fill="#C8783A" transform={`rotate(${r} 22 ${y})`} />
          <ellipse cx={36} cy={y - 6} rx="7" ry="3.2" fill="#C8783A" transform={`rotate(${-r - 10} 28 ${y - 6})`} />
        </g>
      ))}
      <circle cx="26" cy="78" r="3.4" fill="#E0955A" />
      <circle cx="31" cy="82" r="3" fill="#E0955A" />
    </svg>
  );
}
