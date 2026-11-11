import { homeContent } from "@/components/home-v1/content";
import { HomeShowcase, type ShowcaseItem } from "@/components/home-v1/home-showcase";
import type { getNewsList } from "@/lib/content/news";
import type { getProjectList } from "@/lib/content/projects";
import type { getPublications } from "@/lib/content/resources";

const byNewest =
  <T,>(date: (item: T) => string | null) =>
  (a: T, b: T) =>
    new Date(date(b) ?? 0).getTime() - new Date(date(a) ?? 0).getTime();

/**
 * "Our Work in Action", "Publications" and "News & Updates" as they were in the first
 * redesign: one large lead item with two smaller ones and a "see all" panel beside it, set in
 * the site's own type (lib/typography.ts) like every other section of the page.
 * Used by /home-preview-2 in place of the newer sections.
 */
export function HomeShowcases({
  projects,
  publications,
  news,
}: {
  projects: Awaited<ReturnType<typeof getProjectList>>;
  publications: Awaited<ReturnType<typeof getPublications>>;
  news: Awaited<ReturnType<typeof getNewsList>>;
}) {
  const { work } = homeContent;

  const projectItems: ShowcaseItem[] = projects.map((project) => {
    const meta = project.image_url ? work.images[project.image_url] : undefined;
    return {
      key: project.id,
      href: `/projects/${project.slug}`,
      title: project.title,
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
      return {
        key: publication.id,
        href: `/publications/${publication.slug}`,
        title: publication.title,
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
    description: post.excerpt,
    image: post.featured_image_url ? { src: post.featured_image_url, alt: post.title } : null,
  }));

  return (
    <>
      <HomeShowcase
        id="our-work"
        title={work.title}
        items={projectItems}
        more={work.more}
        inScreen
      />
      <HomeShowcase
        id="publications"
        title={homeContent.publications.title}
        items={publicationItems}
        more={homeContent.publications.more}
        tone="field"
        inScreen
      />
      <HomeShowcase
        id="news"
        title={homeContent.news.title}
        items={newsItems}
        more={homeContent.news.more}
        inScreen
      />
    </>
  );
}
