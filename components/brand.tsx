import { PRODUCT } from "@/lib/brand";

export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex items-center justify-center rounded-lg"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        aria-hidden
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="brass-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e6c46a" />
            <stop offset="0.5" stopColor="#c79a4b" />
            <stop offset="1" stopColor="#a6772f" />
          </linearGradient>
        </defs>
        <rect x="1.5" y="1.5" width="45" height="45" rx="12" fill="#5b1320" />
        <rect
          x="1.5"
          y="1.5"
          width="45"
          height="45"
          rx="12"
          fill="none"
          stroke="url(#brass-grad)"
          strokeWidth="1.4"
        />
        <g fill="url(#brass-grad)">
          {/* pediment */}
          <path d="M24 10.2 L 38 19 L 10 19 Z" />
          {/* architrave */}
          <rect x="11" y="20.2" width="26" height="2.6" rx="0.7" />
          {/* stylobate steps */}
          <rect x="11" y="33.4" width="26" height="2.3" rx="0.6" />
          <rect x="8.8" y="36.2" width="30.4" height="2.7" rx="0.9" />
        </g>
        <g
          stroke="url(#brass-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        >
          {/* columns */}
          <path d="M14.5 23.6 V 33.1" />
          <path d="M21 23.6 V 33.1" />
          <path d="M27 23.6 V 33.1" />
          <path d="M33.5 23.6 V 33.1" />
        </g>
      </svg>
    </span>
  );
}

export function Wordmark({ size = 34 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BrandMark size={size} />
      <span className="font-display text-[1.35rem] font-semibold leading-none tracking-tight text-text">
        Legal<span className="text-accent-2">OS</span>
      </span>
      <span className="sr-only">{PRODUCT.name}</span>
    </span>
  );
}
