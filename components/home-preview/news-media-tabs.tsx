"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { homeArrowIconClass, homeArrowLinkClass } from "@/components/home-preview/home-styles";

export type NewsListItem = {
  key: string;
  href: string;
  title: string;
  date: string | null;
  image: { src: string; alt: string } | null;
};

export type CoverageListItem = {
  key: string;
  url: string;
  outlet: string;
  headline: string;
  date: string;
  language: string;
};

type NewsMediaTabsProps = {
  labels: { ours: string; media: string };
  news: NewsListItem[];
  coverage: CoverageListItem[];
  more: { href: string; label: string };
};

type TabKey = "ours" | "media";

const itemLinkClass =
  "group/item flex gap-4 rounded-md no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action";

/** Two tabs: the organisation's own stories, and coverage of its work in other outlets. */
export function NewsMediaTabs({ labels, news, coverage, more }: NewsMediaTabsProps) {
  const [active, setActive] = useState<TabKey>("ours");
  const baseId = useId();
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ ours: null, media: null });
  const tabs: TabKey[] = coverage.length > 0 ? ["ours", "media"] : ["ours"];

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const index = tabs.indexOf(active);
    const next =
      event.key === "Home"
        ? tabs[0]
        : event.key === "End"
          ? tabs[tabs.length - 1]
          : tabs[(index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="News and media" className="flex gap-2">
        {tabs.map((tab) => {
          const selected = active === tab;
          return (
            <button
              key={tab}
              ref={(node) => {
                tabRefs.current[tab] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tab)}
              onKeyDown={onKeyDown}
              className={cn(
                "min-h-11 cursor-pointer rounded-md px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action",
                selected
                  ? "bg-home-accent text-home-ground"
                  : "bg-home-field text-home-ink hover:bg-home-field/70",
              )}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-ours`}
        aria-labelledby={`${baseId}-tab-ours`}
        hidden={active !== "ours"}
        className="mt-6"
      >
        <ul className="space-y-5">
          {news.map((item) => (
            <li key={item.key}>
              <Link href={item.href} className={itemLinkClass}>
                <div className="relative aspect-[4/3] w-28 shrink-0 overflow-hidden bg-home-field sm:w-32">
                  {item.image ? (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover/item:scale-[1.04]"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  {item.date ? (
                    <p className="text-sm font-semibold text-home-accent">{item.date}</p>
                  ) : null}
                  <p className="mt-1 text-lg leading-snug font-semibold text-home-ink transition-colors duration-200 group-hover/item:text-home-accent sm:text-xl">
                    {item.title}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={more.href} className={`${homeArrowLinkClass} mt-5`}>
          {more.label}
          <ArrowRight aria-hidden className={homeArrowIconClass} />
        </Link>
      </div>

      {coverage.length > 0 ? (
        <div
          role="tabpanel"
          id={`${baseId}-panel-media`}
          aria-labelledby={`${baseId}-tab-media`}
          hidden={active !== "media"}
          className="mt-6"
        >
          <ul className="space-y-3">
            {coverage.map((item) => (
              <li key={item.key}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    itemLinkClass,
                    "flex-col gap-1.5 bg-home-field p-4 transition-colors duration-200 hover:bg-home-field/70",
                  )}
                >
                  <p className="text-sm font-semibold text-home-accent">
                    {item.outlet} · {item.date} · {item.language}
                  </p>
                  <p className="text-lg leading-snug font-semibold text-home-ink sm:text-xl">
                    {item.headline}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-home-ink">
                    Read on {item.outlet}
                    <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
