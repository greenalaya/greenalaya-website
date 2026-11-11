import { GlowCard } from "@/components/ui/glow-card";
import { thematicAreasWithStyle } from "@/lib/site";
import { cn } from "@/lib/utils";

const secondRowColStart = ["lg:col-start-2", "lg:col-start-4", "lg:col-start-6"] as const;

export function ThematicAreasGrid({ themed = false }: { themed?: boolean }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-8 lg:gap-[39px]",
        themed && "lg:gap-x-[39px] lg:gap-y-6",
      )}
    >
      {thematicAreasWithStyle.map((area, index) => (
        <GlowCard
          key={area.title}
          glowColor="green"
          customSize
          glassTone="black"
          backdropOpacity={0.25}
          staticBelowLg
          themed={themed}
          className={cn(
            "mx-auto w-full min-h-[108px] p-2.5 sm:min-h-[118px] sm:p-3 lg:col-span-2 lg:min-h-[220px] lg:p-4",
            themed &&
              "p-3.5 sm:p-4 lg:min-h-[clamp(7.75rem,calc((100svh-32rem)/2),13.75rem)] lg:p-5",
            index >= 4 && secondRowColStart[index - 4],
          )}
        >
          {themed ? (
            // No numbers; the description always shows, in pure black (light) or white (dark).
            <article className="relative z-10 flex h-full flex-col justify-end gap-2 lg:gap-3">
              <h3 className="text-base leading-snug font-semibold text-balance text-home-ink sm:text-lg lg:text-xl">
                {area.title}
              </h3>
              <p className="text-sm leading-relaxed text-black dark:text-white">
                {area.description}
              </p>
            </article>
          ) : (
            <article className="relative z-10 flex h-full flex-col justify-end gap-2 sm:gap-2.5 lg:gap-3">
              <p
                aria-hidden
                className="text-2xl font-bold leading-none text-white sm:text-3xl lg:text-4xl xl:text-5xl"
              >
                {area.number}
              </p>
              <h3 className="text-[11px] font-bold leading-snug text-white sm:text-xs lg:text-lg">
                {area.title}
              </h3>
            </article>
          )}
        </GlowCard>
      ))}
    </div>
  );
}
