import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { HomeEventsNews } from "@/components/home/home-events-news";
import { HomeFlagshipSpecies } from "@/components/home/home-flagship-species";
import { HomeImpact } from "@/components/home/home-impact";
import { HomePress } from "@/components/home/home-press";
import { HomePublications, type PublicationListItem } from "@/components/home/home-publications";
import { HomeShowcase, type ShowcaseItem } from "@/components/home/home-showcase";
import { HomeWorkMap } from "@/components/home/home-work-map";
import { HomeShowcases } from "@/components/home-v1/home-showcases";
import { getProgramEvents } from "@/lib/content/events";
import { getMediaCoverage } from "@/lib/content/media-coverage";
import { getNewsList } from "@/lib/content/news";
import { getProjectList } from "@/lib/content/projects";
import { getPublications } from "@/lib/content/resources";
import { formatLongDate, formatMonthYearParts } from "@/lib/format";
import type { ReactNode } from "react";
import { homeContent, publicationPageCounts } from "@/lib/site";
import { homeScreenClass } from "@/components/home/home-styles";
import { ScrollToNext, ScrollToPrevious } from "@/components/scroll-to-next";
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
  showcases = true,
}: {
  /**
   * Show the work, publications, news and press sections after "Where We Work" (and the
   * flagship species). Without them the page goes from the last of those straight to the
   * closing band; each has its own page, linked from the header.
   */
  showcases?: boolean;
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
   * On a laptop every section is one screen (the hero, the impact figures, "Where We Work" and
   * so on, down to the closing band with the footer). The page scrolls normally; with
   * `originalShowcases`, each screen has the About page's bouncing up and down arrows.
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

  // Laptops: an up arrow at the top of each screen and a down arrow at its foot, as on the
  // About page, in the order the screens come.
  const withArrows = oneScreenEach && originalShowcases;
  const screenOrder = [
    "home-top",
    "impact-screen",
    "where-we-work",
    ...(flagshipSpecies ? ["flagship-species"] : []),
    ...(showcases ? ["our-work", "publications", "news", "press"] : []),
    "get-involved",
  ];
  const screenNames: Record<string, string> = {
    "home-top": "the top",
    "impact-screen": "our impact",
    "where-we-work": "where we work",
    "flagship-species": "our flagship species",
    "our-work": "our work",
    publications: "our publications",
    news: "our news",
    press: "the national press",
    "get-involved": "get involved",
  };
  const neighbours = (id: string) => {
    const index = screenOrder.indexOf(id);
    const previous = screenOrder[index - 1];
    const next = screenOrder[index + 1];
    return {
      previous: previous
        ? { href: `#${previous}` as const, label: `Back to ${screenNames[previous]}` }
        : null,
      next: next ? { href: `#${next}` as const, label: `Scroll to ${screenNames[next]}` } : null,
    };
  };
  const wrapScreen = (id: string, screen: ReactNode) => {
    if (!withArrows) return screen;
    const { previous, next } = neighbours(id);
    return (
      <div className="relative" id={id === "home-top" ? id : undefined}>
        {previous ? <ScrollToPrevious href={previous.href} label={previous.label} /> : null}
        {screen}
        {next ? (
          <ScrollToNext
            href={next.href}
            label={next.label}
            // The hero: in the middle, in front of the tree trunk and above the grass; light,
            // so it shows against the dark bark.
            className={
              id === "home-top"
                ? "z-30 lg:bottom-16 [&>a]:text-white/80 [&>a:hover]:text-white [&_svg]:size-6 [&_svg]:drop-shadow-[0_1px_2px_rgb(0_0_0/0.45)]"
                : undefined
            }
          />
        ) : null}
      </div>
    );
  };
  const beforeFooter = neighbours("get-involved").previous;

  return (
    <main className="bg-home-ground text-home-ink selection:bg-home-sage/60 selection:text-home-ink">
      {wrapScreen("home-top", hero)}
      {oneScreenEach ? (
        wrapScreen(
          "impact-screen",
          // One screen for the funders (when given) and the impact figures, centred in it. At
          // least one screen rather than exactly one: in a window too short for both, the
          // screen grows instead of its content spilling over the hero above.
          <div
            id="impact-screen"
            className={cn(
              "border-t border-home-line lg:justify-center",
              homeScreenClass,
              "py-0 md:py-0 lg:h-auto lg:min-h-[calc(100svh-4.5rem)]",
            )}
          >
            {supporters}
            <HomeImpact showDraft={showDraftImpact} inScreen afterFunders={Boolean(supporters)} />
          </div>,
        )
      ) : (
        <>
          {supporters}
          <HomeImpact showDraft={showDraftImpact} />
        </>
      )}
      {wrapScreen("where-we-work", <HomeWorkMap inScreen={oneScreenEach} />)}
      {flagshipSpecies ? wrapScreen("flagship-species", <HomeFlagshipSpecies />) : null}
      {!showcases ? null : originalShowcases ? (
        <>
          <HomeShowcases
            projects={projects}
            publications={publications}
            news={news}
            wrapScreen={wrapScreen}
          />
          {/* After the organisation's own news: what the national newspapers wrote about it. */}
          {wrapScreen("press", <HomePress items={coverageItems} />)}
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
      <FooterStayAhead
        fillScreenWithFooter={
          withArrows && beforeFooter
            ? { previousHref: beforeFooter.href, previousLabel: beforeFooter.label }
            : undefined
        }
      />
    </main>
  );
}
