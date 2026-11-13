"use client";

import { Flower2, Lightbulb, LightbulbOff, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { homeHeroPanelClass, homeMeadowSkyClass } from "@/components/home/home-styles";
import { cn } from "@/lib/utils";

type Scene = "night" | "day";

type Flier = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  colour: { wing: string; edge: string };
  orbit: number;
  /** How far from the lamp or flower this one likes to stay, in pixels. */
  radius: number;
};

const COUNT: Record<Scene, number> = { night: 22, day: 16 };

// How fast the insects fly and beat their wings (1 was the first version's pace; it read as
// frantic). At 0.5, moths cruise at about 50 px a second and butterflies about 30.
const FLIGHT_SPEED = 0.5;
const WING_SPEED = 0.55;

// Night: the pale buffs and browns of moths that come to a light.
const mothColours = ["#e8dcc4", "#d9c39f", "#c7a57a", "#b98b5e", "#efe6d2", "#a88a6a"].map(
  (wing) => ({ wing, edge: wing }),
);
// Day: orange, yellow, blue and white butterflies, the colours of common Nepal species.
export const butterflyColours = [
  { wing: "#f08a24", edge: "#3b2a1a" },
  { wing: "#f2c230", edge: "#6b4a12" },
  { wing: "#4f7fd6", edge: "#1d2a4a" },
  { wing: "#f4f1e6", edge: "#6f6f60" },
  { wing: "#d8642f", edge: "#3b1f12" },
];

