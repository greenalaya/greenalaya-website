import { HomeRedesign } from "@/components/home/home-redesign";
import { JsonLd } from "@/components/json-ld";
import { homePageJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = pageMetadata({
  title: siteConfig.name,
  description: siteConfig.description,
  path: "/",
  siteNameTitle: true,
});

// Projects, publications and news come from Supabase (with seed fallback), refreshed like their pages.
export const revalidate = 300;
export const dynamic = "force-static";

export default function Home() {
  return (
    <>
      <JsonLd data={homePageJsonLd()} />
      <HomeRedesign />
    </>
  );
}
