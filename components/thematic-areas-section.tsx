"use client";

import { useRef } from "react";
import { HomeSectionHeader } from "@/components/home-section-header";
import { SectionFadeBridges } from "@/components/section-fade-bridges";
import { ThematicAreasGrid } from "@/components/thematic-areas-grid";
import { aboutPageContent, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

type ThematicAreasSectionProps = {
  /**
   * Follow the light/dark theme with the homepage redesign palette instead of the always-dark
   * original look. Used by /home-preview; the glow cards and layout are unchanged.
   */
  themed?: boolean;
};

export function ThematicAreasSection({ themed = false }: ThematicAreasSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="thematic"
      className={cn(
        "relative scroll-mt-24",
        themed
          ? "bg-home-ground py-24 text-home-ink md:py-32"
          : "-mt-[8px] bg-gradient-to-b from-[#0a0f0a] via-[#0f1610] to-[#0a0f0a] px-4 pt-10 pb-16 sm:px-5 sm:pt-12 sm:pb-20 lg:px-5 lg:pt-[62px] lg:pb-[102px]",
      )}
    >
      {themed ? null : <SectionFadeBridges targetRef={sectionRef} showTop showBottom />}
      <div
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", themed && "hidden")}
        aria-hidden
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage: `url('${siteConfig.images.thematicAreasBackground}')`,
          }}
        />
        <div
          className="absolute inset-0 motion-reduce:opacity-75 motion-safe:animate-[hero-mesh-pulse_10s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(ellipse 72% 68% at 50% 42%, rgba(76,175,80,0.10) 0%, transparent 68%)",
          }}
        />
        <div className="absolute top-1/4 left-1/4 h-80 w-80 rounded-full bg-[#2e7d32]/6 blur-3xl" />
        <div className="absolute right-0 bottom-1/4 h-96 w-96 rounded-full bg-[#4caf50]/8 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(76,175,80,0.04)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]" />
      </div>
      <div
        className={cn(
          "relative z-10 mx-auto",
          themed ? "max-w-[1200px] px-5 sm:px-8" : "max-w-6xl lg:-mt-10",
        )}
      >
        {themed ? (
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.02em] text-balance text-home-ink">
              {aboutPageContent.thematicHeading}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-home-ink sm:text-xl">
              {aboutPageContent.thematicDescription}
            </p>
          </div>
        ) : (
          <HomeSectionHeader
            title={aboutPageContent.thematicHeading}
            description={aboutPageContent.thematicDescription}
            tone="dark"
            outlinedTitle
            className="lg:mb-[54px]"
          />
        )}
        <ThematicAreasGrid themed={themed} />
      </div>
    </section>
  );
}
