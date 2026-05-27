import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { AnimatedBlock } from "@/hooks/use-data-assembly";
import { RichText } from "../elements/rich-text";
import { SanityButtons } from "../elements/sanity-buttons";

export type CTABlockProps = PagebuilderType<"cta">;

export function CTABlock({ richText, title, eyebrow, buttons }: CTABlockProps) {
  return (
    <section className="my-6 md:my-16" id="features">
      <div className="container mx-auto px-4 md:px-8">
        <AnimatedBlock>
          <div className="relative rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 via-zinc-200/80 to-zinc-100 dark:from-zinc-800 dark:via-zinc-900/80 dark:to-zinc-800 px-4 py-16 transition-all duration-300 hover:border-foreground/50 hover:shadow-2xl hover:shadow-zinc-500/10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent dark:from-white/5 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="mx-auto max-w-3xl space-y-8 text-center relative z-10">
              {eyebrow && (
                <Badge
                  className="bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-100 font-medium"
                  variant="secondary"
                >
                  {eyebrow}
                </Badge>
              )}
              <h2 className="text-balance font-bold text-4xl md:text-5xl tracking-tight">
                {title}
              </h2>
              <div className="text-lg text-muted-foreground">
                <RichText className="text-balance" richText={richText} />
              </div>
              <div className="flex justify-center">
                <SanityButtons
                  buttonClassName="w-full sm:w-auto"
                  buttons={buttons}
                  className="mb-8 grid w-full gap-2 sm:w-fit sm:grid-flow-col lg:justify-start"
                />
              </div>
            </div>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}
