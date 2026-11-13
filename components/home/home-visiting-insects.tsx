"use client";

import { useEffect, useRef } from "react";
import { butterflyColours, drawButterfly } from "@/components/home/home-moth-light";

type Scene = "night" | "day";

type Visitor = {
  x: number;
  y: number;
  heading: number;
  speed: number;
  /** Fireflies: the blink. Butterflies: the wingbeat. */
  phase: number;
  rate: number;
  size: number;
  colour: (typeof butterflyColours)[number];
  /** 0 → 1 as it arrives, 1 → 0 as it leaves. */
  presence: number;
  leaving: boolean;
};

const ARRIVE_EVERY_MS = 3000;
// The most at once. Fireflies: six on a laptop-wide window, three on phones and tablets.
// Butterflies are larger and brighter: two on a laptop, one on phones and tablets, where they
// would otherwise cover what people read.
const MAX_VISITORS: Record<Scene, { wide: number; narrow: number }> = {
  night: { wide: 6, narrow: 3 },
  day: { wide: 2, narrow: 1 },
};
const WIDE_FROM = 1024;
const MARGIN = 40;

/** Each kind's flight: fireflies drift slowly; butterflies flit faster and turn more. */
const flight: Record<Scene, { speed: [number, number]; wander: number }> = {
  night: { speed: [22, 36], wander: 2.4 },
  day: { speed: [34, 52], wander: 3.6 },
};

function drawFirefly(context: CanvasRenderingContext2D, firefly: Visitor) {
  // A soft pulse: mostly glowing, now and then dimming right down.
  const pulse = 0.35 + 0.65 * Math.max(0, Math.sin(firefly.phase)) ** 0.6;
  const alpha = pulse * firefly.presence;
  if (alpha <= 0.01) return;
  const glow = context.createRadialGradient(firefly.x, firefly.y, 0, firefly.x, firefly.y, 14);
  glow.addColorStop(0, `rgba(222, 246, 140, ${0.55 * alpha})`);
  glow.addColorStop(0.35, `rgba(196, 232, 96, ${0.22 * alpha})`);
  glow.addColorStop(1, "rgba(196, 232, 96, 0)");
  context.fillStyle = glow;
  context.fillRect(firefly.x - 14, firefly.y - 14, 28, 28);
  context.fillStyle = `rgba(246, 255, 210, ${alpha})`;
  context.beginPath();
  context.arc(firefly.x, firefly.y, 1.8, 0, Math.PI * 2);
  context.fill();
}

/**
 * Visitors over the sections below the hero (the homepage (/)): fireflies in the dark theme,
 * butterflies (the same as the hero's meadow) in the light theme. One flies in every 3
 * seconds; once there are six fireflies (four on phones and tablets) or two butterflies,
 * each newcomer sends the oldest flying off, so there are never more than that. They never
 * catch the pointer, rest while the hero is on screen or the tab is hidden, and stay away
 * entirely for visitors who prefer reduced motion.
 */
