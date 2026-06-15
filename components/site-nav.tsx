"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/brand";
import { Wordmark } from "./brand";
import { ThemeToggle } from "./theme-toggle";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50">
      <div className="border-b border-border-soft bg-bg/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link href="/" className="shrink-0">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-1.5">
            <ul className="mr-2 hidden items-center gap-1 rounded-full border border-border-soft bg-surface/70 p-1 sm:flex">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-accent text-ivory shadow-sm"
                          : "text-text-soft hover:text-text"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ThemeToggle />
            <Link
              href="/agent"
              className="ml-1 hidden items-center gap-1.5 rounded-full bg-accent-2 px-4 py-2 text-sm font-semibold text-oxblood-dark transition-transform hover:-translate-y-0.5 md:inline-flex"
            >
              Open the agent
              <span aria-hidden>→</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
