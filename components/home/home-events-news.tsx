import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import type { ProgramEvent } from "@/lib/content/events";
import { homeContent } from "@/lib/site";
import {
  homeArrowIconClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";
import {
  NewsMediaTabs,
  type CoverageListItem,
  type NewsListItem,
} from "@/components/home/news-media-tabs";

type HomeEventsNewsProps = {
  events: ProgramEvent[];
  news: NewsListItem[];
  coverage: CoverageListItem[];
};

/** Events on the left; News & Media (our stories and press coverage) on the right. */
export function HomeEventsNews({ events, news, coverage }: HomeEventsNewsProps) {
  const { events: eventsCopy, news: newsCopy } = homeContent;

  return (
    <div className="py-16 md:py-20">
      <div className={`${homeContainerClass} grid gap-14 lg:grid-cols-12 lg:gap-12`}>
        <section
          id="events"
          aria-labelledby="home-events-title"
          className="scroll-mt-24 lg:col-span-5"
        >
          <h2 id="home-events-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {eventsCopy.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-home-ink sm:text-lg">
            {eventsCopy.description}
          </p>
          <ul className="mt-6 space-y-3">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={event.href}
                  className="group/event block rounded-lg bg-home-field p-4 no-underline transition-colors duration-200 hover:bg-home-field/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action sm:p-5"
                >
                  <p className="text-sm font-semibold text-home-accent">{event.dateLabel}</p>
                  <p className="mt-1 text-xl leading-snug font-semibold text-home-ink">
                    {event.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-home-ink">
                    <MapPin aria-hidden className="size-4 shrink-0 text-home-accent" />
                    {event.place}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-home-ink">{event.summary}</p>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-home-accent">
                    Read more
                    <ArrowRight aria-hidden className={homeArrowIconClass} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="news" aria-labelledby="home-news-title" className="scroll-mt-24 lg:col-span-7">
          <h2 id="home-news-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {newsCopy.title}
          </h2>
          <div className="mt-6">
            <NewsMediaTabs
              labels={newsCopy.tabs}
              news={news}
              coverage={coverage}
              more={newsCopy.more}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
