import { Badge } from "@workspace/ui/components/badge";

import { AnimatedBlock } from "@/hooks/use-data-assembly";
import { RichText } from "@/components/elements/rich-text";
import type { PagebuilderType } from "@/types";

export type RichTextBlockProps = PagebuilderType<"richTextBlock">;

export function RichTextBlock({
  richText,
  title,
  eyebrow,
}: RichTextBlockProps) {
  return (
    <section className="my-10 md:my-16">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <div className="flex max-w-2xl flex-col items-center space-y-4 sm:space-y-6">
              {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
              {title && (
                <h2 className="font-semibold text-3xl leading-tight md:text-5xl">
                  {title}
                </h2>
              )}
            </div>

            <div className="mt-6 max-w-xl text-base md:text-lg">
              <RichText richText={richText} />
            </div>
          </div>
        </AnimatedBlock>
      </div>
    </section>
  );
}