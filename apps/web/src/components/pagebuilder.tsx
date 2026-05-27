"use client";

import { useOptimistic } from "@sanity/visual-editing/react";
import { env } from "@workspace/env/client";
import { createDataAttribute } from "next-sanity";
import { useCallback, useMemo } from "react";

import type { PageBuilderBlock, PageBuilderBlockTypes } from "@/types";
import { CaseStudiesHero } from "./sections/case-studies-hero";
import { CredentialsHero } from "./sections/credentials-hero";
import { CredentialsTechStack } from "./sections/credentials-tech-stack";
import { CTABlock } from "./sections/cta";
import { FaqAccordion } from "./sections/faq-accordion";
import { FeatureCardsWithCTAIcon } from "./sections/feature-cards-with-cta";
import { FeatureCardsWithIcon } from "./sections/feature-cards-with-icon";
import { HeroBlock } from "./sections/hero";
import { ImageFeatureCards } from "./sections/image-feature-cards";
import { ImageLinkCards } from "./sections/image-link-cards";
import { ImageTextBlock } from "./sections/image-text-block";
import { InquiryFormSection } from "./sections/inquiry-form-section";
import { InquiryHero } from "./sections/inquiry-hero";
import { RichTextBlock } from "./sections/rich-text-block";
import { ServicePillarsSection } from "./sections/service-pillars-section";
import { ServicesHero } from "./sections/services-hero";
import { SubscribeNewsletter } from "./sections/subscribe-newsletter";
import { ValuePropositionSection } from "./sections/value-proposition-section";
import { CSIndividualCaseStudyBlock } from "./case-study-individual/cs-individual-case-study";

export type PageBuilderProps = {
  readonly pageBuilder?: PageBuilderBlock[];
  readonly id: string;
  readonly type: string;
};

type SanityDataAttributeConfig = {
  readonly id: string;
  readonly type: string;
  readonly path: string;
};

// Strongly typed component mapping with proper component signatures
const BLOCK_COMPONENTS = {
  cta: CTABlock,
  caseStudiesHero: CaseStudiesHero,
  credentialsHero: CredentialsHero,
  credentialsTechStack: CredentialsTechStack,
  faqAccordion: FaqAccordion,
  hero: HeroBlock,
  featureCardsIcon: FeatureCardsWithIcon,
  featureCardsIconWithCTA: FeatureCardsWithCTAIcon,
  imageFeatureCards: ImageFeatureCards,
  imageTextBlock: ImageTextBlock,
  inquiryFormSection: InquiryFormSection,
  inquiryHero: InquiryHero,
  servicePillarsSection: ServicePillarsSection,
  servicesHero: ServicesHero,
  subscribeNewsletter: SubscribeNewsletter,
  imageLinkCards: ImageLinkCards,
  richTextBlock: RichTextBlock,
  valuePropositionSection: ValuePropositionSection,
  csIndividualCaseStudy: CSIndividualCaseStudyBlock,
  // biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering>
} as const satisfies Record<PageBuilderBlockTypes, React.ComponentType<any>>;

/**
 * Helper function to create consistent Sanity data attributes
 */
function createSanityDataAttribute(config: SanityDataAttributeConfig): string {
  return createDataAttribute({
    id: config.id,
    baseUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    type: config.type,
    path: config.path,
  }).toString();
}

/**
 * Error fallback component for unknown block types
 */
function UnknownBlockError({
  blockType,
  blockKey,
}: {
  blockType: string;
  blockKey: string;
}) {
  return (
    <div
      aria-label={`Unknown block type: ${blockType}`}
      className="flex items-center justify-center rounded-lg border-2 border-muted-foreground/20 border-dashed bg-muted p-8 text-center text-muted-foreground"
      key={`${blockType}-${blockKey}`}
      role="alert"
    >
      <div className="space-y-2">
        <p>Component not found for block type:</p>
        <code className="rounded bg-background px-2 py-1 font-mono text-sm">
          {blockType}
        </code>
      </div>
    </div>
  );
}

/**
 * Hook to handle optimistic updates for page builder blocks
 */
function useOptimisticPageBuilder(
  initialBlocks: PageBuilderBlock[],
  documentId: string
) {
  // biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering>
  return useOptimistic<PageBuilderBlock[], any>(
    initialBlocks,
    (currentBlocks, action) => {
      if (action.id === documentId && action.document?.pageBuilder) {
        return action.document.pageBuilder;
      }
      return currentBlocks;
    }
  );
}

/**
 * Custom hook for block component rendering logic
 */
function useBlockRenderer(id: string, type: string) {
  const createBlockDataAttribute = useCallback(
    (blockKey: string) =>
      createSanityDataAttribute({
        id,
        type,
        path: `pageBuilder[_key=="${blockKey}"]`,
      }),
    [id, type]
  );

  const renderBlock = useCallback(
    (block: PageBuilderBlock, _index: number) => {
      const Component =
        BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS];

      if (!Component) {
        return (
          <UnknownBlockError
            blockKey={block._key}
            blockType={block._type}
            key={`${block._type}-${block._key}`}
          />
        );
      }

      return (
        <div
          data-sanity={createBlockDataAttribute(block._key)}
          key={`${block._type}-${block._key}`}
        >
          {/** biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering> */}
          <Component {...(block as any)} />
        </div>
      );
    },
    [createBlockDataAttribute]
  );

  return { renderBlock };
}

/**
 * PageBuilder component for rendering dynamic content blocks from Sanity CMS
 */
export function PageBuilder({
  pageBuilder: initialBlocks = [],
  id,
  type,
}: PageBuilderProps) {
  const blocks = useOptimisticPageBuilder(initialBlocks, id);
  const { renderBlock } = useBlockRenderer(id, type);

  const containerDataAttribute = useMemo(
    () => createSanityDataAttribute({ id, type, path: "pageBuilder" }),
    [id, type]
  );

  if (!blocks.length) {
    return null;
  }

  const findBlockIndex = (blocks: PageBuilderBlock[], type: string) =>
    blocks.findIndex((b) => b._type === type);

  const valuePropIndex = findBlockIndex(blocks, "valuePropositionSection");
  const firstRegularIndex = valuePropIndex > -1 ? valuePropIndex : 0;

  return (
    <main
      className="mx-auto flex max-w-7xl flex-col"
      data-sanity={containerDataAttribute}
    >
      {blocks.map((block, index) => {
        const Component =
          BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS];

        if (!Component) {
          return (
            <UnknownBlockError
              blockKey={block._key}
              blockType={block._type}
              key={`${block._type}-${block._key}`}
            />
          );
        }

        const isValueProp = block._type === "valuePropositionSection";

        const dataAttr = createSanityDataAttribute({
          id,
          type,
          path: `pageBuilder[_key=="${block._key}"]`,
        });

        return (
          <div key={`${block._type}-${block._key}`}>
            <div data-sanity={dataAttr}>
              {/** biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering> */}
              <Component {...(block as any)} />
            </div>
            {index < blocks.length - 1 && (
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent my-6" />
            )}
          </div>
        );
      })}
    </main>
  );
}
