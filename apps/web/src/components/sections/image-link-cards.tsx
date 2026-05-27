import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

import type { PagebuilderType } from "@/types";
import { AnimatedBlock } from "@/hooks/use-data-assembly";
import { RichText } from "../elements/rich-text";
import { CTACard } from "../image-link-card";

export type ImageLinkCardsProps = PagebuilderType<"imageLinkCards">;

export function ImageLinkCards({
  richText,
  title,
  eyebrow,
  cards,
}: ImageLinkCardsProps) {
  return (
    <section className="my-16" id="image-link-cards">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-col items-center space-y-4 text-center sm:space-y-6 md:text-center">
              {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}

              <h2 className="text-balance font-semibold text-3xl md:text-5xl">
                {title}
              </h2>

              <RichText className="text-balance" richText={richText} />
            </div>
          </div>
        </AnimatedBlock>

        {Array.isArray(cards) && cards.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {cards?.map((card, index) => (
              <AnimatedBlock
                key={card._key}
                delay={index * 100}
                className="flex w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
              >
                <CTACard
                  card={card}
                  className={cn(
                    "h-full w-full bg-muted-foreground/10 dark:bg-zinc-800"
                  )}
                />
              </AnimatedBlock>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}