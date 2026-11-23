"use client";

import { useId, useState, type ComponentType } from "react";
import { CloudSun, Cpu, Microscope, Recycle, Scale, Trees, Users } from "lucide-react";
import { thematicAreasWithStyle } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The About page's Thematic Areas box: pick an area in the tabs on the left (hover, click or
 * keyboard focus) and it shows in the panel on the right. The other tabs are plain, the chosen
 * one is the logo's green (#007322) with white words, and the panel is the About page's mint
 * (#dde6d7) with a logo-green accent line. Tab words, icons and descriptions are otherwise pure
 * black (white in dark mode, where black wouldn't show).
 * Below laptop width it is only a plain list of the area names: no tabs and no panel.
 */

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

// Same order as thematicAreas in lib/site.
const icons: IconType[] = [Cpu, CloudSun, Microscope, Recycle, Trees, Users, Scale];

const areas = thematicAreasWithStyle.map((area, index) => ({ ...area, Icon: icons[index] }));

// The other tabs have no colour of their own: they sit on the box's plain surface.
// The chosen tab is the logo's green at full strength. Words and icons on it are white (black
// would be hard to read; white is 6:1).
const openFill = "bg-[#007322] text-white";

// The panel on the right is the About page's mint (#dde6d7, the site's pale sage) with dark
// text; in dark mode it is the logo green at 50% over the dark box, with white text.
const panelFill = "bg-[#dde6d7] dark:bg-[#007322]/50";

export function ThematicAreasExplorer() {
  const [active, setActive] = useState(0);
  const current = areas[active];
  const idBase = useId();
  const panelId = `${idBase}-panel`;

  return (
    <>
      {/* Phones and tablets: just the area names. */}
      <ul className="divide-y divide-home-line overflow-hidden rounded-3xl border border-home-line bg-home-surface lg:hidden dark:divide-white/8 dark:border-white/10">
        {areas.map(({ title, Icon }) => (
          <li
            key={title}
            className="flex items-center gap-4 px-5 py-4 text-black sm:px-7 dark:text-white"
          >
            <Icon className="size-5 shrink-0" strokeWidth={1.75} />
            <span className="font-semibold">{title}</span>
          </li>
        ))}
      </ul>

      {/* Laptops: tabs on the left, the chosen area in the panel on the right. */}
      <div className="hidden overflow-hidden rounded-3xl border border-home-line bg-home-surface shadow-[0_20px_50px_-24px_rgb(26_34_29/0.25)] lg:grid lg:grid-cols-[1.1fr_1fr] dark:border-white/10 dark:shadow-none">
        <ul
          role="tablist"
          aria-label="Thematic areas"
          className="divide-y divide-home-line dark:divide-white/8"
        >
          {areas.map(({ title, Icon }, index) => {
            const isActive = index === active;
            return (
              <li key={title}>
                <button
                  type="button"
                  role="tab"
                  id={`${idBase}-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls={panelId}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  className={cn(
                    "relative flex w-full items-center gap-4 px-5 py-4 text-left text-black transition-colors sm:px-7 dark:text-white",
                    isActive ? openFill : "hover:bg-[#007322]/10 dark:hover:bg-[#007322]/20",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 w-0.75 bg-[#007322] transition-opacity dark:bg-[#4cc46a]",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Icon className="size-5 shrink-0" strokeWidth={1.75} />
                  <span className="font-semibold">{title}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={`${idBase}-tab-${active}`}
          className={cn(
            "relative flex min-h-[20rem] flex-col justify-end overflow-hidden p-8 sm:p-10",
            panelFill,
          )}
        >
          <current.Icon
            aria-hidden
            className="absolute top-6 right-6 size-40 text-[#007322]/30 dark:text-white/15"
            strokeWidth={1}
          />
          <span
            aria-hidden
            className="relative mb-5 block h-0.75 w-14 rounded-full bg-[#007322] dark:bg-white/80"
          />
          <h3 className="relative text-3xl leading-tight font-semibold text-balance text-home-ink dark:text-white">
            {current.title}
          </h3>
          <p className="relative mt-3 text-lg text-black dark:text-white">{current.description}</p>
        </div>
      </div>
    </>
  );
}
