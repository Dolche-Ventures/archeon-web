"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { SanityImage } from "../elements/sanity-image";
import { RichText } from "../elements/rich-text";
import type { PagebuilderType } from "@/types";

type CSIndividualCaseStudyProps = PagebuilderType<"csIndividualCaseStudy">;

function HeroSection({ data }: { data: any }) {
  if (!data) return null;
  return (
    <section className="relative overflow-hidden py-16 md:py-32">
      {data.heroImage?.id && (
        <div className="absolute inset-0">
          <SanityImage
            className="h-full w-full object-cover opacity-15"
            height={1080}
            image={data.heroImage}
            loading="eager"
            width={1920}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
      )}
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {data.clientName && (
            <span className="mb-2 inline-block text-xs font-medium uppercase tracking-widest text-muted-foreground md:mb-3 md:text-sm">
              {data.clientName}
            </span>
          )}
          <h1 className="text-balance font-bold text-3xl leading-tight md:text-6xl tracking-tight">
            {data.projectTitle}
          </h1>
          {data.subtitle && (
            <p className="mt-3 mx-auto max-w-2xl text-base text-muted-foreground md:mt-4 md:text-xl">
              {data.subtitle}
            </p>
          )}
          {(data.industry || data.role || data.duration) && (
            <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground md:mt-8 md:gap-6 md:text-sm">
              {[data.industry, data.role, data.duration].filter(Boolean).map((item, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-foreground/30 md:h-1.5 md:w-1.5" />
                  {item}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ContentSection({ data }: { data: any }) {
  if (!data) return null;
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid gap-8 items-center md:gap-10 ${data.image?.id ? "lg:grid-cols-2" : "mx-auto max-w-3xl"}`}>
          <div className={data.imagePosition === "left" ? "lg:order-2" : ""}>
            {data.heading && (
              <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl mb-4 md:mb-6">
                {data.heading}
              </h2>
            )}
            {data.content && (
              <RichText className="text-muted-foreground leading-relaxed [&_p]:mb-4" richText={data.content} />
            )}
          </div>
          {data.image?.id && (
            <div className={data.imagePosition === "left" ? "lg:order-1" : ""}>
              <SanityImage className="rounded-2xl object-cover w-full aspect-video md:aspect-auto" height={600} image={data.image} loading="lazy" width={800} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MediaSection({ data }: { data: any }) {
  if (!data) return null;
  const isFull = data.layout === "full";
  const gridCols = ({ single: "grid-cols-1", two: "grid-cols-1 sm:grid-cols-2", three: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", full: "grid-cols-1" } as Record<string, string>)[data.layout || "single"];
  const aspectClass = data.layout === "full" ? "aspect-video md:aspect-auto" : "aspect-video";
  return (
    <section className="py-12 md:py-24">
      <div className={isFull ? "" : "container mx-auto px-4 md:px-6"}>
        {data.heading && (
          <div className="container mx-auto mb-8 px-4 md:mb-10 md:px-6">
            <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl">{data.heading}</h2>
          </div>
        )}
        {data.images?.length > 0 && (
          <div className={`grid ${gridCols} gap-3 md:gap-4`}>
            {data.images.map((img: any, i: number) => (
              <div key={i} className="group overflow-hidden rounded-xl">
                <SanityImage className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${aspectClass}`} height={600} image={img} loading="lazy" width={900} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureCardsSection({ data }: { data: any }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  if (!data?.cards?.length) return null;
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {data.heading && <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl mb-8 md:mb-10 text-center">{data.heading}</h2>}
        <div className="mx-auto grid max-w-5xl gap-5 md:gap-6 sm:grid-cols-2">
          {data.cards.map((card: any, i: number) => {
            const isOpen = expandedIndex === i;
            return (
              <div
                key={i}
                className="group relative flex h-full cursor-pointer flex-col rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 p-5 transition-all duration-500 hover:-translate-y-2 hover:border-foreground/20 hover:shadow-2xl hover:shadow-foreground/10 dark:from-zinc-800 dark:to-zinc-900/50 md:p-6"
                onClick={() => setExpandedIndex(isOpen ? null : i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedIndex(isOpen ? null : i); } }}
                role="button"
                tabIndex={0}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/0 via-foreground/0 to-foreground/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {card.icon && (
                  <span className="relative mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/10 text-base transition-all duration-500 group-hover:scale-110 group-hover:bg-foreground/15 md:mb-4 md:h-10 md:w-10 md:text-lg">
                    {card.icon}
                  </span>
                )}
                <h3 className="relative font-semibold text-base md:text-lg mb-1.5">{card.title}</h3>
                {card.description && (
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                )}
                {card.expandedDescription && (
                  <div
                    className={`relative mt-2 grid transition-all duration-500 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden border-t border-border/20 pt-2 md:pt-3">
                      <RichText className="text-sm text-muted-foreground/80 leading-relaxed [&_p]:mb-2" richText={card.expandedDescription} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TechStackSection({ data }: { data: any }) {
  if (!data?.layers?.length) return null;
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {data.heading && <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl text-center">{data.heading}</h2>}
        {data.description && <p className="mt-2 mb-8 text-center text-muted-foreground max-w-2xl mx-auto md:mt-3 md:mb-12">{data.description}</p>}
        <div className="mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
          {data.layers.map((layer: any, i: number) => (
            <div
              key={i}
              className="group relative flex items-start gap-3 rounded-xl border border-border/20 bg-background p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/50 hover:shadow-md h-full md:gap-4 md:p-5"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-muted/30 p-2 transition-all duration-300 md:h-20 md:w-20 md:p-4">
                {layer.logo?.id ? (
                  <SanityImage
                    className="h-full w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
                    height={48}
                    image={layer.logo}
                    loading="lazy"
                    width={48}
                  />
                ) : (
                  <span className="text-center text-xs font-medium text-muted-foreground">
                    {layer.name}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <span className="inline-block rounded bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {layer.layerLabel}
                </span>
                <h3 className="mt-1 font-semibold text-sm md:text-base">{layer.name}</h3>
                {layer.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground md:text-sm">{layer.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesProvidedSection({ data }: { data: any }) {
  if (!data?.services?.length) return null;
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {data.heading && <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl text-center">{data.heading}</h2>}
        {data.description && <p className="mt-2 mb-8 text-center text-muted-foreground md:mt-3 md:mb-10">{data.description}</p>}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
          {data.services.map((service: any, i: number) => (
            <div
              key={i}
              className="group rounded-xl border border-border/20 bg-background p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border/60 hover:shadow-md md:p-5"
            >
              {service.icon && (
                <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm transition-transform duration-300 group-hover:scale-110 md:mb-3 md:h-9 md:w-9 md:text-base">
                  {service.icon}
                </span>
              )}
              <h3 className="font-medium text-sm md:text-base mb-1">{service.title}</h3>
              {service.description && (
                <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">{service.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResultsSection({ data }: { data: any }) {
  if (!data) return null;
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {data.heading && <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl mb-8 text-center md:mb-12">{data.heading}</h2>}
        <div className={`grid gap-8 items-center md:gap-10 ${data.image?.id ? "lg:grid-cols-2" : ""}`}>
          {data.metrics?.length > 0 && (
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {data.metrics.map((m: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-foreground md:text-5xl">{m.prefix}{m.value}</div>
                  {m.label && <div className="mt-1 text-xs text-muted-foreground md:mt-2 md:text-sm">{m.label}</div>}
                </div>
              ))}
            </div>
          )}
          {data.image?.id && <SanityImage className="rounded-2xl object-cover w-full aspect-video md:aspect-auto" height={500} image={data.image} loading="lazy" width={700} />}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection({ data }: { data: any }) {
  const items = data?.testimonials ?? [];
  if (!items.length) return null;

  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [items.length, next]);

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        {data.heading && <h2 className="text-balance font-semibold text-2xl leading-tight md:text-4xl mb-8 text-center md:mb-12">{data.heading}</h2>}
        <div className="mx-auto max-w-3xl overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {items.map((item: any, i: number) => (
              <div key={i} className="w-full shrink-0 px-4">
                <div className="flex flex-col items-center text-center">
                  <svg className="mb-4 h-6 w-6 text-foreground/20 md:mb-6 md:h-8 md:w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                  </svg>
                  <blockquote className="text-balance text-lg font-medium leading-relaxed text-foreground md:text-2xl">&ldquo;{item.quote}&rdquo;</blockquote>
                  {(item.author || item.role || item.company) && (
                    <div className="mt-6 flex flex-col items-center gap-2 md:mt-8">
                      {item.avatar?.id && <SanityImage className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14" height={56} image={item.avatar} loading="lazy" width={56} />}
                      {item.author && <span className="font-semibold text-sm md:text-base text-foreground">{item.author}</span>}
                      {(item.role || item.company) && <span className="text-xs text-muted-foreground md:text-sm">{[item.role, item.company].filter(Boolean).join(", ")}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        {items.length > 1 && (
          <div className="mt-6 flex justify-center gap-2 md:mt-8">
            {items.map((_: any, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-foreground" : "w-2 bg-foreground/30"}`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection({ data }: { data: any }) {
  if (!data) return null;
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900/50 px-5 py-12 shadow-lg md:px-6 md:py-16">
          {data.heading && <h2 className="text-balance font-bold text-2xl leading-tight md:text-4xl tracking-tight">{data.heading}</h2>}
          {data.description && <p className="mt-3 text-sm text-muted-foreground md:mt-4 md:text-base">{data.description}</p>}
          {data.buttonText && data.buttonLink && (
            <Link href={data.buttonLink} className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 active:scale-95 dark:bg-zinc-100 dark:text-zinc-900 md:mt-8 md:px-8 md:py-3.5">
              {data.buttonText} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
  hero: HeroSection,
  content: ContentSection,
  mediaShowcase: MediaSection,
  featureCards: FeatureCardsSection,
  techStack: TechStackSection,
  servicesProvided: ServicesProvidedSection,
  results: ResultsSection,
  testimonial: TestimonialSection,
  cta: CTASection,
};

export function CSIndividualCaseStudyBlock({ sections }: CSIndividualCaseStudyProps) {
  if (!sections?.length) return null;

  return (
    <div>
      {sections.map((section: any, index: number) => {
        const Component = SECTION_COMPONENTS[section._type];
        if (!Component) return null;
        return (
          <div key={index}>
            <Component data={section} />
            {index < sections.length - 1 && (
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            )}
          </div>
        );
      })}
    </div>
  );
}
