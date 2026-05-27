"use client";

import { Badge } from "@workspace/ui/components/badge";

import { AnimatedBlock } from "@/hooks/use-data-assembly";
import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";

type FeatureCardsWithCTAIconProps = PagebuilderType<"featureCardsIconWithCTA">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CardWithVideo = any;

function FeatureCard({ card }: { card: CardWithVideo }) {
  const { title, video, videoTitle, videoDescription, videoCta, href } =
    card ?? {};
  const videoUrl = video?.asset?.url ?? null;

  if (!videoUrl) {
    return (
      <div className="group rounded-xl border border-border/50 bg-muted/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:shadow-md md:min-h-48 md:p-8">
        <div>
          <h3 className="mb-2 font-medium text-lg md:text-xl">{title}</h3>
        </div>
      </div>
    );
  }

  const linkHref = href || "#";

  return (
    <a
      href={linkHref}
      className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
    >
      <video
        autoPlay
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        loop
        muted
        playsInline
        src={videoUrl}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
        <h3 className="mb-1 font-semibold text-xl text-white">
          {videoTitle || title}
        </h3>
        <p className="mb-3 text-sm text-white/80 line-clamp-2">
          {videoDescription || ""}
        </p>
        {videoCta && (
          <span className="text-sm font-medium text-white">
            {videoCta} →
          </span>
        )}
      </div>
    </a>
  );
}

export function FeatureCardsWithCTAIcon({
  eyebrow,
  title,
  richText,
  cards,
  ctaTitle,
  ctaDescription,
  buttons,
}: FeatureCardsWithCTAIconProps) {
  return (
    <section className="my-10 md:my-16" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
              {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
              <h2 className="text-balance font-semibold text-3xl leading-tight md:text-5xl">
                {title}
              </h2>
              <RichText
                className="max-w-2xl text-balance text-base md:text-lg"
                richText={richText}
              />
            </div>
          </div>
        </AnimatedBlock>

        <div className="mx-auto mt-10 grid gap-6 lg:grid-cols-3">
          {cards?.map((card, index) => (
            <AnimatedBlock
              key={`FeatureCard-${card?._key}-${index}`}
              delay={index * 100}
            >
              <FeatureCard card={card} />
            </AnimatedBlock>
          ))}
        </div>

        {(ctaTitle || ctaDescription || buttons?.length) && (
          <AnimatedBlock delay={200}>
            <div className="mt-12 flex flex-col items-center text-center">
              {ctaTitle && (
                <h3 className="font-semibold text-xl md:text-2xl">
                  {ctaTitle}
                </h3>
              )}
              {ctaDescription && (
                <p className="mt-4 max-w-xl text-muted-foreground">
                  {ctaDescription}
                </p>
              )}
              {buttons?.length && (
                <div className="mt-6">
                  <SanityButtons buttons={buttons} />
                </div>
              )}
            </div>
          </AnimatedBlock>
        )}
      </div>
    </section>
  );
}
