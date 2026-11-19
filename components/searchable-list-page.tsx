"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { pageTitleClass } from "@/lib/typography";

type SearchableListPageProps<T> = {
  items: T[];
  heading: string;
  /** Lowercase noun used in the search button, placeholder, and input id (e.g. "news", "blog", "projects"). */
  searchLabel: string;
  emptyMessage: string;
  noMatchMessage: string;
  getKey: (item: T) => string;
  matchesQuery: (item: T, query: string) => boolean;
  renderItem: (item: T) => ReactNode;
};

/** Search-bar + filtered card grid shared by the News, Blog, Projects, and Publications list pages. */
export function SearchableListPage<T>({
  items,
  heading,
  searchLabel,
  emptyMessage,
  noMatchMessage,
  getKey,
  matchesQuery,
  renderItem,
}: SearchableListPageProps<T>) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchId = `${searchLabel.toLowerCase().replace(/\s+/g, "-")}-search`;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => matchesQuery(item, q));
  }, [items, query, matchesQuery]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <>
      {/* Search bar (more compact on phones; the input keeps 16px text so iPhones don't zoom) */}
      <div className="border-b border-border bg-secondary px-5 pt-24 pb-6 sm:px-6 sm:pt-28 sm:pb-10 lg:px-8">
        <div className="mx-auto flex max-w-xl justify-center">
          {searchOpen ? (
            <div className="relative w-full">
              <label htmlFor={searchId} className="sr-only">
                Search {searchLabel}
              </label>
              <input
                id={searchId}
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onBlur={() => {
                  if (!query.trim()) setSearchOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setQuery("");
                    setSearchOpen(false);
                    inputRef.current?.blur();
                  }
                }}
                placeholder={`Search ${searchLabel} by title or date`}
                className="w-full rounded-full border border-primary bg-card py-2.5 pr-11 pl-5 text-base text-foreground sm:py-3.5 sm:pr-12 sm:pl-6 placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-primary sm:size-5"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-primary bg-card px-4 py-2 text-sm font-medium text-primary sm:px-6 sm:py-3.5 sm:text-base transition hover:bg-primary hover:text-primary-foreground"
            >
              <Search className="size-4" aria-hidden />
              Search {searchLabel}
            </button>
          )}
        </div>
      </div>

      {/* Card grid */}
      <main className="bg-background px-5 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <section className="mt-14 sm:mt-16">
            <h1 className={`${pageTitleClass} text-center text-foreground`}>{heading}</h1>

            {filtered.length === 0 ? (
              <p className="mt-8 text-center text-muted-foreground">
                {items.length === 0 ? emptyMessage : noMatchMessage}
              </p>
            ) : (
              <ul className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
                {filtered.map((item) => (
                  <li key={getKey(item)}>{renderItem(item)}</li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
