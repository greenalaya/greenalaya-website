import { ArrowUpRight } from "lucide-react";
import { formatLongDate } from "@/lib/format";
import { pageTitleClass } from "@/lib/typography";

/** HTML language codes for entries that are not in the page's own language (English). */
const languageCodes: Record<string, string> = { Nepali: "ne" };

export type NewsListEntry = {
  id: string;
  /** The small line above the title, e.g. the newspaper's name. */
  kicker?: string;
  title: string;
  /** ISO date. */
  date: string;
  summary?: string;
  href?: string;
  /** The entry's language, e.g. "Nepali": anything but English is marked up as such. */
  language?: string;
};

/**
 * A plain dated list under a page title: the Media Coverage and Notices pages (in the News
 * menu). Entries with a link open it in a new tab.
 */
export function NewsListPage({
  heading,
  intro,
  entries,
  emptyMessage,
}: {
  heading: string;
  intro: string;
  entries: NewsListEntry[];
  emptyMessage: string;
}) {
  return (
    <main className="bg-background px-5 pt-28 pb-20 sm:px-6 md:pt-32 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-3xl">
        <h1 className={`${pageTitleClass} text-center text-foreground`}>{heading}</h1>
        <p className="mx-auto mt-4 max-w-[52ch] text-center text-lg leading-relaxed text-muted-foreground">
          {intro}
        </p>

        {entries.length === 0 ? (
          <p className="mt-10 text-center text-muted-foreground">{emptyMessage}</p>
        ) : (
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {entries.map((entry) => {
              const lang = entry.language ? languageCodes[entry.language] : undefined;
              const body = (
                <>
                  <p className="text-sm font-semibold tracking-wide text-primary uppercase">
                    {entry.kicker ? `${entry.kicker} · ` : null}
                    <time dateTime={entry.date}>{formatLongDate(entry.date)}</time>
                  </p>
                  <p
                    lang={lang}
                    className="mt-1.5 text-lg leading-snug font-semibold text-foreground sm:text-xl"
                  >
                    {entry.title}
                    {entry.href ? (
                      <ArrowUpRight
                        aria-hidden
                        className="ml-1 inline size-4 align-baseline text-primary opacity-60 transition-opacity group-hover:opacity-100"
                      />
                    ) : null}
                  </p>
                  {entry.summary ? (
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                      {entry.summary}
                    </p>
                  ) : null}
                </>
              );
              return (
                <li key={entry.id}>
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block py-5 no-underline transition-colors hover:bg-primary/5 sm:px-3"
                    >
                      {body}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <div className="py-5 sm:px-3">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
