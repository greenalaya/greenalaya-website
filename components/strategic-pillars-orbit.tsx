"use client";

import { aboutPageContent, siteConfig, strategicPillars } from "@/lib/site";
import {
  FlaskConical,
  Leaf,
  Monitor,
  Pause,
  Play,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { homeSectionHeadingClass } from "@/components/home/home-styles";
import { ScrollToNext, ScrollToPrevious, screenSectionClass } from "@/components/scroll-to-next";
import { SectionFadeBridges } from "@/components/section-fade-bridges";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type PillarIconKey = (typeof strategicPillars)[number]["icon"];

type TimelineItem = {
  id: number;
  title: string;
  content: string;
  icon: LucideIcon;
  iconKey: PillarIconKey;
};

const pillarIcons: Record<PillarIconKey, LucideIcon> = {
  people: User,
  technology: Monitor,
  research: FlaskConical,
  nature: Leaf,
  collaboration: Users,
};

const pillarAccent: Record<PillarIconKey, { from: string; to: string }> = {
  people: { from: "#2e7d32", to: "#1b5e20" },
  technology: { from: "#1976d2", to: "#0d47a1" },
  research: { from: "#d4a574", to: "#a67c52" },
  nature: { from: "#4caf50", to: "#2e7d32" },
  collaboration: { from: "#2196f3", to: "#1976d2" },
};

/** One brand green for every pillar when the orbit follows the theme. */
const themedAccent = { from: "#4caf50", to: "#2e7d32" };

const TIMELINE_DATA: TimelineItem[] = strategicPillars.map((pillar, index) => ({
  id: index + 1,
  title: pillar.title,
  content: pillar.description,
  icon: pillarIcons[pillar.icon],
  iconKey: pillar.icon,
}));

const NODE_COUNT = TIMELINE_DATA.length;

function roundPx(value: number): number {
  return Math.round(value * 1000) / 1000;
}

/** Stable transform string so SSR and client hydration match. */
function pillarNodeTransform(x: number, y: number): string {
  const rx = roundPx(x);
  const ry = roundPx(y);
  const formatAxis = (value: number) =>
    value < 0 ? `- ${Math.abs(value).toFixed(3)}px` : `+ ${value.toFixed(3)}px`;

  return `translate(calc(-50% ${formatAxis(rx)}), calc(-50% ${formatAxis(ry)}))`;
}

/** Max orbit radius so every node + label stays inside the square at all rotation angles. */
function computeMaxOrbitRadius(
  width: number,
  height: number,
  nodeHalfWidth: number,
  nodeHalfHeight: number,
) {
  let maxRadius = Infinity;

  for (let index = 0; index < NODE_COUNT; index += 1) {
    const angle = ((index / NODE_COUNT) * 360 * Math.PI) / 180;
    const cos = Math.abs(Math.cos(angle));
    const sin = Math.abs(Math.sin(angle));

    if (cos > 0.01) {
      maxRadius = Math.min(maxRadius, (width / 2 - nodeHalfWidth) / cos);
    }
    if (sin > 0.01) {
      maxRadius = Math.min(maxRadius, (height / 2 - nodeHalfHeight) / sin);
    }
  }

  return Number.isFinite(maxRadius) ? maxRadius : width / 2 - nodeHalfWidth;
}

function Card({
  children,
  className = "",
  id,
  themed = false,
  hidden = false,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  themed?: boolean;
  hidden?: boolean;
  labelledBy?: string;
}) {
  return (
    <div
      id={id}
      hidden={hidden}
      role="region"
      aria-labelledby={labelledBy}
      className={
        themed
          ? cn(
              "rounded-xl border border-home-accent/25 bg-home-surface text-home-ink shadow-[0_16px_40px_rgba(13,55,22,0.14)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
              className,
            )
          : // Original string kept verbatim (not merged), so the default look is unchanged.
            `rounded-xl border border-[#4caf50]/25 bg-[#161c17]/95 text-white shadow-lg shadow-[#0a0f0a]/50 backdrop-blur-lg ${className}`
      }
    >
      {children}
    </div>
  );
}

type StrategicPillarsOrbitProps = {
  /**
   * Follow the light/dark theme with the homepage redesign palette instead of the always-dark
   * original look. Used by /about: heading left and orbit right on laptops, filling the
   * screen with up/down section arrows.
   */
  themed?: boolean;
};

export function StrategicPillarsOrbit({ themed = false }: StrategicPillarsOrbitProps) {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [orbitRadius, setOrbitRadius] = useState(200);
  const [circleInset, setCircleInset] = useState({ outer: 0, middle: 0, inner: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  // Rotation stops while a visitor points at or tabs through the orbit, and when they pause it.
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  // Touch has no hover, so on the themed page a tap on the orbit holds it still until the visitor
  // taps elsewhere or scrolls the section away, letting them aim at a pillar that isn't moving.
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) setIsTouchPaused(false);
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const orbitEl = orbitRef.current;
    if (!orbitEl) return;

    setAutoRotate(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    const updateRadius = () => {
      const rect = orbitEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const isCompact = window.matchMedia("(max-width: 1023px)").matches;
      const isLaptop = window.matchMedia("(min-width: 1024px)").matches;
      setIsDesktop(isLaptop);
      // Icon + label footprint from each node center (matches mobile/desktop classes below).
      const nodeHalfWidth = isCompact ? 52 : 44;
      const nodeHalfHeight = isCompact ? 50 : 44;
      const maxRadius = computeMaxOrbitRadius(
        rect.width,
        rect.height,
        nodeHalfWidth,
        nodeHalfHeight,
      );
      const minRadius = isCompact ? 96 : 88;
      const radiusBoost = isCompact ? 20 : 0;

      setOrbitRadius(Math.max(minRadius, maxRadius - (isCompact ? 2 : 4) + radiusBoost));
      setCircleInset(
        isLaptop ? { outer: 20, middle: 10, inner: 30 } : { outer: 0, middle: 0, inner: 0 },
      );
    };

    updateRadius();
    const resizeObserver = new ResizeObserver(updateRadius);
    resizeObserver.observe(orbitEl);
    window.addEventListener("resize", updateRadius);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateRadius);
    };
  }, []);

  const centerViewOnNode = (nodeId: number) => {
    const nodeIndex = TIMELINE_DATA.findIndex((item) => item.id === nodeId);
    const totalNodes = TIMELINE_DATA.length;
    const targetAngle = (nodeIndex / totalNodes) * 360;
    setRotationAngle(270 - targetAngle);
  };

  const hasExpanded = Object.values(expandedItems).some(Boolean);
  const expandedItem = TIMELINE_DATA.find((item) => expandedItems[item.id]);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Below laptop width the description opens under the orbit; bring it into view when it does.
  useEffect(() => {
    if (!expandedItem || window.matchMedia("(min-width: 1024px)").matches) return;
    mobilePanelRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [expandedItem, prefersReducedMotion]);

  const collapseExpanded = useCallback(() => {
    setExpandedItems({});
    setAutoRotate(true);
  }, []);

  useEffect(() => {
    if (!hasExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-pillar-node], [data-pillar-panel]")) return;
      collapseExpanded();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") collapseExpanded();
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasExpanded, collapseExpanded]);

  const toggleItem = (id: number) => {
    const isOpening = !expandedItems[id];
    setExpandedItems(isOpening ? { [id]: true } : {});
    setAutoRotate(!isOpening);
    if (isOpening) centerViewOnNode(id);
  };

  useEffect(() => {
    if (!isTouchPaused) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && orbitRef.current?.contains(event.target)) return;
      setIsTouchPaused(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isTouchPaused]);

  useEffect(() => {
    if (
      !autoRotate ||
      !isVisible ||
      prefersReducedMotion ||
      isInteracting ||
      isPausedByUser ||
      isTouchPaused
    )
      return;

    const rotationTimer = setInterval(() => {
      if (document.hidden) return;
      setRotationAngle((prev) => Number(((prev + 0.3) % 360).toFixed(3)));
    }, 50);

    return () => clearInterval(rotationTimer);
  }, [autoRotate, isVisible, prefersReducedMotion, isInteracting, isPausedByUser, isTouchPaused]);

  const calculateNodePosition = (index: number, total: number) => {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const radius = orbitRadius;
    const radian = (angle * Math.PI) / 180;
    const x = roundPx(radius * Math.cos(radian));
    const y = roundPx(radius * Math.sin(radian));
    const zIndex = Math.max(30, Math.round(100 + 50 * Math.cos(radian)));
    return { x, y, zIndex };
  };

  return (
    <section
      ref={sectionRef}
      id="pillars"
      aria-labelledby="pillars-title"
      className={cn(
        "relative scroll-mt-24 overflow-x-clip",
        themed
          ? `bg-home-ground text-home-ink ${screenSectionClass}`
          : "-mt-[8px] lg:min-h-[720px] bg-gradient-to-b from-[#0a0f0a] via-[#0f1610] to-[#0a0f0a] text-white",
      )}
    >
      {themed ? null : <SectionFadeBridges targetRef={sectionRef} showTop showBottom />}
      {themed ? <ScrollToPrevious href="#mission" label="Back to our mission" /> : null}
      <div
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", themed && "hidden")}
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url('${siteConfig.images.foundationBackground}')` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 motion-reduce:opacity-90 motion-safe:animate-[hero-mesh-pulse_10s_ease-in-out_infinite]"
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 72% 45%, rgba(76,175,80,0.16) 0%, transparent 68%)",
          }}
        />
        <div className="absolute top-1/3 left-0 h-80 w-80 rounded-full bg-[#2e7d32]/10 blur-3xl" />
        <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-[#4caf50]/12 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(76,175,80,0.06)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]" />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto grid items-center justify-items-center gap-12 sm:gap-14",
          // Themed: the homepage redesign's container; on laptops the heading, description and
          // pause button sit on the left and the orbit on the right, like Mission and Vision.
          themed
            ? "max-w-[1200px] px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-12 lg:pt-12 lg:pb-14"
            : "max-w-7xl px-4 py-16 lg:grid-cols-2 lg:justify-items-stretch lg:gap-16 lg:py-20",
        )}
      >
        <header className={cn("w-full text-center", !themed && "lg:text-left")}>
          <h2
            id="pillars-title"
            className={
              themed
                ? `${homeSectionHeadingClass} text-home-ink`
                : "text-3xl font-bold tracking-tight text-[#2196f3] uppercase [-webkit-text-stroke:2px_#000] [paint-order:stroke_fill] sm:text-4xl md:text-5xl"
            }
          >
            {aboutPageContent.pillarsHeading}
          </h2>
          <p
            className={cn(
              "mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed sm:mt-6 sm:text-lg md:text-xl",
              themed ? "text-pretty text-black dark:text-white" : "text-white lg:mx-0",
            )}
          >
            {aboutPageContent.pillarsDescription}
          </p>
          {/* Always rendered and hidden with CSS when motion is reduced: the server can't know the
              visitor's setting, so a JS branch here made the server and browser HTML differ. */}
          <button
            type="button"
            aria-pressed={isPausedByUser}
            onClick={() => setIsPausedByUser((paused) => !paused)}
            className={cn(
              "mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 motion-reduce:hidden",
              themed
                ? "border-home-accent/40 text-home-accent hover:bg-home-field focus-visible:outline-home-action"
                : "border-white/30 text-white hover:bg-white/10 focus-visible:outline-[#81c784]",
            )}
          >
            {isPausedByUser ? (
              <Play aria-hidden className="size-4" />
            ) : (
              <Pause aria-hidden className="size-4" />
            )}
            {isPausedByUser ? "Play rotation" : "Pause rotation"}
          </button>
        </header>

        <div
          className={cn(
            "relative mx-auto w-full max-w-[min(calc(100vw-2rem),26rem)] sm:max-w-[min(calc(100vw-2rem),28rem)] lg:max-w-none",
            themed
              ? // Shrinks on short laptop screens so the whole section fits under the header.
                "lg:h-[min(500px,calc(100svh-13rem))] lg:max-w-[min(500px,calc(100svh-13rem))]"
              : "lg:h-[min(680px,calc(100vh-200px))] lg:min-h-[680px]",
          )}
        >
          <div
            className="relative mx-auto aspect-square w-full overflow-visible lg:h-full lg:max-h-full"
            ref={orbitRef}
            style={{ perspective: "1000px" } as CSSProperties}
            onPointerEnter={() => setIsInteracting(true)}
            onPointerLeave={() => setIsInteracting(false)}
            onPointerDown={(event) => {
              if (themed && event.pointerType === "touch") setIsTouchPaused(true);
            }}
            onFocus={() => setIsInteracting(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false);
            }}
          >
            <div
              className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                themed ? "border-home-accent/20" : "border-[#2e7d32]/15",
              )}
              style={{
                width: Math.max(0, orbitRadius * 2.4 - circleInset.outer),
                height: Math.max(0, orbitRadius * 2.4 - circleInset.outer),
              }}
            />
            <div
              className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border",
                themed ? "border-home-accent/30" : "border-[#4caf50]/20",
              )}
              style={{
                width: Math.max(0, orbitRadius * 1.6 - circleInset.middle),
                height: Math.max(0, orbitRadius * 1.6 - circleInset.middle),
              }}
            />
            <div
              className={cn(
                "pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed",
                themed ? "border-home-accent/40" : "border-[#4caf50]/25",
              )}
              style={{
                width: Math.max(0, orbitRadius * 1.3 - circleInset.inner),
                height: Math.max(0, orbitRadius * 1.3 - circleInset.inner),
              }}
            />

            <div className="absolute left-1/2 top-1/2 z-10 flex h-[4.75rem] w-[4.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-[#2e7d32] via-[#4caf50] to-[#1b5e20] shadow-lg shadow-[#2e7d32]/40 lg:h-16 lg:w-16">
              <div className="absolute h-[5.5rem] w-[5.5rem] motion-safe:animate-ping rounded-full border border-[#4caf50]/40 opacity-70 lg:h-20 lg:w-20" />
              <div
                className="absolute h-[6.25rem] w-[6.25rem] motion-safe:animate-ping rounded-full border border-[#2e7d32]/30 opacity-50 lg:h-24 lg:w-24"
                style={{ animationDelay: "0.5s" }}
              />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-md lg:h-8 lg:w-8">
                <div className="h-3 w-3 rounded-full bg-gradient-to-br from-[#2e7d32] to-[#1b5e20]" />
              </div>
            </div>

            {TIMELINE_DATA.map((item, index) => {
              const position = calculateNodePosition(index, TIMELINE_DATA.length);
              const isExpanded = expandedItems[item.id];
              const Icon = item.icon;
              const accent = themed ? themedAccent : pillarAccent[item.iconKey];
              const auraSize = 64;
              const nodeSize = 56;

              return (
                <div
                  key={item.id}
                  data-pillar-node
                  onBlur={(event) => {
                    // Tabbing to another link or button closes the panel so it can't cover the next
                    // pillar. Focus landing on a non-interactive wrapper (a tap on plain text inside
                    // the panel moves it to the page's skip-link target) leaves it open.
                    const next = event.relatedTarget;
                    if (
                      isExpanded &&
                      next instanceof Element &&
                      next.matches("a[href], button, input, select, textarea") &&
                      !event.currentTarget.contains(next)
                    )
                      collapseExpanded();
                  }}
                  className={`absolute left-1/2 top-1/2 ${
                    autoRotate
                      ? ""
                      : "motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
                  }`}
                  style={{
                    transform: pillarNodeTransform(position.x, position.y),
                    zIndex: isExpanded ? 200 : position.zIndex,
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={Boolean(isExpanded)}
                    aria-controls={isDesktop ? `pillar-panel-${item.id}` : "pillar-panel-mobile"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleItem(item.id);
                    }}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4",
                      themed
                        ? "focus-visible:outline-home-accent"
                        : "focus-visible:outline-[#81c784]",
                      isExpanded ? "gap-4" : "gap-2.5 sm:gap-3",
                    )}
                  >
                    <div className="relative">
                      <div
                        className="absolute rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${accent.from}40 0%, transparent 70%)`,
                          width: `${auraSize}px`,
                          height: `${auraSize}px`,
                          left: `-${(auraSize - nodeSize) / 2}px`,
                          top: `-${(auraSize - nodeSize) / 2}px`,
                        }}
                      />

                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-300 lg:h-12 lg:w-12 ${
                          isExpanded
                            ? "scale-150 border-[#4caf50] bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] text-white shadow-lg shadow-[#2e7d32]/40"
                            : themed
                              ? "border-home-accent bg-home-ground text-home-accent hover:scale-110"
                              : "border-[#4caf50] bg-[#0f1410] text-[#c8e6c9] hover:scale-110 hover:border-[#81c784]"
                        }`}
                        style={!isExpanded && !themed ? { borderColor: accent.from } : undefined}
                      >
                        <Icon className="size-5 lg:size-[18px]" aria-hidden />
                      </div>
                    </div>

                    <div
                      className={`max-w-[6rem] text-center font-semibold leading-tight transition-all duration-300 lg:max-w-none ${
                        themed
                          ? "text-sm"
                          : "text-[11px] tracking-wide uppercase sm:text-xs sm:tracking-wider"
                      } ${
                        isExpanded
                          ? themed
                            ? "scale-110 text-home-accent sm:scale-125"
                            : "scale-110 text-[#81c784] sm:scale-125"
                          : themed
                            ? "text-home-ink"
                            : "text-[#c8e6c9]"
                      }`}
                    >
                      {item.title}
                    </div>
                  </button>

                  <Card
                    themed={themed}
                    id={`pillar-panel-${item.id}`}
                    hidden={!isExpanded}
                    labelledBy={`pillar-title-${item.id}`}
                    className={cn(
                      // Laptops only: on smaller screens it would cover the other pillars, so the
                      // description opens in a card under the orbit instead (below).
                      "absolute top-full left-1/2 mt-4 w-[min(18rem,calc(100vw-2rem))] max-h-[min(16rem,50vh)] -translate-x-1/2 overflow-y-auto p-5 text-center max-lg:hidden",
                      !themed && "shadow-2xl shadow-[#0a0f0a]/60",
                    )}
                  >
                    <div
                      className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2"
                      style={{
                        background: `linear-gradient(to bottom, ${accent.from}, transparent)`,
                      }}
                    />
                    <h3
                      id={`pillar-title-${item.id}`}
                      className={cn(
                        "text-xl font-semibold",
                        themed ? "text-home-ink" : "text-white",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={cn(
                        "mt-3 text-base leading-relaxed",
                        themed ? "text-black dark:text-white" : "text-white/80",
                      )}
                    >
                      {item.content}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <div
          ref={mobilePanelRef}
          data-pillar-panel
          hidden={!expandedItem}
          aria-live="polite"
          className="w-full lg:hidden"
        >
          <Card
            id="pillar-panel-mobile"
            themed={themed}
            labelledBy="pillar-title-mobile"
            className={cn(
              "mx-auto w-full max-w-[min(calc(100vw-2.5rem),28rem)] scroll-mb-6 p-5 text-center",
              !themed && "shadow-2xl shadow-[#0a0f0a]/60",
            )}
          >
            <h3
              id="pillar-title-mobile"
              className={cn("text-xl font-semibold", themed ? "text-home-ink" : "text-white")}
            >
              {expandedItem?.title}
            </h3>
            <p
              className={cn(
                "mt-3 text-base leading-relaxed",
                themed ? "text-black dark:text-white" : "text-white/80",
              )}
            >
              {expandedItem?.content}
            </p>
          </Card>
        </div>
      </div>
      {themed ? <ScrollToNext href="#thematic" label="Scroll to our thematic areas" /> : null}
    </section>
  );
}
