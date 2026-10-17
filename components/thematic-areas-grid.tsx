import { GlowCard } from "@/components/ui/glow-card";
import { thematicAreasWithStyle } from "@/lib/site";
import { cn } from "@/lib/utils";

const secondRowColStart = ["lg:col-start-2", "lg:col-start-4", "lg:col-start-6"] as const;

export function ThematicAreasGrid({ themed = false }: { themed?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-8 lg:gap-[39px]">
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
            index >= 4 && secondRowColStart[index - 4],
          )}
        >
          <article className="relative z-10 flex h-full flex-col justify-end gap-2 sm:gap-2.5 lg:gap-3">
            <p
              aria-hidden
              className={
                themed
                  ? "font-display text-3xl leading-none font-medium text-home-accent tabular-nums sm:text-4xl lg:text-5xl"
                  : "text-2xl font-bold leading-none text-white sm:text-3xl lg:text-4xl xl:text-5xl"
              }
            >
              {area.number}
            </p>
            <h3
              className={
                themed
                  ? "text-xs leading-snug font-semibold text-home-ink sm:text-sm lg:text-lg"
                  : "text-[11px] font-bold leading-snug text-white sm:text-xs lg:text-lg"
              }
            >
              {area.title}
            </h3>
          </article>
        </GlowCard>
      ))}
    </div>
  );
}
