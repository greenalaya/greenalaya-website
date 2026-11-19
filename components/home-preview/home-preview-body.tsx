import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { HomeEventsNews } from "@/components/home-preview/home-events-news";
import { HomeFlagshipSpecies } from "@/components/home-preview/home-flagship-species";
import { HomeImpact } from "@/components/home-preview/home-impact";
import { HomeScreenScroller } from "@/components/home-preview/home-screen-scroller";
import { HomePress } from "@/components/home-preview/home-press";
import {
  HomePublications,
  type PublicationListItem,
} from "@/components/home-preview/home-publications";
import { HomeShowcase, type ShowcaseItem } from "@/components/home-preview/home-showcase";
import { HomeWorkMap } from "@/components/home-preview/home-work-map";
import { HomeShowcases } from "@/components/home-preview/v1/home-showcases";
import { getProgramEvents } from "@/lib/content/events";
import { getMediaCoverage } from "@/lib/content/media-coverage";
import { getNewsList } from "@/lib/content/news";
import { getProjectList } from "@/lib/content/projects";
import { getPublications } from "@/lib/content/resources";
import { formatLongDate, formatMonthYearParts } from "@/lib/format";
import type { ReactNode } from "react";
import { homeContent, publicationPageCounts } from "@/lib/site";
import { homeScreenClass } from "@/components/home-preview/home-styles";
import { cn } from "@/lib/utils";

const byNewest =
  <T,>(date: (item: T) => string | null) =>
  (a: T, b: T) =>
    new Date(date(b) ?? 0).getTime() - new Date(date(a) ?? 0).getTime();

/**
 * The homepage test pages share everything below the hero: they load the same projects,
 * publications and news and render the same sections, so only the first screen differs.
 */
export async function HomePreviewBody({
  hero,
  supporters,
  showDraftImpact = false,
  oneScreenEach = false,
  originalShowcases = false,
  flagshipSpecies = false,
}: {
  /** Show "Our Flagship Species" (butterflies, moths, fireflies) after "Where We Work". */
  flagshipSpecies?: boolean;
  /**
   * Show "Our Work in Action", "Publications" and "News & Updates" as they were in the first
   * redesign (components/home-v1), in place of the newer work, publications and events/news
   * sections.
   */
  originalShowcases?: boolean;
  hero: ReactNode;
  /**
   * A "Supported by" section, straight after the hero. With `oneScreenEach` it shares one
   * screen with the impact figures.
   */
  supporters?: ReactNode;
  /** Show the impact figures even while they are a draft (see HomeImpact). */
  showDraftImpact?: boolean;
  /**
   * On a laptop every section is one screen, and scrolling snaps from one to the next (the
   * hero, the funders with the impact figures, "Where We Work" and so on, down to the closing
   * band with the footer).
   */
  oneScreenEach?: boolean;
}) {
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
      status: work.statuses[project.slug] ?? null,
      description: project.description,
      image: project.image_url
        ? {
            src: project.image_url,
            alt: meta?.alt ?? project.title,
            darkSrc: meta?.darkSrc,
            fit: meta?.isLogo ? "contain" : "cover",
            position: meta?.position,
          }
        : null,
    };
  });

  const publicationItems: PublicationListItem[] = [...publications]
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
        cover: { src: publication.coverImage, alt: `Cover of ${publication.title}` },
      };
    });

  const newsItems = news.slice(0, 3).map((post) => ({
    key: post.id,
    href: `/news/${post.slug}`,
    title: post.title,
    date: formatLongDate(post.published_at),
    image: post.featured_image_url ? { src: post.featured_image_url, alt: post.title } : null,
  }));

  const coverageItems = getMediaCoverage().map((item) => ({
    key: item.id,
    url: item.url,
    outlet: item.outlet,
    headline: item.headline,
    date: formatLongDate(item.publishedOn) ?? item.publishedOn,
    language: item.language,
  }));

  return (
    <main
      data-snap-screens={oneScreenEach ? "" : undefined}
      className="bg-home-ground text-home-ink selection:bg-home-sage/60 selection:text-home-ink"
    >
      {oneScreenEach ? <HomeScreenScroller /> : null}
      {hero}
      {oneScreenEach && supporters ? (
        // One screen for both, their content centred in it. At least one screen rather than
        // exactly one: in a window too short for both, the screen grows instead of its content
        // spilling over the hero above.
        <div
          className={cn(
            "border-t border-home-line lg:justify-center",
            homeScreenClass,
            "py-0 md:py-0 lg:h-auto lg:min-h-[calc(100svh-4.5rem)]",
          )}
        >
          {supporters}
          <HomeImpact showDraft={showDraftImpact} inScreen />
        </div>
      ) : (
        <>
          {supporters}
          <HomeImpact showDraft={showDraftImpact} />
        </>
      )}
      <HomeWorkMap inScreen={oneScreenEach} />
      {flagshipSpecies ? <HomeFlagshipSpecies /> : null}
      {originalShowcases ? (
        <>
          <HomeShowcases projects={projects} publications={publications} news={news} />
          {/* After the organisation's own news: what the national newspapers wrote about it. */}
          <HomePress items={coverageItems} />
        </>
      ) : (
        <>
          <HomeShowcase
            id="our-work"
            title={work.title}
            items={projectItems}
            more={work.more}
            leadLinkLabel="View the project"
          />
          <HomePublications items={publicationItems} />
          <HomeEventsNews events={getProgramEvents()} news={newsItems} coverage={coverageItems} />
        </>
      )}
      {/* The same closing band as the About page, so the redesigned pages end alike. */}
      <FooterStayAhead themed />
    </main>
  );
}
