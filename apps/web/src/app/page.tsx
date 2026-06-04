import { sanityFetch } from "@workspace/sanity/live";
import { queryHomePageData, querySettingsData } from "@workspace/sanity/query";

import { HeroBlock } from "@/components/sections/hero";
import { PageBuilder } from "@/components/pagebuilder";
import { getSEOMetadata } from "@/lib/seo";

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePageData,
  });
}

export async function generateMetadata() {
  const [{ data: homePageData }, { data: settings }] = await Promise.all([
    fetchHomePageData(),
    sanityFetch({ query: querySettingsData }),
  ]);
  return getSEOMetadata({
    title: homePageData?.title ?? homePageData?.seoTitle,
    description: homePageData?.description ?? homePageData?.seoDescription,
    slug: "/",
    contentId: homePageData?._id,
    contentType: homePageData?._type,
    settings,
  });
}

export default async function Page() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return (
      <HeroBlock
        title="Welcome to Archeon"
        badge="Turbo + Sanity"
        richText={[]}
      />
    );
  }

  const { _id, _type, pageBuilder } = homePageData ?? {};

  return <PageBuilder id={_id} pageBuilder={pageBuilder ?? []} type={_type} />;
}