/** A small seeded random, so every visit starts with the same scene. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function makeFliers(scene: Scene, width: number, height: number): Flier[] {
  const random = seeded(scene === "night" ? 7 : 19);
  const colours = scene === "night" ? mothColours : butterflyColours;
  return Array.from({ length: COUNT[scene] }, (_, index) => ({
    x: random() * width,
    y: random() * height,
    vx: 0,
    vy: 0,
    phase: random() * Math.PI * 2,
    size: scene === "night" ? 5 + random() * 5 : 9 + random() * 6,
    colour: colours[index % colours.length],
    orbit: (random() > 0.5 ? 1 : -1) * (0.4 + random() * 0.6),
    // Each circles the lamp or flower at its own distance, spread from close in to far out.
    radius: 26 + random() * 90,
  }));
}

function drawMoth(context: CanvasRenderingContext2D, moth: Flier, light: number) {
  const flap = 0.55 + Math.abs(Math.sin(moth.phase)) * 0.45;
  context.save();
  context.translate(moth.x, moth.y);
  context.rotate(Math.atan2(moth.vy, moth.vx) + Math.PI / 2);
  context.globalAlpha = 0.35 + light * 0.65;
  context.fillStyle = moth.colour.wing;
  // Forewings, then the smaller hindwings, each pair scaled by the wingbeat.
  for (const side of [-1, 1]) {
    context.beginPath();
    context.ellipse(
      side * moth.size * 0.55 * flap,
      -moth.size * 0.1,
      moth.size * 0.62 * flap,
      moth.size * 0.38,
      side * 0.5,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.beginPath();
    context.ellipse(
      side * moth.size * 0.38 * flap,
      moth.size * 0.38,
      moth.size * 0.4 * flap,
      moth.size * 0.3,
      side * -0.4,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  context.fillStyle = "#5b4632";
  context.beginPath();
  context.ellipse(0, 0, moth.size * 0.14, moth.size * 0.55, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

/** A butterfly seen from above, wings beating with its phase. Also used by HomeVisitingInsects. */
export function drawButterfly(
  context: CanvasRenderingContext2D,
  butterfly: Pick<Flier, "x" | "y" | "vx" | "vy" | "phase" | "size" | "colour">,
) {
  const { size, colour } = butterfly;
  // Butterflies beat their wings more slowly, and fold them right up.
  const flap = 0.18 + Math.abs(Math.cos(butterfly.phase)) * 0.82;
  context.save();
  context.translate(butterfly.x, butterfly.y);
  context.rotate(Math.atan2(butterfly.vy, butterfly.vx) + Math.PI / 2);
  context.lineWidth = 1.2;
  context.strokeStyle = colour.edge;
  for (const side of [-1, 1]) {
    // Broad, rounded forewings and hindwings.
    context.fillStyle = colour.wing;
    context.beginPath();
    context.ellipse(
      side * size * 0.62 * flap,
      -size * 0.28,
      size * 0.66 * flap,
      size * 0.5,
      side * 0.35,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.stroke();
    context.beginPath();
    context.ellipse(
      side * size * 0.45 * flap,
      size * 0.36,
      size * 0.46 * flap,
      size * 0.4,
      side * -0.3,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.stroke();
    // A pale spot near each wingtip.
    context.fillStyle = "rgba(255, 255, 255, 0.85)";
    context.beginPath();
    context.arc(side * size * 0.95 * flap, -size * 0.48, size * 0.1, 0, Math.PI * 2);
    context.fill();
  }
  // The body, and the clubbed antennae that set butterflies apart from moths.
  context.fillStyle = "#2a2118";
  context.strokeStyle = "#2a2118";
  context.beginPath();
  context.ellipse(0, 0, size * 0.1, size * 0.62, 0, 0, Math.PI * 2);
  context.fill();
  context.lineWidth = 1;
  for (const side of [-1, 1]) {
    context.beginPath();
    context.moveTo(0, -size * 0.55);
    context.lineTo(side * size * 0.32, -size * 1.05);
    context.stroke();
    context.beginPath();
    context.arc(side * size * 0.32, -size * 1.05, 1.6, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

/** The soft white light round the flower (on the light layer, in front of any tree). */
function drawHalo(context: CanvasRenderingContext2D, x: number, y: number) {
  const halo = context.createRadialGradient(x, y, 0, x, y, 90);
  halo.addColorStop(0, "rgba(255, 255, 255, 0.7)");
  halo.addColorStop(1, "rgba(255, 255, 255, 0)");
  context.fillStyle = halo;
  context.beginPath();
  context.arc(x, y, 90, 0, Math.PI * 2);
  context.fill();
}

/**
 * The lamp's warm glow on the night (on the light layer, which can extend left of the scene).
 * `reach` is how far it spreads; only that square round the lamp is painted.
 */
function drawLampGlow(context: CanvasRenderingContext2D, x: number, y: number, reach: number) {
  const glow = context.createRadialGradient(x, y, 0, x, y, reach);
  // Brightness falls off like a real lamp's (roughly with the square of the distance, from a
  // 40px core), eased to nothing at `reach`: bright close by, faint within a short way.
  const core = 40;
  const atEdge = 1 / (1 + (reach / core) ** 2);
  for (const t of [0, 0.04, 0.08, 0.13, 0.2, 0.3, 0.42, 0.6, 0.8, 1]) {
    const falloff = (1 / (1 + ((t * reach) / core) ** 2) - atEdge) / (1 - atEdge);
    glow.addColorStop(
      t,
      `rgba(255, ${Math.round(244 - 16 * t)}, ${Math.round(214 - 44 * t)}, ${(0.6 * falloff).toFixed(3)})`,
    );
  }
  context.fillStyle = glow;
  context.fillRect(x - reach, y - reach, reach * 2, reach * 2);
}

function drawFlower(context: CanvasRenderingContext2D, x: number, y: number) {
  context.fillStyle = "#e86fa3";
  context.strokeStyle = "#c24f82";
  context.lineWidth = 1;
  for (let petal = 0; petal < 6; petal += 1) {
    const angle = (petal / 6) * Math.PI * 2;
    context.beginPath();
    context.ellipse(
      x + Math.cos(angle) * 11,
      y + Math.sin(angle) * 11,
      10,
      6,
      angle,
      0,
      Math.PI * 2,
    );
    context.fill();
    context.stroke();
  }
  context.fillStyle = "#f6c445";
  context.beginPath();
  context.arc(x, y, 6.5, 0, Math.PI * 2);
  context.fill();
}

/** Grass along the foot of the scene, the same tufts every visit: two greens by day, two
 * darker ones at night (the same as the hero's still grass on the left). */
const grassGreens: Record<Scene, [string, string]> = {
  day: ["#7fae62", "#5f9247"],
  night: ["#35602f", "#27482a"],
};

function drawGrass(context: CanvasRenderingContext2D, width: number, height: number, scene: Scene) {
  const [light, dark] = grassGreens[scene];
  const random = seeded(3);
  context.lineCap = "round";
  for (let blade = 0; blade < Math.round(width / 5); blade += 1) {
    const x = random() * width;
    const tall = 14 + random() * 34;
    context.strokeStyle = random() > 0.5 ? light : dark;
    context.lineWidth = 1.5 + random() * 1.5;
    context.beginPath();
    context.moveTo(x, height + 2);
    context.quadraticCurveTo(
      x + (random() - 0.5) * 10,
      height - tall * 0.6,
      x + (random() - 0.5) * 16,
      height - tall,
    );
    context.stroke();
  }
}

/**
 * Bring the insects to you. In the dark theme it is night: moths circle a lamp that follows
 * the visitor's pointer or finger. In the light theme it is day: butterflies come to a flower
 * instead. Switching the lamp off (or hiding the flower) sends them away. On phones and
 * tablets a pause button stops the lamp or flower following the finger. For visitors who
 * prefer reduced motion, each is a still scene with the insects gathered round.
 *
 * By default it sits in a card. With `fill` it has no card and fills the space it is given.
 */
export function HomeMothLight({ fill = false }: { fill?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // The light (lamp glow, flower halo) has its own canvas under the insects' one. A tree in the
  // hero sits under both, so the light falls on it and the insects fly in front of it; on a
  // laptop the light canvas also spans the hero's left half, so the glow can cross into it.
  const glowRef = useRef<HTMLCanvasElement>(null);
  const isOnRef = useRef(true);
  const isPausedRef = useRef(true);
  const redrawRef = useRef<(() => void) | null>(null);
  const [isOn, setIsOn] = useState(true);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    isOnRef.current = isOn;
    redrawRef.current?.();
  }, [isOn]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const glowCanvas = glowRef.current;
    const light = glowCanvas?.getContext("2d");
    if (!canvas || !context || !glowCanvas || !light) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sceneNow = (): Scene =>
      document.documentElement.classList.contains("dark") ? "night" : "day";
    let scene = sceneNow();
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const rest = () => ({ x: width * 0.5, y: height * (scene === "night" ? 0.42 : 0.48) });
    const target = { ...rest(), targetX: rest().x, targetY: rest().y };
    let fliers = makeFliers(scene, width, height);
    let frame = 0;
    let isVisible = true;

    // How far the light layer reaches left of the scene (0 when they're the same size; the
    // width of the hero's left half when it spans the whole hero on a laptop).
    let lightLeft = 0;
    let lightWidth = 0;
    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      lightWidth = glowCanvas.offsetWidth;
      lightLeft = lightWidth - width;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      glowCanvas.width = lightWidth * dpr;
      glowCanvas.height = height * dpr;
      // Drawn in the scene's own coordinates: x = 0 is still the scene's left edge.
      light.setTransform(dpr, 0, 0, dpr, lightLeft * dpr, 0);
    };
    resize();

    // The still scene: everyone placed round the lamp or flower.
    const gather = () => {
      const random = seeded(11);
      fliers = fliers.map((flier, index) => {
        const angle = (index / fliers.length) * Math.PI * 2;
        const radius = flier.radius + 8 + random() * 10;
        return {
          ...flier,
          x: target.x + Math.cos(angle) * radius,
          y: target.y + Math.sin(angle) * radius,
          vx: Math.cos(angle + 1.6),
          vy: Math.sin(angle + 1.6),
        };
      });
    };

    /** `frames`: time since the last step, in 60 Hz frames (so 1 on a 60 Hz screen). */
    const step = (frames: number) => {
      const on = isOnRef.current;
      const isDay = scene === "day";
      // The lamp or flower keeps up with the pointer at full speed; only the insects slow.
      const follow = 1 - Math.pow(0.88, frames);
      target.x += (target.targetX - target.x) * follow;
      target.y += (target.targetY - target.y) * follow;
      const dt = frames * FLIGHT_SPEED;
      const damping = Math.pow(0.9, dt);
      for (const flier of fliers) {
        const dx = target.x - flier.x;
        const dy = target.y - flier.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (on) {
          // Drawn to its own distance and swung round, the way moths circle a light. The
          // butterflies fly the same way round the flower, each on its own ring, so when the
          // flower moves they wheel after it side by side instead of trailing in one line.
          const pull = Math.max(-0.6, Math.min(0.6, (distance - flier.radius) * 0.012));
          flier.vx += ((dx / distance) * pull + (-dy / distance) * flier.orbit * 0.3) * dt;
          flier.vy += ((dy / distance) * pull + (dx / distance) * flier.orbit * 0.3) * dt;
        } else {
          flier.vx -= (dx / distance) * 0.08 * dt;
          flier.vy -= (dy / distance) * 0.08 * dt;
        }
        // A gentle push away from any neighbour that comes too close, so none hides another.
        // Butterflies are bigger, so they keep a wider berth.
        const room = flier.size * (isDay ? 2.6 : 1.8);
        for (const other of fliers) {
          if (other === flier) continue;
          const ox = flier.x - other.x;
          const oy = flier.y - other.y;
          const gap = Math.hypot(ox, oy);
          if (gap > 0 && gap < room) {
            const push = ((room - gap) / room) * 0.5 * dt;
            flier.vx += (ox / gap) * push;
            flier.vy += (oy / gap) * push;
          }
        }
        const jitter = 0.9 * dt;
        flier.vx += (Math.random() - 0.5) * jitter;
        flier.vy += (Math.random() - 0.5) * jitter;
        flier.vx *= damping;
        flier.vy *= damping;
        flier.x = Math.min(Math.max(flier.x + flier.vx * dt, -24), width + 24);
        flier.y = Math.min(Math.max(flier.y + flier.vy * dt, -24), height + 24);
        flier.phase +=
          (isDay ? 0.24 : 0.45 + Math.hypot(flier.vx, flier.vy) * 0.05) * frames * WING_SPEED;
      }
    };

    const draw = () => {
      const on = isOnRef.current;
      context.clearRect(0, 0, width, height);
      light.clearRect(-lightLeft, 0, lightWidth, height);
      drawGrass(context, width, height, scene);
      if (scene === "day") {
        if (on) {
          drawHalo(light, target.x, target.y);
          drawFlower(context, target.x, target.y);
        }
        for (const flier of fliers) drawButterfly(context, flier);
        return;
      }
      if (on) {
        // A short reach (200-320px), so the light only crosses into the hero's left half when
        // the lamp is brought close to the centre line.
        const reach = Math.min(320, Math.max(200, Math.min(width, height) * 0.5));
        drawLampGlow(light, target.x, target.y, reach);
        // The lamp itself stays on the front layer, in front of any tree.
        context.fillStyle = "#fff6df";
        context.beginPath();
        context.arc(target.x, target.y, 7, 0, Math.PI * 2);
        context.fill();
      }
      for (const flier of fliers) {
        const distance = Math.hypot(target.x - flier.x, target.y - flier.y);
        drawMoth(context, flier, on ? Math.max(0, 1 - distance / (width * 0.6)) : 0.15);
      }
    };

    let lastTime = 0;
    const loop = (time: number) => {
      // Measured in real time, so the insects fly at the same speed on 60 Hz and 120 Hz
      // screens; capped so a stalled tab doesn't send them flying on its return.
      const frames = lastTime ? Math.min((time - lastTime) / (1000 / 60), 3) : 1;
      lastTime = time;
      if (isVisible) {
        step(frames);
        draw();
      }
      frame = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      gather();
      redrawRef.current = draw;
      frame = requestAnimationFrame(() => redrawRef.current?.());
    } else {
      frame = requestAnimationFrame(loop);
    }

    // Switching the site theme swaps night for day (and moths for butterflies) in place.
    const theme = new MutationObserver(() => {
      const next = sceneNow();
      if (next === scene) return;
      scene = next;
      fliers = makeFliers(scene, width, height);
      if (reduceMotion) {
        gather();
        redrawRef.current?.();
      }
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Laptops: the lamp or flower always follows the pointer. Phones and tablets: only while
    // playing (after a double tap); paused, a finger on the scene (say, scrolling past it)
    // leaves the lamp or flower where it is, and the insects carry on flying round it.
    const laptop = window.matchMedia("(min-width: 64rem)");
    const following = () => laptop.matches || !isPausedRef.current;
    const onMove = (event: PointerEvent) => {
      if (!following()) return;
      const rect = canvas.getBoundingClientRect();
      target.targetX = event.clientX - rect.left;
      target.targetY = event.clientY - rect.top;
    };
    const onLeave = () => {
      if (!following()) return;
      target.targetX = rest().x;
      target.targetY = rest().y;
    };
    // Phones and tablets: a double tap starts play (or stops it). Starting, the scene glides to
    // fill the screen from wherever it was, and the lamp or flower comes to the finger.
    let lastTap = { time: -1000, x: 0, y: 0 };
    const onTap = (event: PointerEvent) => {
      if (laptop.matches) return;
      const double =
        event.timeStamp - lastTap.time < 350 &&
        Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 40;
      lastTap = { time: event.timeStamp, x: event.clientX, y: event.clientY };
      if (!double) return;
      lastTap.time = -1000;
      const starting = isPausedRef.current;
      isPausedRef.current = !starting;
      setIsPaused(!starting);
      if (!starting) return;
      const scene = canvas.closest("section");
      if (scene) {
        const top = scene.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
      }
      onMove(event);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerup", onTap);

    const resizer = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw();
    });
    resizer.observe(canvas);
    const onScreen = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      // Out of view (say, the header's links took the visitor elsewhere): play stops, so the
      // page scrolls normally again.
      if (!entry.isIntersecting && !isPausedRef.current && !laptop.matches) {
        isPausedRef.current = true;
        setIsPaused(true);
      }
    });
    onScreen.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      redrawRef.current = null;
      theme.disconnect();
      resizer.disconnect();
      onScreen.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerup", onTap);
    };
  }, []);

  // Both scenes' words are rendered and the theme shows one, in CSS, so the server and
  // browser render the same markup.
  const day = "dark:hidden";
  const night = "hidden dark:inline";

  const sceneBackground = cn(homeMeadowSkyClass, "dark:bg-none dark:bg-black");

  // The scene shows no title; this one names it for screen readers only.
  const heading = (
    <h2 id="light-scene-title" className="sr-only">
      <span className={day}>Bring the butterflies to your flower</span>
      <span className={night}>Bring the moths to your light</span>
    </h2>
  );

  const toggle = (
    <button
      type="button"
      onClick={() => setIsOn((on) => !on)}
      className={cn(
        "inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-semibold text-home-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action",
        fill
          ? "pointer-events-auto border-home-ink/15 bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
          : "border-home-ink/20 hover:bg-home-field",
      )}
    >
      <span className="inline-flex items-center gap-1.5 dark:hidden">
        <Flower2 aria-hidden className="size-4" />
        {isOn ? "Hide the flower" : "Show the flower"}
      </span>
      <span className="hidden items-center gap-1.5 dark:inline-flex">
        {isOn ? (
          <LightbulbOff aria-hidden className="size-4" />
        ) : (
          <Lightbulb aria-hidden className="size-4" />
        )}
        {isOn ? "Lamp off" : "Lamp on"}
      </span>
    </button>
  );

  // Phones and tablets only, where a finger scrolling past the scene also steers it. Pause
  // stops the lamp or flower following the finger (the insects keep flying); play hands control
  // back. Not shown when motion is reduced (nothing moves then).
  const pause = (
    <button
      type="button"
      onClick={() => setIsPaused((paused) => !paused)}
      aria-label={
        isPaused
          ? "Let the flower or lamp follow your finger"
          : "Stop the flower or lamp following your finger"
      }
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full border text-home-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action motion-reduce:hidden lg:hidden",
        fill
          ? "pointer-events-auto border-home-ink/15 bg-white/80 hover:bg-white dark:bg-white/10 dark:hover:bg-white/20"
          : "border-home-ink/20 hover:bg-home-field",
      )}
    >
      {isPaused ? (
        <Play aria-hidden className="size-4 translate-x-px" />
      ) : (
        <Pause aria-hidden className="size-4" />
      )}
    </button>
  );

  const description = (
    <p className="sr-only">
      <span className={day}>Animated butterflies flying to a flower in a sunny meadow.</span>
      <span className={night}>Animated moths circling a lamp at night.</span>
    </p>
  );

  if (fill) {
    // No card: the scene is the whole space it is given (on a laptop, the right half of the
    // hero, edge to edge), with its words laid over the top of it.
    return (
      <section
        aria-labelledby="light-scene-title"
        className={cn(
          "relative h-112 overflow-hidden rounded-2xl sm:h-128 lg:h-full lg:overflow-visible lg:rounded-none",
          // Phones and tablets: one full screen under the header, edge to edge.
          "max-lg:h-[calc(100svh-4.5rem)] max-lg:scroll-mt-[4.5rem] max-lg:rounded-none",
          sceneBackground,
        )}
      >
        {/* Layers, back to front: the sky (the section's background), any tree the hero
            stands here (z-10), the light (z-15; on a laptop it spans the whole hero, so the
            lamp's glow reaches the left half too), then the insects, grass and lamp (z-20). */}
        <canvas
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[15] block size-full lg:left-auto lg:w-[200%]"
        />
        <canvas
          ref={canvasRef}
          aria-hidden
          className={cn(
            "absolute inset-0 z-20 block size-full cursor-none",
            isPaused ? "touch-pan-y" : "max-lg:touch-none",
          )}
        />
        {description}
        {/* Phones and tablets, until a double tap starts play. */}
        {isPaused ? (
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[28%] z-20 flex justify-center opacity-80 motion-reduce:hidden lg:hidden"
          >
            {/* In the open sky above the flower or lamp, where the insects gather. */}
            <span className="rounded-full bg-white/75 px-5 py-2.5 text-lg font-semibold text-home-ink shadow-sm dark:bg-white/15">
              Double tap to play
            </span>
          </p>
        ) : null}
        {/* The words don't catch the pointer, so the lamp or flower follows it under them
            too. On a laptop they start below the site header, which the scene runs under. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4 sm:p-5 lg:justify-end lg:px-8 lg:pt-28">
          {heading}
          {pause}
          {toggle}
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="light-scene-title" className={homeHeroPanelClass}>
      <div className="flex items-start justify-between gap-3 px-1 pb-3 lg:justify-end">
        {heading}
        {pause}
        {toggle}
      </div>

      <div className={cn("relative overflow-hidden rounded-xl", sceneBackground)}>
        <canvas ref={glowRef} aria-hidden className="absolute inset-0 block size-full" />
        <canvas
          ref={canvasRef}
          aria-hidden
          className="relative z-20 block aspect-square w-full cursor-none touch-pan-y sm:aspect-4/3 lg:aspect-square"
        />
        {description}
      </div>
    </section>
  );
}
