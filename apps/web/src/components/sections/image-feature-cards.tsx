import { Badge } from "@workspace/ui/components/badge";

import { AnimatedBlock } from "@/hooks/use-data-assembly";
import type { PagebuilderType } from "@/types";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";

type ImageFeatureCardsProps = PagebuilderType<"imageFeatureCards">;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CardWithVideo = any;

function FeatureCard({ card }: { card: CardWithVideo }) {
  const { title, video, richText, extendedTitle, extendedContent, href } = card ?? {};
  const videoUrl = video?.asset?.url ?? null;
  const hasExtended = extendedContent && extendedContent.length > 0;

  const content = (
    <>
      {videoUrl && (
        <div className="relative w-full shrink-0 overflow-hidden aspect-video">
          <video
            autoPlay
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 bg-black"
            loop
            muted
            playsInline
            src={videoUrl}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      <div className="relative flex min-h-[130px] flex-1 flex-col items-center text-center px-5 py-4 bg-gradient-to-b from-black/60 to-black/80 dark:from-black/60 dark:to-black/80 transition-all duration-500">
        {title && (
          <h3 className="mb-1 text-base font-semibold text-white shrink-0">{title}</h3>
        )}
        <div className="flex w-full flex-1 flex-col justify-start">
          {richText && (
            <RichText
              className="text-xs text-white/70 [&_p]:text-white/70 [&_p]:leading-relaxed [&_li]:text-white/70"
              richText={richText}
            />
          )}
          {hasExtended && (
            <div className="w-full overflow-hidden">
              <div className="border-t border-white/10 mt-3 pt-3">
                {extendedTitle && (
                  <h4 className="mb-2 text-xs font-semibold text-white/80">
                    {extendedTitle}
                  </h4>
                )}
                <RichText
                  className="text-xs text-white/60 [&_p]:text-white/60 [&_p]:leading-relaxed [&_li]:text-white/60"
                  richText={extendedContent}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses =
    "group relative flex h-full flex-col w-full overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1";

  if (href) {
    return (
      <a href={href} className={cardClasses}>
        {content}
      </a>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}

export function ImageFeatureCards({
  eyebrow,
  title,
  description,
  cards,
  ctaTitle,
  ctaDescription,
  buttons,
}: ImageFeatureCardsProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="mb-12 flex w-full flex-col items-center text-center">
            {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
            <h2 className="mt-4 text-balance font-semibold text-3xl leading-tight md:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </AnimatedBlock>

        <AnimatedBlock delay={100}>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cards?.map((card, index) => (
              <AnimatedBlock key={index} delay={index * 100} className="h-full">
                <FeatureCard card={card} />
              </AnimatedBlock>
            ))}
          </div>
        </AnimatedBlock>

        {(ctaTitle || ctaDescription || buttons?.length) && (
          <AnimatedBlock delay={200}>
            <div className="mt-16 flex flex-col items-center text-center">
              {ctaTitle && (
                <h3 className="text-2xl font-semibold md:text-3xl text-foreground">
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
