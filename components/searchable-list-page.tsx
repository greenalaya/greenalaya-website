"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

/** Shared long-form date formatting used across list pages and cards. */
export function formatLongDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

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
      {/* Search bar */}
      <div className="border-b border-border bg-secondary px-5 py-10 pt-28 sm:px-6 lg:px-8">
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
                className="w-full rounded-full border border-primary bg-card py-3.5 pr-12 pl-6 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-primary"
              />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-primary bg-card px-6 py-3.5 text-base font-medium text-primary transition hover:bg-primary hover:text-primary-foreground"
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
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
              {heading}
            </h2>

            {filtered.length === 0 ? (
              <p className="mt-8 text-center text-muted-foreground">
                {items.length === 0 ? emptyMessage : noMatchMessage}
              </p>
            ) : (
              <ul className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
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
