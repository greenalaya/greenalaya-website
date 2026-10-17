import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { homeContent } from "@/lib/site";
import {
  homeArrowIconClass,
  homeArrowLinkClass,
  homeContainerClass,
  homeSectionHeadingClass,
} from "@/components/home/home-styles";

export function HomeAbout() {
  const { title, body, detail, image } = homeContent.about;

  return (
    <section id="about" aria-labelledby="home-about-title" className="scroll-mt-24 py-24 md:py-36">
      <div
        className={`${homeContainerClass} grid gap-10 md:grid-cols-12 md:items-center md:gap-12`}
      >
        <div className="md:col-span-6">
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="(min-width: 1200px) 576px, (min-width: 768px) 50vw, 100vw"
            className="h-auto w-full"
          />
        </div>
        <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
          <h2 id="home-about-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {title}
          </h2>
          <p className="mt-6 max-w-[48ch] text-xl leading-relaxed text-home-ink">{body}</p>
          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-home-muted sm:text-lg">
            {detail}
          </p>
          <Link href="/about" className={`${homeArrowLinkClass} mt-6`}>
            More about us
            <ArrowRight aria-hidden className={homeArrowIconClass} />
          </Link>
        </div>
      </div>
    </section>
  );
}
