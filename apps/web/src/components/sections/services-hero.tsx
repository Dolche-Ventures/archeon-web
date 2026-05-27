import Link from "next/link";

import type { PagebuilderType } from "@/types";

type ServicesHeroProps = PagebuilderType<"servicesHero">;

export function ServicesHero({
  eyebrow,
  title,
  subtitle,
  primaryButton,
  secondaryButton,
}: ServicesHeroProps) {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <span className="mb-4 inline-block text-sm font-medium uppercase tracking-wider text-foreground">
              {eyebrow}
            </span>
          )}
          <h1 className="mb-6 text-4xl font-semibold leading-tight md:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {primaryButton?.text && primaryButton?.link && (
              <Link
                href={primaryButton.link}
                className="rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-medium text-gray-400 shadow-none transition-all hover:border-foreground hover:text-foreground hover:opacity-80 active:scale-95"
              >
                {primaryButton.text}
              </Link>
            )}
            {secondaryButton?.text && secondaryButton?.link && (
              <Link
                href={secondaryButton.link}
                className="rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-medium text-gray-400 shadow-none transition-all hover:border-foreground hover:text-foreground hover:opacity-80 active:scale-95"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
