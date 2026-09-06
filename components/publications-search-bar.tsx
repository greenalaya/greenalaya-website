"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

type PublicationsSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PublicationsSearchBar({ value, onChange }: PublicationsSearchBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  return (
    <div className="border-b border-border bg-secondary px-5 py-10 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl justify-center">
        {searchOpen ? (
          <div className="relative w-full">
            <label htmlFor="publications-search" className="sr-only">
              Search publications
            </label>
            <input
              id="publications-search"
              ref={inputRef}
              type="search"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              onBlur={() => {
                if (!value.trim()) setSearchOpen(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  onChange("");
                  setSearchOpen(false);
                  inputRef.current?.blur();
                }
              }}
              placeholder="Search publications by title or date"
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
            Search publications
          </button>
        )}
      </div>
    </div>
  );
}
