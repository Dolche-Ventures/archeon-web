import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";

import type { PagebuilderType } from "@/types";
import { AnimatedBlock } from "@/hooks/use-data-assembly";
import { RichText } from "../elements/rich-text";
import { SanityIcon } from "../elements/sanity-icon";

type FeatureCardsWithIconProps = PagebuilderType<"featureCardsIcon">;

type FeatureCardProps = {
  card: NonNullable<FeatureCardsWithIconProps["cards"]>[number];
  index: number;
};

function FeatureCard({ card, index }: FeatureCardProps) {
  const { icon, title, richText } = card ?? {};

  const iconStyles = [
    "bg-gradient-to-br from-foreground/10 to-foreground/5",
    "bg-gradient-to-br from-foreground/10 to-transparent",
    "bg-gradient-to-br from-foreground/10 to-foreground/5",
  ];

  return (
    <AnimatedBlock delay={index * 100}>
      <div className="group relative rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900/50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/50 hover:shadow-xl hover:shadow-zinc-500/10 dark:hover:shadow-zinc-950/30 md:min-h-64 md:p-8">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <span className={`mb-9 flex w-fit items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm p-4 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl ${iconStyles[index % iconStyles.length]}`}>
          <SanityIcon icon={icon} className="text-foreground" />
        </span>

        <div>
          <h3 className="mb-2 font-semibold text-xl md:text-2xl tracking-tight">{title}</h3>
          <RichText
            className="text-balance font-normal text-base leading-7 text-muted-foreground"
            richText={richText}
          />
        </div>
      </div>
    </AnimatedBlock>
  );
}

export function FeatureCardsWithIcon({
  eyebrow,
  title,
  richText,
  cards,
}: FeatureCardsWithIconProps) {
  return (
    <section className="my-10 md:my-16" id="features">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
              {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
              <h2 className="text-balance font-bold text-4xl leading-tight md:text-5xl tracking-tight">
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
            <FeatureCard
              card={card}
              key={`FeatureCard-${card?._key}-${index}`}
              index={index}
            />
          ))}
        </div>

        <AnimatedBlock delay={300}>
          <div className="mt-12 flex flex-col items-center text-center">
            <h3 className="mb-2 font-semibold text-lg md:text-xl">
              Not Sure?
            </h3>
            <p className="mb-4 max-w-md text-muted-foreground text-sm">
              Take our quiz to find out where your current journey is
            </p>
            <Link
              href="/quiz"
              className="rounded-full border border-white/20 bg-transparent px-8 py-3 text-sm font-medium text-muted-foreground shadow-none transition-all hover:border-foreground hover:text-foreground hover:opacity-80 active:scale-95"
            >
              Take our Quiz Now
            </Link>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}
