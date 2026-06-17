import { SANITY_BASE_URL } from "@workspace/sanity/image";
import Image from "next/image";

import type { PagebuilderType } from "@/types";
import { AnimatedBlock } from "@/hooks/use-data-assembly";

function sanityImageUrl(asset: { _ref: string } | undefined | null): string {
  if (!asset?._ref) return "";
  const match = asset._ref.match(/^image-(.+)-(\w+)$/);
  if (!match) return "";
  return `${SANITY_BASE_URL}${match[1]}.${match[2]}`;
}

type CredentialsTechStackProps = PagebuilderType<"credentialsTechStack">;

type TechItem = NonNullable<CredentialsTechStackProps["items"]>[number];

export function CredentialsTechStack({
  eyebrow,
  title,
  description,
  items,
}: CredentialsTechStackProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedBlock>
          <div className="mb-12 flex w-full flex-col items-center text-center">
            {eyebrow && (
              <span className="mb-4 text-sm font-medium uppercase tracking-wider text-foreground">
                {eyebrow}
              </span>
            )}
            <h2 className="text-balance font-semibold text-3xl leading-tight md:text-4xl">
              {title}
            </h2>
            {description && (
              <p className="mt-4 max-w-2xl text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </AnimatedBlock>

        {items && items.length > 0 && (
          <AnimatedBlock delay={200}>
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {items.map((item, index) => (
                <TechItemCard key={index} item={item} />
              ))}
            </div>
          </AnimatedBlock>
        )}
      </div>
    </section>
  );
}

function TechItemCard({ item }: { item: TechItem }) {
  const { name, logo, url } = item ?? {};

  const cardContent = (
    <div className="group flex w-28 flex-col items-center gap-3 md:w-36">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-border/50 bg-muted/30 p-3 transition-all duration-300 md:h-20 md:w-20 md:p-4">
        {logo?.asset ? (
          <Image
            src={sanityImageUrl(logo.asset)}
            alt={name || "Tech logo"}
            width={48}
            height={48}
            className="h-full w-full object-contain transition-all duration-300"
          />
        ) : (
          <span className="text-center text-xs font-medium text-muted-foreground">
            {name}
          </span>
        )}
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground md:text-sm">
        {name}
      </span>
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-transform hover:scale-105"
      >
        {cardContent}
      </a>
    );
  }

  return cardContent;
}