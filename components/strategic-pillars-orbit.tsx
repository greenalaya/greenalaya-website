"use client";

import { aboutPageContent, strategicPillars } from "@/lib/site";
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
import { homeSectionHeadingClass } from "@/components/home/home-styles";
import { ScrollToNext, ScrollToPrevious, screenSectionClass } from "@/components/scroll-to-next";
import { cn } from "@/lib/utils";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";

type PillarIconKey = (typeof strategicPillars)[number]["icon"];

type TimelineItem = {
  id: number;
  title: string;
  content: string;
  icon: LucideIcon;
};

const pillarIcons: Record<PillarIconKey, LucideIcon> = {
  people: User,
  technology: Monitor,
  research: FlaskConical,
  nature: Leaf,
  collaboration: Users,
};

/** One brand green for every pillar. */
const accent = { from: "#4caf50", to: "#2e7d32" };

/** The visitor's "reduce motion" setting: off on the server, read from the browser after. */
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => false,
  );
}

const TIMELINE_DATA: TimelineItem[] = strategicPillars.map((pillar, index) => ({
  id: index + 1,
  title: pillar.title,
  content: pillar.description,
  icon: pillarIcons[pillar.icon],
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
  hidden = false,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  hidden?: boolean;
  labelledBy?: string;
}) {
  return (
    <div
      id={id}
      hidden={hidden}
      role="region"
      aria-labelledby={labelledBy}
      className={cn(
        "rounded-xl border border-home-accent/25 bg-home-surface text-home-ink shadow-[0_16px_40px_rgba(13,55,22,0.14)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Strategic Pillars on the About page, following the light/dark theme: heading left and orbit
 * right on laptops, filling the screen with up/down section arrows.
 */
export function StrategicPillarsOrbit() {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [orbitRadius, setOrbitRadius] = useState(200);
  const [circleInset, setCircleInset] = useState({ outer: 0, middle: 0, inner: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  // Rotation stops while a visitor points at or tabs through the orbit, and when they pause it.
  const [isInteracting, setIsInteracting] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  // Touch has no hover, so a tap on the orbit holds it still until the visitor
  // taps elsewhere or scrolls the section away, letting them aim at a pillar that isn't moving.
  const [isTouchPaused, setIsTouchPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();
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
      className={`relative scroll-mt-24 overflow-x-clip bg-home-ground text-home-ink ${screenSectionClass}`}
    >
      <ScrollToPrevious href="#mission" label="Back to our mission" />

      {/* The homepage redesign's container; on laptops the heading, description and pause
          button sit on the left and the orbit on the right, like Mission and Vision. */}
      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center justify-items-center gap-12 px-5 py-16 sm:gap-14 sm:px-8 md:py-20 lg:grid-cols-2 lg:gap-12 lg:pt-12 lg:pb-14">
        <header className="w-full text-center">
          <h2 id="pillars-title" className={`${homeSectionHeadingClass} text-home-ink`}>
            {aboutPageContent.pillarsHeading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-pretty text-black sm:mt-6 sm:text-lg md:text-xl dark:text-white">
            {aboutPageContent.pillarsDescription}
          </p>
          {/* Always rendered and hidden with CSS when motion is reduced: the server can't know the
              visitor's setting, so a JS branch here made the server and browser HTML differ. */}
          <button
            type="button"
            aria-pressed={isPausedByUser}
            onClick={() => setIsPausedByUser((paused) => !paused)}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-home-accent/40 px-4 text-sm font-semibold text-home-accent transition-colors duration-200 hover:bg-home-field focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-action motion-reduce:hidden"
          >
            {isPausedByUser ? (
              <Play aria-hidden className="size-4" />
            ) : (
              <Pause aria-hidden className="size-4" />
            )}
            {isPausedByUser ? "Play rotation" : "Pause rotation"}
          </button>
        </header>

        {/* Shrinks on short laptop screens so the whole section fits under the header. */}
        <div className="relative mx-auto w-full max-w-[min(calc(100vw-2rem),26rem)] sm:max-w-[min(calc(100vw-2rem),28rem)] lg:h-[min(500px,calc(100svh-13rem))] lg:max-w-[min(500px,calc(100svh-13rem))]">
          <div
            className="relative mx-auto aspect-square w-full overflow-visible lg:h-full lg:max-h-full"
            ref={orbitRef}
            style={{ perspective: "1000px" } as CSSProperties}
            onPointerEnter={() => setIsInteracting(true)}
            onPointerLeave={() => setIsInteracting(false)}
            onPointerDown={(event) => {
              if (event.pointerType === "touch") setIsTouchPaused(true);
            }}
            onFocus={() => setIsInteracting(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false);
            }}
          >
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-home-accent/20"
              style={{
                width: Math.max(0, orbitRadius * 2.4 - circleInset.outer),
                height: Math.max(0, orbitRadius * 2.4 - circleInset.outer),
              }}
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-home-accent/30"
              style={{
                width: Math.max(0, orbitRadius * 1.6 - circleInset.middle),
                height: Math.max(0, orbitRadius * 1.6 - circleInset.middle),
              }}
            />
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-home-accent/40"
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
                      "relative flex cursor-pointer flex-col items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-home-accent",
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
                            : "border-home-accent bg-home-ground text-home-accent hover:scale-110"
                        }`}
                      >
                        <Icon className="size-5 lg:size-[18px]" aria-hidden />
                      </div>
                    </div>

                    <div
                      className={`max-w-[6rem] text-center text-sm font-semibold leading-tight transition-all duration-300 lg:max-w-none ${
                        isExpanded ? "scale-110 text-home-accent sm:scale-125" : "text-home-ink"
                      }`}
                    >
                      {item.title}
                    </div>
                  </button>

                  <Card
                    id={`pillar-panel-${item.id}`}
                    hidden={!isExpanded}
                    labelledBy={`pillar-title-${item.id}`}
                    // Laptops only: on smaller screens it would cover the other pillars, so the
                    // description opens in a card under the orbit instead (below).
                    className="absolute top-full left-1/2 mt-4 w-[min(18rem,calc(100vw-2rem))] max-h-[min(16rem,50vh)] -translate-x-1/2 overflow-y-auto p-5 text-center max-lg:hidden"
                  >
                    <div
                      className="absolute -top-3 left-1/2 h-3 w-px -translate-x-1/2"
                      style={{
                        background: `linear-gradient(to bottom, ${accent.from}, transparent)`,
                      }}
                    />
                    <h3
                      id={`pillar-title-${item.id}`}
                      className="text-xl font-semibold text-home-ink"
                    >
                      {item.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-black dark:text-white">
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
            labelledBy="pillar-title-mobile"
            className="mx-auto w-full max-w-[min(calc(100vw-2.5rem),28rem)] scroll-mb-6 p-5 text-center"
          >
            <h3 id="pillar-title-mobile" className="text-xl font-semibold text-home-ink">
              {expandedItem?.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-black dark:text-white">
              {expandedItem?.content}
            </p>
          </Card>
        </div>
      </div>
      <ScrollToNext href="#thematic" label="Scroll to our thematic areas" />
    </section>
  );
}
