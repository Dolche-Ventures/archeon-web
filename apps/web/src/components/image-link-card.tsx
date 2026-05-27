import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

import type { PagebuilderType } from "@/types";
import { SanityImage } from "./elements/sanity-image";

type ImageLinkCard = NonNullable<
  NonNullable<PagebuilderType<"imageLinkCards">["cards"]>
>[number];

export type CTACardProps = {
  card: ImageLinkCard;
  className?: string;
};

export function CTACard({ card, className }: CTACardProps) {
  const { image, description, title, href, ctaText } = card ?? {};

  return (
    <Link
      className={cn(
        "group flex h-full min-h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-br from-zinc-100 to-zinc-200 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-zinc-500/10 dark:from-zinc-800 dark:to-zinc-900/50",
        className
      )}
      href={href ?? "#"}
    >
      {image?.id && (
        <div className="relative h-[260px] min-h-[260px] max-h-[260px] w-full shrink-0 overflow-hidden">
          <SanityImage
            className="block h-full w-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 dark:opacity-60 dark:group-hover:opacity-90"
            height={1080}
            image={image}
            loading="lazy"
            width={1920}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 md:p-8">
        <h3 className="text-lg font-semibold tracking-tight md:text-xl">
          {title}
        </h3>

        <p className="mt-2 line-clamp-4 text-sm text-muted-foreground">
          {description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-foreground transition-all duration-300 group-hover:gap-2.5">
          {ctaText || "See More"}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}