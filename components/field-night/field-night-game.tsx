"use client";

import { useTheme } from "@teispace/next-themes";
import { ArrowRight, Lightbulb, LightbulbOff, Play, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  drawButterfly,
  drawFlower,
  drawGrass,
  drawLampGlow,
  drawMoth,
} from "@/components/home/home-moth-light";
import type { QuizSpecies } from "@/lib/content/inaturalist";
import { cn } from "@/lib/utils";

export type Mode = "night" | "day";
type Phase = "ready" | "playing" | "done";

type GameSpecies = QuizSpecies & {
  /** Among the least recorded: shows up less often, stays a shorter time, scores more. */
  rare: boolean;
  colour: { wing: string; edge: string };
  weight: number;
};

type Insect = {
  id: number;
  species: GameSpecies;
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: number;
  size: number;
  colour: { wing: string; edge: string };
  orbit: number;
  radius: number;
  /** Seconds before it flies off. */
  life: number;
  leaving: boolean;
  exit: { x: number; y: number };
  wander: number;
};

type Popup = { x: number; y: number; text: string; age: number; good: boolean };
type Flash = { x: number; y: number; age: number };

/** What the round records: each species and how many times it was photographed or counted. */
type Tally = Map<number, { species: GameSpecies; count: number }>;

const ROUND_SECONDS = 60;
const MAX_ON_SCREEN = 14;
const SPAWN_EVERY = 0.65;
const POINTS = { newSpecies: 10, newRare: 25, repeat: 2, overload: -15, rested: 5 };

const modeText: Record<
  Mode,
  {
    title: string;
    lure: string;
    verb: string;
    howTo: string[];
    cta: { label: string; href: string };
  }
> = {
  night: {
    title: "Moth Survey",
    lure: "lamp",
    verb: "photographed",
    howTo: [
      "Move the lamp with your mouse or finger. Moths fly to its light.",
      "Tap a moth to photograph it. A new species scores 10, a rare one (gold ring) 25.",
      "Watch the moth welfare bar: too long under a bright lamp tires them out. Switch the lamp off to let them rest.",
    ],
    cta: {
      label: "Photograph real moths with Moths of Bagmati",
      href: "/projects/moths-of-bagmati-province",
    },
  },
  day: {
    title: "Butterfly Count",
    lure: "flower",
    verb: "counted",
    howTo: [
      "Move the flower with your mouse or finger. Butterflies come to feed.",
      "Tap a butterfly to count it. A new species scores 10, a rare one (gold ring) 25.",
      "Look closely at the wing colours: the score rewards species, not just numbers.",
    ],
    cta: {
      label: "See our Big Butterfly Count at Godawari",
      href: "/news/big-butterfly-count-2026-godawari-walk",
    },
  },
};

/** Gives each species its own wing colours: bright butterflies, earthy moths. */
function speciesColour(mode: Mode, index: number) {
  if (mode === "day") {
    const hue = Math.round((index * 137.5) % 360);
    return { wing: `hsl(${hue} 72% 58%)`, edge: `hsl(${hue} 45% 22%)` };
  }
  const hue = 18 + ((index * 23) % 40);
  const sat = 18 + ((index * 13) % 40);
  const light = 48 + ((index * 17) % 34);
  const wing = `hsl(${hue} ${sat}% ${light}%)`;
  return { wing, edge: wing };
}

/** The species pool for a round: rarity from the record counts, colours by position. */
function prepareSpecies(mode: Mode, species: QuizSpecies[]): GameSpecies[] {
  const pool = species.slice(0, 16);
  const byCount = [...pool].sort((a, b) => a.count - b.count);
  const rareIds = new Set(
    byCount.slice(0, Math.max(2, Math.floor(pool.length / 4))).map((s) => s.id),
  );
  return pool.map((item, index) => {
    const rare = rareIds.has(item.id);
    return {
      ...item,
      rare,
      colour: speciesColour(mode, index),
      weight: Math.sqrt(item.count) * (rare ? 0.35 : 1),
    };
  });
}

