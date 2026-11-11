import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/lib/site";
import {
  homeButtonClass,
  homeContainerClass,
  homeOnImageLinkClass,
} from "@/components/home/home-styles";
import { pageTitleClass } from "@/lib/typography";

/**
 * One field photograph fills the first screen under the header, with the headline and what we
 * do set on it. The photo leads; the text says plainly what the organization works on.
 */
export function HomeHero() {
  const { title, description, image } = homeContent.hero;

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden pt-[4.5rem] lg:min-h-svh"
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        preload
        sizes="100vw"
        // The two observers stand right of centre; keep them in frame on narrow screens.
        className="-z-20 object-cover object-[68%_40%]"
      />
      {/* A dark scrim behind the text keeps white type readable over bright foliage; it is a
          legibility layer, not decoration. Bottom-up on phones, left-to-right on laptops. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(8_14_10/0.88)_0%,rgb(8_14_10/0.6)_45%,rgb(8_14_10/0.1)_80%)] lg:bg-[linear-gradient(to_right,rgb(8_14_10/0.86)_0%,rgb(8_14_10/0.62)_42%,rgb(8_14_10/0.05)_75%)]"
      />

      <div className={`${homeContainerClass} pt-24 pb-14 md:pb-20 lg:pb-24`}>
        <h1 id="home-hero-title" className={`${pageTitleClass} max-w-[17ch] text-white`}>
          {title}
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-white sm:text-xl">
          {description}
        </p>
        <div id="home-hero-actions" className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link href="#where-we-work" className={homeButtonClass}>
            Explore our work
          </Link>
          <Link href="/about" className={homeOnImageLinkClass}>
            About us
          </Link>
        </div>
      </div>
    </section>
  );
}
