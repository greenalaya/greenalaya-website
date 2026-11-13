import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  homeContainerClass,
  homeScreenClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";
import { cn } from "@/lib/utils";

type FlagshipSpecies = {
  name: string;
  /** The project that works on this group, when the site has a page for it. */
  href?: string;
  /** A photograph from the organisation's own field work; without one the tile is a night scene. */
  photo?: { src: string; alt: string; position?: string };
};

const flagshipSpecies: FlagshipSpecies[] = [
  {
    name: "Butterflies",
    href: "/projects/kathmandu-valley-butterfly-documentation",
    photo: {
      src: "/images/projects/godawari-butterfly-watch.webp",
      alt: "A brown butterfly resting with its wings open on a rock",
    },
  },
  {
    name: "Moths",
    href: "/projects/moths-of-bagmati-province",
    photo: {
      src: "/images/news/announcing-moths-of-bagmati-province/moth-on-forest-floor.jpg",
      alt: "A brown, leaf-shaped moth resting on the wet forest floor",
    },
  },
  // No firefly photograph yet: the tile shows fireflies glowing in the dark instead.
  { name: "Fireflies" },
];

/** Where each firefly glows in the night tile (percent of the tile), its size and its rhythm. */
const glows = [
  { left: 18, top: 22, size: 10, delay: 0 },
  { left: 62, top: 14, size: 7, delay: 1.1 },
  { left: 78, top: 38, size: 12, delay: 0.5 },
  { left: 34, top: 46, size: 8, delay: 1.7 },
  { left: 52, top: 62, size: 11, delay: 0.9 },
  { left: 14, top: 68, size: 7, delay: 2.2 },
  { left: 84, top: 70, size: 8, delay: 1.4 },
];

function NightScene() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(180deg,#07110c_0%,#0f2318_60%,#16321f_100%)]"
    >
      {glows.map((glow) => (
        <span
          key={`${glow.left}-${glow.top}`}
          style={
            {
              left: `${glow.left}%`,
              top: `${glow.top}%`,
              width: glow.size,
              height: glow.size,
              animationDelay: `${glow.delay}s`,
            } as CSSProperties
          }
          // The same yellow-green glow as the fireflies that visit the page in the dark theme.
          className="absolute rounded-full bg-[#f6ffd2] shadow-[0_0_14px_6px_rgba(196,232,96,0.55)] motion-safe:animate-pulse"
        />
      ))}
    </div>
  );
}

/**
 * "Our Flagship Species": the three groups the organisation's work centres on, one tall tile
 * each with only its name. A tile opens the project for that group where there is one.
 * On a laptop the section fills one screen (under the fixed header), like its
 * neighbours; on phones the tiles stack.
 */
export function HomeFlagshipSpecies() {
  return (
    <section
      id="flagship-species"
      aria-labelledby="flagship-species-title"
      className={homeScreenClass}
    >
      <div className={cn(homeContainerClass, "lg:flex lg:min-h-0 lg:flex-1 lg:flex-col")}>
        <h2
          id="flagship-species-title"
          // Phones and tablets: centred.
          className={`${homeSectionHeadingClass} text-home-ink max-lg:text-center`}
        >
          Our Flagship Species
        </h2>
        <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 lg:mt-8 lg:min-h-0 lg:flex-1 lg:gap-6 lg:short:mt-6 max-md:grid-cols-3 max-md:gap-2">
          {flagshipSpecies.map((species) => {
            const tile = (
              <>
                {species.photo ? (
                  <Image
                    src={species.photo.src}
                    alt={species.photo.alt}
                    fill
                    sizes="(min-width: 1200px) 370px, (min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out motion-safe:group-hover/link:scale-[1.03]"
                    style={
                      species.photo.position
                        ? { objectPosition: species.photo.position }
                        : undefined
                    }
                  />
                ) : (
                  <NightScene />
                )}
                {/* Darkens the foot of the photograph so the white name stays readable. */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.7)_100%)]"
                />
                <span className="absolute inset-x-0 bottom-0 p-6 text-[clamp(1.75rem,2.4vw,2.125rem)] max-md:p-2.5 max-md:text-base leading-[1.15] font-bold tracking-tight text-white sm:p-7">
                  {species.name}
                </span>
              </>
            );
            const tileClass =
              "group/link relative block h-48 overflow-hidden bg-home-ground no-underline md:h-80 lg:h-full";

            return (
              <li key={species.name} className="lg:min-h-0">
                {species.href ? (
                  <Link
                    href={species.href}
                    className={cn(
                      tileClass,
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action",
                    )}
                  >
                    {tile}
                  </Link>
                ) : (
                  <div className={tileClass}>{tile}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
