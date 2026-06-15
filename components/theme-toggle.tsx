"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to parchment mode" : "Switch to chambers mode"}
      title={isDark ? "Parchment" : "Chambers"}
      className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-surface text-accent-2 transition-colors hover:border-accent-2/60 hover:bg-surface-2"
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.4 5.4l1.7 1.7M16.9 16.9l1.7 1.7M18.6 5.4l-1.7 1.7M7.1 16.9l-1.7 1.7" />
          </g>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.5 14.5A8.2 8.2 0 0 1 9.5 3.5a.7.7 0 0 0-.9-.9 9.6 9.6 0 1 0 12.8 12.8.7.7 0 0 0-.9-.9Z" />
        </svg>
      )}
    </button>
  );
}
