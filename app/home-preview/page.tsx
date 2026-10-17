import { Newsreader } from "next/font/google";
import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { StrategicPillarsOrbit } from "@/components/strategic-pillars-orbit";
import { ThematicAreasSection } from "@/components/thematic-areas-section";
import { HomeAbout } from "@/components/home/home-about";
import { HomeHero } from "@/components/home/home-hero";
import { HomeShowcase, type ShowcaseItem } from "@/components/home/home-showcase";
import { getNewsList } from "@/lib/content/news";
import { getProjectList } from "@/lib/content/projects";
import { getPublications } from "@/lib/content/resources";
import { formatLongDate, formatMonthYearParts } from "@/lib/format";
import { homeContent, homePreviewPath, publicationPageCounts, siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-newsreader",
});

/** Test version of the redesigned homepage. Not indexed; replaces `/` once approved. */
export const metadata = pageMetadata({
  title: "Homepage preview",
  description: siteConfig.description,
  path: homePreviewPath,
  noIndex: true,
});

// Projects, publications and news come from Supabase (with seed fallback), refreshed like their pages.
export const revalidate = 300;
export const dynamic = "force-static";

const byNewest =
  <T,>(date: (item: T) => string | null) =>
  (a: T, b: T) =>
    new Date(date(b) ?? 0).getTime() - new Date(date(a) ?? 0).getTime();

export default async function HomePreviewPage() {
  const [projects, publications, news] = await Promise.all([
    getProjectList(),
    getPublications(),
    getNewsList(),
  ]);

  const { work } = homeContent;

  const projectItems: ShowcaseItem[] = projects.map((project) => {
    const meta = project.image_url ? work.images[project.image_url] : undefined;
    return {
      key: project.id,
      href: `/projects/${project.slug}`,
      title: project.title,
      meta: work.statuses[project.slug],
      description: project.description,
      image: project.image_url
        ? {
            src: project.image_url,
            alt: meta?.alt ?? project.title,
            darkSrc: meta?.darkSrc,
            fit: meta?.isLogo ? "contain" : "cover",
          }
        : null,
    };
  });

  const publicationItems: ShowcaseItem[] = [...publications]
    .sort(byNewest((item) => item.publishedDateIso))
    .map((publication) => {
      const date = formatMonthYearParts(publication.publishedDateIso);
      const pages = publicationPageCounts[publication.slug];
      return {
        key: publication.id,
        href: `/publications/${publication.slug}`,
        title: publication.title,
        meta: [date ? `${date.month} ${date.year}` : null, pages ? `${pages} pages` : null]
          .filter(Boolean)
          .join(" · "),
        description: publication.abstract,
        image: {
          src: publication.coverImage,
          alt: `Cover of ${publication.title}`,
          fit: "contain",
        },
      };
    });

  const newsItems: ShowcaseItem[] = news.map((post) => ({
    key: post.id,
    href: `/news/${post.slug}`,
    title: post.title,
    meta: formatLongDate(post.published_at),
    description: post.excerpt,
    image: post.featured_image_url ? { src: post.featured_image_url, alt: post.title } : null,
  }));

  return (
    <main
      className={`${newsreader.variable} bg-home-ground text-home-ink selection:bg-home-sage/60 selection:text-home-ink`}
    >
      <HomeHero />
      <HomeAbout />
      <StrategicPillarsOrbit themed />
      <ThematicAreasSection themed />
      <HomeShowcase
        id="our-work"
        title={work.title}
        items={projectItems}
        more={work.more}
        leadLinkLabel="View the project"
      />
      <HomeShowcase
        id="publications"
        title={homeContent.publications.title}
        items={publicationItems}
        more={homeContent.publications.more}
        tone="field"
        leadLinkLabel="Read the publication"
      />
      <HomeShowcase
        id="news"
        title={homeContent.news.title}
        items={newsItems}
        more={homeContent.news.more}
        leadLinkLabel="Read the story"
      />
      <FooterStayAhead themed />
    </main>
  );
}
