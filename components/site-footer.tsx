import { PRODUCT } from "@/lib/brand";
import { BrandMark } from "./brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border-soft bg-surface/60">
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark size={30} />
            <div>
              <p className="font-display text-lg font-semibold leading-none text-text">
                {PRODUCT.name}
              </p>
              <p className="mt-1 text-sm text-text-soft">{PRODUCT.tagline}</p>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-soft">
            Synthetic demo · Deterministic · No live APIs
          </p>
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-text-soft">
          {PRODUCT.disclaimer}
        </p>
      </div>
    </footer>
  );
}
