import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/lib/site";
import {
  homeButtonClass,
  homeContainerClass,
  homeTextLinkClass,
} from "@/components/home/home-styles";

export function HomeHero() {
  const { title, description, image } = homeContent.hero;

  return (
    <section aria-labelledby="home-hero-title" className="pt-28 pb-8 md:pt-32 lg:pb-16">
      <div
        className={`${homeContainerClass} grid gap-10 lg:min-h-[calc(100svh-8rem)] lg:grid-cols-12 lg:items-center lg:gap-12`}
      >
        <div className="lg:col-span-5">
          <h1
            id="home-hero-title"
            className="max-w-[16ch] font-display text-[clamp(2.25rem,4.6vw,4.25rem)] leading-[1.02] font-medium tracking-[-0.025em] text-home-ink"
          >
            {title}
          </h1>
          <p className="mt-7 text-lg leading-relaxed text-home-ink sm:text-xl">
            {description[0]}
            <br />
            <span className="whitespace-nowrap">{description[1]}</span>
          </p>
          <div id="home-hero-actions" className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="#our-work" className={homeButtonClass}>
              Explore Our Work
            </Link>
            <Link href="#get-involved" className={homeTextLinkClass}>
              Get Involved
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            preload
            sizes="(min-width: 1200px) 672px, (min-width: 1024px) 58vw, 100vw"
            className="h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
