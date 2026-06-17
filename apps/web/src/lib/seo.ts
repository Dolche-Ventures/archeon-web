import type { Metadata } from "next";

import type { Maybe } from "@/types";
import { capitalize, getBaseUrl } from "@/utils";

// Site-wide configuration interface
type SiteConfig = {
  title: string;
  description: string;
  twitterHandle: string;
  keywords: string[];
};

// Page-specific SEO data interface
interface PageSeoData extends Metadata {
  title?: string;
  description?: string;
  slug?: string;
  contentId?: string;
  contentType?: string;
  keywords?: string[];
  seoNoIndex?: boolean;
  pageType?: Extract<Metadata["openGraph"], { type: string }>["type"];
  /** Override site-wide defaults from Sanity settings */
  settings?: {
    siteTitle?: string | null;
    siteDescription?: string | null;
    twitterHandle?: string | null;
    siteKeywords?: (string | null)[] | null;
  } | null;
}

// OpenGraph image generation parameters
type OgImageParams = {
  type?: string;
  id?: string;
};

// Default site configuration
const siteConfig: SiteConfig = {
  title: "Archeon Consulting",
  description: "Archeon Consulting",
  twitterHandle: "@archeonconsulting",
  keywords: ["archeon", "consulting", "data", "analytics", "engineering"],
};

function generateOgImageUrl(params: OgImageParams = {}): string {
  const { type, id } = params;
  const searchParams = new URLSearchParams();

  if (id) {
    searchParams.set("id", id);
  }
  if (type) {
    searchParams.set("type", type);
  }

  const baseUrl = getBaseUrl();
  return `${baseUrl}/api/og?${searchParams.toString()}`;
}

function buildPageUrl({
  baseUrl,
  slug,
}: {
  baseUrl: string;
  slug: string;
}): string {
  const normalizedSlug = slug.startsWith("/") ? slug : `/${slug}`;
  return `${baseUrl}${normalizedSlug}`;
}

function extractTitle({
  pageTitle,
  slug,
  siteTitle,
}: {
  pageTitle?: Maybe<string>;
  slug: string;
  siteTitle: string;
}): string {
  if (pageTitle) {
    return pageTitle;
  }
  if (slug && slug !== "/") {
    return capitalize(slug.replace(/^\//, ""));
  }
  return siteTitle;
}

export function getSEOMetadata(page: PageSeoData = {}): Metadata {
  const {
    title: pageTitle,
    description: pageDescription,
    slug = "/",
    contentId,
    contentType,
    keywords: pageKeywords = [],
    seoNoIndex = false,
    pageType = "website",
    settings,
    ...pageOverrides
  } = page;

  const settingsKw = settings?.siteKeywords?.filter(Boolean) as string[] | undefined;
  const resolvedConfig = {
    title: settings?.siteTitle ?? siteConfig.title,
    description: settings?.siteDescription ?? siteConfig.description,
    twitterHandle: settings?.twitterHandle ?? siteConfig.twitterHandle,
    keywords: [
      ...(settingsKw?.length ? settingsKw : siteConfig.keywords),
      ...pageKeywords,
    ],
  };

  const baseUrl = getBaseUrl();
  const pageUrl = buildPageUrl({ baseUrl, slug });

  // Build default metadata values
  const defaultTitle = extractTitle({
    pageTitle,
    slug,
    siteTitle: resolvedConfig.title,
  });
  const defaultDescription = pageDescription || resolvedConfig.description;
  const allKeywords = resolvedConfig.keywords;

  const ogImage = generateOgImageUrl({
    type: contentType,
    id: contentId,
  });

  const fullTitle =
    defaultTitle === resolvedConfig.title
      ? defaultTitle
      : `${defaultTitle} | ${resolvedConfig.title}`;

  // Build default metadata object
  const defaultMetadata: Metadata = {
    title: fullTitle,
    description: defaultDescription,
    metadataBase: new URL(baseUrl),
    creator: resolvedConfig.title,
    authors: [{ name: resolvedConfig.title }],
    icons: {
      icon: `${baseUrl}/favicon.ico`,
    },
    keywords: allKeywords,
    robots: seoNoIndex ? "noindex, nofollow" : "index, follow",
    twitter: {
      card: "summary_large_image",
      images: [ogImage],
      creator: resolvedConfig.twitterHandle,
      title: defaultTitle,
      description: defaultDescription,
    },
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: pageType ?? "website",
      countryName: "UK",
      description: defaultDescription,
      title: defaultTitle,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: defaultTitle,
          secureUrl: ogImage,
        },
      ],
      url: pageUrl,
    },
  };

  // Override any defaults with page-specific metadata
  return {
    ...defaultMetadata,
    ...pageOverrides,
  };
}
