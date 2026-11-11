import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Screen-height sections on laptops: fill the space under the fixed header (about 4.5rem) and land
 * exactly under it when scrolled to. Phones keep normal flow, since content runs longer there.
 */
export const screenSectionClass =
  "lg:flex lg:min-h-[calc(100svh-4.5rem)] lg:scroll-mt-[4.5rem] lg:flex-col lg:justify-center";

type ScrollArrowProps = {
  href: `#${string}`;
  label: string;
  className?: string;
};

function ScrollArrow({
  href,
  label,
  className,
  direction,
}: ScrollArrowProps & { direction: "up" | "down" }) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-20 hidden justify-center lg:flex",
        direction === "up" ? "top-1" : "bottom-2",
        className,
      )}
    >
      <Link
        href={href}
        aria-label={label}
        className="pointer-events-auto inline-flex size-11 items-center justify-center text-home-ink/45 no-underline transition-colors duration-200 hover:text-home-ink/75"
      >
        <Icon
          aria-hidden
          className={cn(
            "size-5 motion-reduce:animate-none",
            direction === "up"
              ? "animate-[hero-chevron-bounce-up_2s_ease-in-out_infinite]"
              : "animate-[hero-chevron-bounce_2s_ease-in-out_infinite]",
          )}
        />
      </Link>
    </div>
  );
}

/**
 * The bouncing arrow from the live homepage hero, pinned to the bottom of a section; it
 * scrolls smoothly to the next one. Shown on laptops only, where sections fill the screen.
 */
export function ScrollToNext(props: ScrollArrowProps) {
  return <ScrollArrow {...props} direction="down" />;
}

/** The same arrow pointing up, pinned to the top of a section; it scrolls back to the previous one. */
export function ScrollToPrevious(props: ScrollArrowProps) {
  return <ScrollArrow {...props} direction="up" />;
}