function pickSpecies(pool: GameSpecies[]) {
  const total = pool.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const item of pool) {
    roll -= item.weight;
    if (roll <= 0) return item;
  }
  return pool[pool.length - 1];
}

const bestKey = (mode: Mode) => `field-night-best-${mode}`;
function readBest(mode: Mode) {
  try {
    return Number(window.localStorage.getItem(bestKey(mode))) || 0;
  } catch {
    return 0;
  }
}
function saveBest(mode: Mode, score: number) {
  try {
    window.localStorage.setItem(bestKey(mode), String(score));
  } catch {
    // Private browsing: the best score just isn't kept.
  }
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action";
const buttonClass = cn(
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors duration-200",
  focusRing,
);

/**
 * Field Night: the hero's moth lamp and butterfly flower as a 60-second game. By night
 * (Moth Survey) moths come to a lamp that follows the pointer; tap one to photograph it, and
 * switch the lamp off before the moths tire. By day (Butterfly Count) butterflies come to a
 * flower; tap one to count it. Every species is a real one recorded in Nepal (iNaturalist), and
 * the round ends with the species found, their photos and a link to the real project.
 */
export function FieldNightGame({
  moths,
  butterflies,
}: {
  moths: QuizSpecies[] | null;
  butterflies: QuizSpecies[] | null;
}) {
  const { resolvedTheme } = useTheme();
  const [mode, setMode] = useState<Mode>("night");
  const [phase, setPhase] = useState<Phase>("ready");
  const [hud, setHud] = useState({
    time: ROUND_SECONDS,
    score: 0,
    found: 0,
    stress: 0,
    lamp: true,
  });
  const [result, setResult] = useState<{ score: number; best: number; tally: Tally } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lampRef = useRef(true);
  const toggleLampRef = useRef<() => void>(() => {});

  // Start in the mode that matches the site's theme (until the visitor picks one).
  const pickedRef = useRef(false);
  useEffect(() => {
    if (!pickedRef.current && resolvedTheme) setMode(resolvedTheme === "dark" ? "night" : "day");
  }, [resolvedTheme]);

  const source = mode === "night" ? moths : butterflies;
  const text = modeText[mode];

  const choose = (next: Mode) => {
    pickedRef.current = true;
    setMode(next);
    setPhase("ready");
    setResult(null);
  };

  const start = useCallback(() => {
    setResult(null);
    setPhase("playing");
  }, []);

  // The round: a canvas loop that runs only while playing.
  useEffect(() => {
    if (phase !== "playing" || !source) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speedScale = reduceMotion ? 0.55 : 1;
    const pool = prepareSpecies(mode, source);
    for (const item of pool) new window.Image().src = item.photo.src;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const target = { x: width / 2, y: height * 0.45 };
    const insects: Insect[] = [];
    const popups: Popup[] = [];
    const flashes: Flash[] = [];
    const tally: Tally = new Map();
    let nextId = 1;
    let score = 0;
    let stress = 0;
    let timeLeft = ROUND_SECONDS;
    let spawnTimer = 0;
    let clock = 0;
    let last = performance.now();
    let frame = 0;
    lampRef.current = true;

    const popup = (x: number, y: number, message: string, good: boolean) =>
      popups.push({ x, y, text: message, age: 0, good });

    const toggleLamp = () => {
      if (mode !== "night") return;
      lampRef.current = !lampRef.current;
      if (!lampRef.current && stress >= 60) {
        score += POINTS.rested;
        popup(target.x, target.y - 40, `+${POINTS.rested} moths rested`, true);
      }
    };
    toggleLampRef.current = toggleLamp;

    const edgePoint = () => {
      const side = Math.floor(Math.random() * 4);
      const along = Math.random();
      const pad = 30;
      return side === 0
        ? { x: -pad, y: along * height * 0.8 }
        : side === 1
          ? { x: width + pad, y: along * height * 0.8 }
          : side === 2
            ? { x: along * width, y: -pad }
            : { x: along * width, y: height * 0.7 };
    };

    const spawn = () => {
      const species = pickSpecies(pool);
      const at = edgePoint();
      insects.push({
        id: nextId++,
        species,
        x: at.x,
        y: at.y,
        vx: 0,
        vy: 0,
        phase: Math.random() * Math.PI * 2,
        size: mode === "night" ? 7 + Math.random() * 4 : 11 + Math.random() * 4,
        colour: species.colour,
        orbit: (Math.random() > 0.5 ? 1 : -1) * (0.5 + Math.random() * 0.6),
        radius: 30 + Math.random() * 80,
        life: species.rare ? 3.5 + Math.random() * 1.5 : 8 + Math.random() * 5,
        leaving: false,
        exit: edgePoint(),
        wander: Math.random() * Math.PI * 2,
      });
    };

    const record = (insect: Insect) => {
      const entry = tally.get(insect.species.id);
      if (entry) {
        entry.count += 1;
        score += POINTS.repeat;
        popup(insect.x, insect.y, `+${POINTS.repeat}`, true);
      } else {
        tally.set(insect.species.id, { species: insect.species, count: 1 });
        const points = insect.species.rare ? POINTS.newRare : POINTS.newSpecies;
        score += points;
        popup(
          insect.x,
          insect.y,
          `+${points} ${insect.species.rare ? "Rare! " : "New: "}${insect.species.name}`,
          true,
        );
      }
      flashes.push({ x: insect.x, y: insect.y, age: 0 });
    };

    const pointAt = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      return { x: event.clientX - box.left, y: event.clientY - box.top };
    };
    const onMove = (event: PointerEvent) => {
      const point = pointAt(event);
      target.x = point.x;
      target.y = point.y;
    };
    const onDown = (event: PointerEvent) => {
      const point = pointAt(event);
      target.x = point.x;
      target.y = point.y;
      // The nearest insect within reach of the tap (generous, for fingers).
      let best: Insect | null = null;
      let bestDistance = Infinity;
      for (const insect of insects) {
        const distance = Math.hypot(insect.x - point.x, insect.y - point.y);
        if (distance < Math.max(24, insect.size * 2.2) && distance < bestDistance) {
          best = insect;
          bestDistance = distance;
        }
      }
      if (best) {
        record(best);
        insects.splice(insects.indexOf(best), 1);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "l") toggleLamp();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);

    const draw = () => {
      const night = mode === "night";
      const sky = context.createLinearGradient(0, 0, 0, height);
      if (night) {
        sky.addColorStop(0, "#0a1322");
        sky.addColorStop(1, "#1a2a3c");
      } else {
        sky.addColorStop(0, "#eaf3fb");
        sky.addColorStop(0.55, "#eef6e6");
        sky.addColorStop(1, "#d6e9c8");
      }
      context.fillStyle = sky;
      context.fillRect(0, 0, width, height);

      if (night && lampRef.current) drawLampGlow(context, target.x, target.y, 260);
      drawGrass(context, width, height, mode);

      for (const insect of insects) {
        if (night) {
          const light = lampRef.current
            ? Math.max(0.35, 1 - Math.hypot(insect.x - target.x, insect.y - target.y) / 420)
            : 0.45;
          drawMoth(context, insect, light);
        } else {
          drawButterfly(context, insect);
        }
        // Rare species wear a faint gold ring, so they are worth chasing.
        if (insect.species.rare && !insect.leaving) {
          context.strokeStyle = "rgba(246, 196, 69, 0.85)";
          context.lineWidth = 1.5;
          context.beginPath();
          context.arc(insect.x, insect.y, insect.size * 1.6, 0, Math.PI * 2);
          context.stroke();
        }
      }

      if (night) {
        // The lamp itself.
        context.fillStyle = lampRef.current ? "#fff4d6" : "#5b6472";
        context.beginPath();
        context.arc(target.x, target.y, 7, 0, Math.PI * 2);
        context.fill();
      } else {
        drawFlower(context, target.x, target.y);
      }

      for (const flash of flashes) {
        context.strokeStyle = `rgba(255, 255, 255, ${1 - flash.age / 0.4})`;
        context.lineWidth = 2;
        context.beginPath();
        context.arc(flash.x, flash.y, 10 + flash.age * 80, 0, Math.PI * 2);
        context.stroke();
      }
      context.font = "600 14px system-ui, sans-serif";
      context.textAlign = "center";
      for (const item of popups) {
        context.globalAlpha = Math.max(0, 1 - item.age / 1.4);
        context.fillStyle = item.good ? (night ? "#ffe9a8" : "#1f5f23") : "#e5484d";
        // Kept inside the play area, so a long species name never runs off a phone's edge.
        const half = context.measureText(item.text).width / 2 + 8;
        const x = Math.min(Math.max(item.x, half), Math.max(half, width - half));
        context.fillText(item.text, x, item.y - 16 - item.age * 30);
      }
      context.globalAlpha = 1;
    };

    let shownTime = -1;
    let shownScore = -1;
    let shownFound = -1;
    let shownStress = -1;
    let shownLamp = !lampRef.current;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      clock += dt;
      timeLeft -= dt;

      spawnTimer -= dt;
      if (spawnTimer <= 0 && insects.length < MAX_ON_SCREEN) {
        spawn();
        spawnTimer = SPAWN_EVERY * (0.6 + Math.random() * 0.8);
      }

      const night = mode === "night";
      const attracted = !night || lampRef.current;
      let near = 0;
      for (let index = insects.length - 1; index >= 0; index -= 1) {
        const insect = insects[index];
        insect.life -= dt;
        if (insect.life <= 0) insect.leaving = true;
        const speed =
          (night ? 95 : 65) *
          (insect.species.rare ? 1.45 : 1) *
          speedScale *
          (insect.leaving ? 1.3 : 1);
        let desiredX: number;
        let desiredY: number;
        if (insect.leaving) {
          desiredX = insect.exit.x - insect.x;
          desiredY = insect.exit.y - insect.y;
        } else if (attracted) {
          const angle = clock * insect.orbit + insect.phase * 0.1;
          desiredX = target.x + Math.cos(angle) * insect.radius - insect.x;
          desiredY = target.y + Math.sin(angle) * insect.radius * 0.7 - insect.y;
        } else {
          // Lamp off: the moths drift about on their own.
          insect.wander += (Math.random() - 0.5) * dt * 3;
          desiredX = Math.cos(insect.wander);
          desiredY = Math.sin(insect.wander);
        }
        const length = Math.hypot(desiredX, desiredY) || 1;
        const ease = Math.min(1, dt * 2.6);
        insect.vx += ((desiredX / length) * speed - insect.vx) * ease;
        insect.vy += ((desiredY / length) * speed - insect.vy) * ease;
        insect.x += insect.vx * dt;
        insect.y += insect.vy * dt;
        insect.phase += dt * (night ? 16 : 8);
        if (!insect.leaving && Math.hypot(insect.x - target.x, insect.y - target.y) < 90) near += 1;
        // Gone once well off screen.
        if (
          insect.leaving &&
          (insect.x < -60 || insect.x > width + 60 || insect.y < -60 || insect.y > height + 60)
        ) {
          insects.splice(index, 1);
        }
      }

      if (night) {
        stress = lampRef.current
          ? Math.min(100, stress + dt * (0.6 + near * 0.5))
          : Math.max(0, stress - dt * 20);
        if (stress >= 100) {
          score += POINTS.overload;
          popup(target.x, target.y - 40, `${POINTS.overload} moths exhausted`, false);
          lampRef.current = false;
          stress = 60;
          for (const insect of insects) insect.leaving = true;
        }
      }

      for (const item of popups) item.age += dt;
      for (const flash of flashes) flash.age += dt;
      while (popups.length && popups[0].age > 1.4) popups.shift();
      while (flashes.length && flashes[0].age > 0.4) flashes.shift();

      draw();

      // The scoreboard only re-renders when something on it changes.
      const time = Math.max(0, Math.ceil(timeLeft));
      const stressShown = Math.round(stress);
      if (
        time !== shownTime ||
        score !== shownScore ||
        tally.size !== shownFound ||
        stressShown !== shownStress ||
        lampRef.current !== shownLamp
      ) {
        shownTime = time;
        shownScore = score;
        shownFound = tally.size;
        shownStress = stressShown;
        shownLamp = lampRef.current;
        setHud({ time, score, found: tally.size, stress: stressShown, lamp: lampRef.current });
      }

      if (timeLeft <= 0) {
        const best = Math.max(readBest(mode), score);
        saveBest(mode, best);
        setResult({ score, best, tally });
        setPhase("done");
        return;
      }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
      toggleLampRef.current = () => {};
    };
  }, [phase, mode, source]);

  const total = source ? Math.min(source.length, 16) : 0;
  const night = mode === "night";

  return (
    <div>
      {/* Mode: Moth Survey by night, Butterfly Count by day. */}
      <div role="group" aria-label="Game mode" className="flex flex-wrap justify-center gap-2">
        {(["night", "day"] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id}
            onClick={() => choose(id)}
            disabled={phase === "playing"}
            className={cn(
              buttonClass,
              "border disabled:cursor-not-allowed disabled:opacity-50",
              mode === id
                ? "border-home-action bg-home-action text-home-action-foreground"
                : "border-home-ink/15 bg-home-surface text-home-ink hover:border-home-ink/40",
            )}
          >
            {modeText[id].title}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "relative mt-6 overflow-hidden rounded-[20px] border border-home-line shadow-[0_18px_40px_rgb(24_61_50/0.16)]",
          night ? "bg-[#0a1322]" : "bg-[#eef6e6]",
        )}
      >
        <canvas
          ref={canvasRef}
          aria-label={`${text.title}: tap the ${night ? "moths" : "butterflies"} that come to the ${text.lure}.`}
          className={cn(
            "block h-[min(70svh,40rem)] min-h-[26rem] w-full touch-none select-none",
            phase === "playing" ? "cursor-crosshair" : "pointer-events-none",
          )}
        />

        {/* Scoreboard while playing. */}
        {phase === "playing" ? (
          <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-wrap items-start justify-between gap-2">
            <div
              className={cn(
                "flex gap-4 rounded-xl px-4 py-2 text-sm font-semibold tabular-nums backdrop-blur",
                night ? "bg-black/45 text-white" : "bg-white/80 text-[#14211d]",
              )}
            >
              <span aria-label="Time left">{hud.time}s</span>
              <span aria-label="Score">{hud.score} pts</span>
              <span aria-label="Species found">
                {hud.found}/{total} species
              </span>
            </div>
            {night ? (
              <div className="pointer-events-auto flex items-center gap-2">
                <div
                  className="w-32 rounded-xl bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur"
                  aria-label={`Moth welfare: ${100 - hud.stress}%`}
                >
                  Moth welfare
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/20">
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-200",
                        hud.stress > 70
                          ? "bg-[#e5484d]"
                          : hud.stress > 40
                            ? "bg-[#f6c445]"
                            : "bg-[#8bd88f]",
                      )}
                      style={{ width: `${100 - hud.stress}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleLampRef.current()}
                  aria-pressed={hud.lamp}
                  aria-label={hud.lamp ? "Switch the lamp off (L)" : "Switch the lamp on (L)"}
                  className={cn(
                    "inline-flex size-11 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur hover:bg-black/60",
                    focusRing,
                  )}
                >
                  {hud.lamp ? (
                    <Lightbulb aria-hidden className="size-5 text-[#ffe9a8]" />
                  ) : (
                    <LightbulbOff aria-hidden className="size-5" />
                  )}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Start screen. */}
        {phase === "ready" ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="max-w-md rounded-2xl bg-home-surface/95 p-6 text-home-ink shadow-xl backdrop-blur">
              <h2 className="text-2xl font-bold">{text.title}</h2>
              {source ? (
                <>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-home-muted">
                    {text.howTo.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm text-home-muted">
                    {total} real species recorded in Nepal. {ROUND_SECONDS} seconds.
                  </p>
                  <button
                    type="button"
                    onClick={start}
                    className={cn(
                      buttonClass,
                      "mt-5 w-full bg-home-action text-home-action-foreground",
                    )}
                  >
                    <Play aria-hidden className="size-4" />
                    Play
                  </button>
                </>
              ) : (
                <p className="mt-3 text-sm text-home-muted">
                  The species could not load from iNaturalist just now. Please try again in a little
                  while.
                </p>
              )}
            </div>
          </div>
        ) : null}

        {/* End of the round. */}
        {phase === "done" && result ? (
          <div className="absolute inset-0 overflow-y-auto bg-home-ground/95 p-4 backdrop-blur sm:p-6">
            <div className="mx-auto max-w-3xl text-home-ink">
              <p className="text-sm font-semibold text-home-accent">{text.title} complete</p>
              <h2 className="mt-1 text-3xl font-bold">
                {result.tally.size} species · {result.score} points
              </h2>
              <p className="mt-1 text-sm text-home-muted">
                {result.score >= result.best && result.score > 0
                  ? "A new best score!"
                  : `Your best: ${result.best} points`}
              </p>

              {result.tally.size > 0 ? (
                <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {[...result.tally.values()].map(({ species, count }) => (
                    <li
                      key={species.id}
                      className="overflow-hidden rounded-xl border border-home-line bg-home-surface"
                    >
                      <a
                        href={species.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn("block", focusRing)}
                      >
                        <div className="relative aspect-[4/3] bg-home-field">
                          <Image
                            src={species.photo.src}
                            alt={species.name}
                            fill
                            unoptimized
                            sizes="200px"
                            className="object-cover"
                          />
                          {species.rare ? (
                            <span className="absolute top-1.5 left-1.5 rounded-full bg-[#f6c445] px-2 py-0.5 text-xs font-bold text-black">
                              Rare
                            </span>
                          ) : null}
                        </div>
                        <div className="p-2.5">
                          <p className="text-sm leading-snug font-semibold">{species.name}</p>
                          <p className="text-xs text-home-muted italic">{species.scientificName}</p>
                          <p className="mt-1 text-xs text-home-muted">
                            {text.verb} ×{count}
                          </p>
                          <p className="mt-0.5 text-[0.7rem] text-home-muted">
                            Photo: {species.photo.credit} ({species.photo.license})
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-home-muted">
                  No species this time. Tap the {night ? "moths" : "butterflies"} as they come to
                  the {text.lure}.
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={start}
                  className={cn(buttonClass, "bg-home-action text-home-action-foreground")}
                >
                  <RotateCcw aria-hidden className="size-4" />
                  Play again
                </button>
                <Link
                  href={text.cta.href}
                  className={cn(
                    buttonClass,
                    "border border-home-ink/20 bg-home-surface text-home-ink hover:border-home-ink/50",
                  )}
                >
                  {text.cta.label}
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <p className="mt-3 text-center text-sm text-home-muted">
        Species and photos from iNaturalist: research-grade records in Nepal.
        {night ? " Press L to switch the lamp on or off." : ""}
      </p>
    </div>
  );
}