export function HomeVisitingInsects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const sceneNow = (): Scene =>
      document.documentElement.classList.contains("dark") ? "night" : "day";
    let scene = sceneNow();
    // They belong to the sections below the hero: they rest while it is in view.
    let heroInView = true;
    const hero = document.querySelector('section[aria-labelledby="home-hero-title"]');
    const heroWatch = new IntersectionObserver(
      ([entry]) => {
        heroInView = entry.isIntersecting;
      },
      // "In view" while more than a sliver of the hero still shows under the header.
      { rootMargin: "-80px 0px 0px 0px", threshold: 0.12 },
    );
    if (hero) heroWatch.observe(hero);
    else heroInView = false;

    const visitors: Visitor[] = [];
    let arrivals = 0;

    /** A newcomer, just outside a random edge, heading in. */
    const arrive = () => {
      const edge = Math.floor(Math.random() * 4);
      const along = Math.random();
      const x = edge === 1 ? width + MARGIN / 2 : edge === 3 ? -MARGIN / 2 : along * width;
      const y = edge === 0 ? -MARGIN / 2 : edge === 2 ? height + MARGIN / 2 : along * height;
      const heading = Math.atan2(
        height * (0.3 + Math.random() * 0.4) - y,
        width * (0.2 + Math.random() * 0.6) - x,
      );
      const [slowest, fastest] = flight[scene].speed;
      visitors.push({
        x,
        y,
        heading,
        speed: slowest + Math.random() * (fastest - slowest),
        phase: Math.random() * Math.PI * 2,
        // Fireflies blink a couple of times a second; butterflies beat their wings faster.
        rate: scene === "night" ? 1.4 + Math.random() * 1.2 : 7 + Math.random() * 3,
        size: 11 + Math.random() * 5,
        colour: butterflyColours[arrivals % butterflyColours.length],
        presence: 0,
        leaving: false,
      });
      arrivals += 1;
      // At the most, the oldest one still here flies off to make room.
      const most = MAX_VISITORS[scene][width >= WIDE_FROM ? "wide" : "narrow"];
      const staying = visitors.filter((visitor) => !visitor.leaving);
      if (staying.length > most) {
        const oldest = staying[0];
        oldest.leaving = true;
        // Out towards the nearest edge.
        const toEdges = [
          [oldest.x, Math.PI],
          [width - oldest.x, 0],
          [oldest.y, -Math.PI / 2],
          [height - oldest.y, Math.PI / 2],
        ] as const;
        oldest.heading = [...toEdges].sort((a, b) => a[0] - b[0])[0][1];
      }
    };

    const step = (seconds: number) => {
      const { wander } = flight[scene];
      for (const visitor of visitors) {
        if (visitor.leaving) {
          visitor.presence = Math.max(0, visitor.presence - seconds * 0.35);
        } else {
          visitor.presence = Math.min(1, visitor.presence + seconds * 0.8);
          // Wander: a meandering turn, and a gentle pull back if it nears an edge.
          visitor.heading += (Math.random() - 0.5) * wander * seconds;
          const nearEdge =
            visitor.x < 80 || visitor.x > width - 80 || visitor.y < 100 || visitor.y > height - 80;
          if (nearEdge) {
            const towardsMiddle = Math.atan2(height / 2 - visitor.y, width / 2 - visitor.x);
            const turn = Math.atan2(
              Math.sin(towardsMiddle - visitor.heading),
              Math.cos(towardsMiddle - visitor.heading),
            );
            visitor.heading += turn * Math.min(1, seconds * 1.5);
          }
        }
        visitor.x += Math.cos(visitor.heading) * visitor.speed * seconds;
        visitor.y += Math.sin(visitor.heading) * visitor.speed * seconds;
        visitor.phase += visitor.rate * seconds;
      }
      // Gone once it has flown out of sight (or faded away).
      for (let index = visitors.length - 1; index >= 0; index -= 1) {
        const visitor = visitors[index];
        const outside =
          visitor.x < -MARGIN ||
          visitor.x > width + MARGIN ||
          visitor.y < -MARGIN ||
          visitor.y > height + MARGIN;
        if (visitor.leaving && (outside || visitor.presence === 0)) visitors.splice(index, 1);
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      for (const visitor of visitors) {
        if (scene === "night") {
          drawFirefly(context, visitor);
          continue;
        }
        context.globalAlpha = visitor.presence;
        drawButterfly(context, {
          x: visitor.x,
          y: visitor.y,
          vx: Math.cos(visitor.heading),
          vy: Math.sin(visitor.heading),
          phase: visitor.phase,
          size: visitor.size,
          colour: visitor.colour,
        });
        context.globalAlpha = 1;
      }
    };

    let frame = 0;
    let lastTime = 0;
    let sinceArrival = ARRIVE_EVERY_MS;
    let showing = false;
    const loop = (time: number) => {
      const elapsed = lastTime ? Math.min(time - lastTime, 100) : 16;
      lastTime = time;
      const active = !heroInView;
      if (active) {
        sinceArrival += elapsed;
        if (sinceArrival >= ARRIVE_EVERY_MS) {
          sinceArrival = 0;
          arrive();
        }
        step(elapsed / 1000);
        draw();
        // How many are here and how many are flying off, for anyone checking the rhythm.
        const here = String(visitors.filter((visitor) => !visitor.leaving).length);
        const going = String(visitors.filter((visitor) => visitor.leaving).length);
        if (canvas.dataset.here !== here) canvas.dataset.here = here;
        if (canvas.dataset.leaving !== going) canvas.dataset.leaving = going;
        if (canvas.dataset.kind !== scene) canvas.dataset.kind = scene;
      }
      if (active !== showing) {
        showing = active;
        canvas.style.opacity = active ? "1" : "0";
      }
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // A change of theme swaps the visitors: fireflies at night, butterflies by day. The new
    // kind starts afresh, one every 3 seconds.
    const theme = new MutationObserver(() => {
      const next = sceneNow();
      if (next === scene) return;
      scene = next;
      visitors.length = 0;
      sinceArrival = ARRIVE_EVERY_MS;
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      heroWatch.disconnect();
      theme.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Over the page (under the site header), never catching the pointer; it fades in and out
      // as the sections below the hero come and go.
      className="pointer-events-none fixed inset-0 z-[60] size-full opacity-0 transition-opacity duration-700"
    />
  );
}
