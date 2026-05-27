import Link from "next/link";

import { SanityImage } from "../elements/sanity-image";
import type { PagebuilderType } from "@/types";

type CaseStudiesHeroProps = PagebuilderType<"caseStudiesHero">;

export function CaseStudiesHero({
  eyebrow,
  title,
  subtitle,
  featuredCaseStudy,
}: CaseStudiesHeroProps) {
  return (
    <section className="relative overflow-hidden py-16 md:py-32">
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {eyebrow && (
            <span className="mb-3 inline-block text-xs font-medium uppercase tracking-wider text-foreground md:mb-4 md:text-sm">
              {eyebrow}
            </span>
          )}
          <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:mt-4 md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        {featuredCaseStudy && (
          <div className="mx-auto mt-10 max-w-2xl md:mt-12">
            <Link
              href={featuredCaseStudy.link ?? "#"}
              className="group relative block overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900/50 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-500/10 md:p-8"
            >
              {featuredCaseStudy.image?.id && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  <SanityImage
                    className="h-full w-full object-cover opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-105"
                    height={600}
                    image={featuredCaseStudy.image}
                    loading="lazy"
                    width={800}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/80 via-zinc-100/60 to-zinc-200/80 dark:from-zinc-800/90 dark:via-zinc-800/70 dark:to-zinc-900/90" />
                </div>
              )}
              <div className="relative">
                <h3 className="mb-2 text-lg font-semibold tracking-tight md:mb-3 md:text-2xl">
                  {featuredCaseStudy.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:mb-6 md:text-base">
                  {featuredCaseStudy.description}
                </p>
                <span className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background transition-all duration-300 hover:opacity-90 group-hover:gap-3 md:px-6 md:py-3 md:text-sm">
                  See More
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
