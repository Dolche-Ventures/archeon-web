import { Badge } from "@workspace/ui/components/badge";

import type { PagebuilderType } from "@/types";
import { AnimatedBlock } from "@/hooks/use-data-assembly";
import { RichText } from "../elements/rich-text";
import { SanityImage } from "../elements/sanity-image";

type ImageTextBlockProps = PagebuilderType<"imageTextBlock">;

export function ImageTextBlock({
  eyebrow,
  title,
  image,
  richText,
}: ImageTextBlockProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="mb-8 flex flex-col items-center space-y-4 text-center">
            {eyebrow && <Badge variant="secondary">{eyebrow}</Badge>}
            <h2 className="font-semibold text-3xl leading-tight md:text-4xl">
              {title}
            </h2>
          </div>
        </AnimatedBlock>

        {image && (
          <AnimatedBlock delay={100}>
            <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl">
              <SanityImage
                alt={image.alt || title || ""}
                className="h-full w-full object-cover"
                height={250}
                image={image}
                width={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center p-6 md:p-8">
                <div className="max-w-xl text-center">
                  <RichText
                    className="[&_p]:text-base [&_p]:text-white [&_p]:leading-relaxed [&_a]:underline [&_a]:decoration-dotted"
                    richText={richText}
                  />
                </div>
              </div>
            </div>
          </AnimatedBlock>
        )}
      </div>
    </section>
  );
}
