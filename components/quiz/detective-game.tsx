"use client";

import { ArrowRight, Check, Lock, RotateCcw, Star, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { homeHeroPanelClass } from "@/components/home/home-styles";
import type { QuizGroup, QuizSpecies } from "@/lib/content/inaturalist";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action";

/** Photos per level, and how many must be right to unlock the next. */
const ROUNDS = 5;
const PASS = 4;

/** Each level draws from the most-recorded species: more of them, then more choices. */
export const levels = [
  { name: "Beginner", species: 6, choices: 3 },
  { name: "Explorer", species: 12, choices: 3 },
  { name: "Expert", species: 20, choices: 4 },
] as const;

/** 1 star for 3 right, 2 for 4, 3 for all 5. */
const starsFor = (right: number) => (right >= 5 ? 3 : right >= 4 ? 2 : right >= 3 ? 1 : 0);

type Progress = { unlocked: number; stars: number[] };

const storageKey = (group: string) => `nature-detective:${group}`;

/** Saved in the visitor's own browser; private windows may not keep it, which is fine. */
function loadProgress(group: string): Progress {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey(group)) ?? "null");
    if (saved && typeof saved.unlocked === "number" && Array.isArray(saved.stars)) return saved;
  } catch {}
  return { unlocked: 1, stars: [] };
}

function saveProgress(group: string, progress: Progress) {
  try {
    window.localStorage.setItem(storageKey(group), JSON.stringify(progress));
  } catch {}
}

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Five photos to name, each with its shuffled choices, from the level's species. */
function makeRounds(pool: QuizSpecies[], choices: number) {
  return shuffle(pool)
    .slice(0, ROUNDS)
    .map((answer) => ({
      answer,
      options: shuffle([
        answer,
        ...shuffle(pool.filter((item) => item.id !== answer.id)).slice(0, choices - 1),
      ]),
    }));
}

function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cn("inline-flex gap-0.5", className)} aria-label={`${count} of 3 stars`}>
      {[0, 1, 2].map((index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            "size-4",
            index < count ? "fill-[#e8a317] text-[#e8a317]" : "text-home-ink/25",
          )}
        />
      ))}
    </span>
  );
}

/** One level: five photos, a choice of names for each, then the result. */
function Level({
  group,
  level,
  onFinish,
  onExit,
}: {
  group: QuizGroup;
  level: number;
  onFinish: (right: number) => void;
  onExit: () => void;
}) {
  const settings = levels[level - 1];
  const pool = useMemo(
    () => (group.species ?? []).slice(0, settings.species),
    [group.species, settings.species],
  );
  const [rounds, setRounds] = useState(() => makeRounds(pool, settings.choices));
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [right, setRight] = useState(0);
  const [done, setDone] = useState(false);
  const [loadedId, setLoadedId] = useState<number | null>(null);

  const current = rounds[round];
  const isAnswered = picked !== null;

  // A new photo or the score: bring the card's top back into view if it has scrolled away.
  const card = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = card.current;
    if (el && el.getBoundingClientRect().top < 80) el.scrollIntoView({ block: "start" });
  }, [round, done]);

  // Fetch the next photo while this one is being answered.
  useEffect(() => {
    const next = rounds[round + 1];
    if (next) new window.Image().src = next.answer.photo.src;
  }, [rounds, round]);

  const pick = (id: number) => {
    if (isAnswered) return;
    setPicked(id);
    if (id === current.answer.id) setRight((value) => value + 1);
  };

  const next = () => {
    if (round + 1 < rounds.length) {
      setRound((value) => value + 1);
      setPicked(null);
    } else {
      setDone(true);
      onFinish(right);
    }
  };

  const retry = () => {
    setRounds(makeRounds(pool, settings.choices));
    setRound(0);
    setPicked(null);
    setRight(0);
    setDone(false);
  };

  if (done) {
    const passed = right >= PASS;
    return (
      <section
        ref={card}
        aria-live="polite"
        className={cn(homeHeroPanelClass, "scroll-mt-24 p-6 text-center sm:p-8")}
      >
        <p className="text-sm font-semibold text-home-accent">
          {group.label} · Level {level}: {settings.name}
        </p>
        <p className="mt-3 text-4xl font-bold text-home-ink tabular-nums">
          {right} / {rounds.length}
        </p>
        <Stars count={starsFor(right)} className="mt-3 justify-center [&_svg]:size-7" />
        <p className="mx-auto mt-4 max-w-[34ch] text-lg leading-snug text-home-ink">
          {passed
            ? level < levels.length
              ? `Well done, detective! Level ${level + 1} is unlocked.`
              : `Well done! You've mastered the ${group.label.toLowerCase()} of Nepal.`
            : `Get ${PASS} right to unlock the next level. Have another go!`}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-home-ink/25 px-5 text-sm font-semibold text-home-ink hover:bg-home-field",
              focusRing,
            )}
          >
            <RotateCcw aria-hidden className="size-4" />
            Play again
          </button>
          <button
            type="button"
            onClick={onExit}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-home-ink px-5 text-sm font-semibold text-home-ground",
              focusRing,
            )}
          >
            {passed && level < levels.length ? `Go to level ${level + 1}` : "All levels"}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </section>
    );
  }

  const { answer, options } = current;
  return (
    <section
      ref={card}
      aria-labelledby="detective-title"
      className={cn(homeHeroPanelClass, "scroll-mt-24")}
    >
      <div className="flex items-start justify-between gap-3 px-1 pb-3">
        <div>
          <h2 id="detective-title" className="text-sm font-semibold text-home-ink">
            Can you name this {group.one}?
          </h2>
          <p className="mt-0.5 text-[13px] text-home-muted">
            Level {level}: {settings.name} · Photo {round + 1} of {rounds.length}
          </p>
        </div>
        <p className="shrink-0 rounded-full bg-home-field px-3 py-1 text-[13px] font-semibold text-home-ink tabular-nums">
          {right} right
        </p>
      </div>
      {/* Progress: one mark per photo. */}
      <div aria-hidden className="mb-3 flex gap-1 px-1">
        {rounds.map((item, index) => (
          <span
            key={item.answer.id}
            className={cn(
              "h-1.5 flex-1 rounded-full",
              index < round || (index === round && isAnswered)
                ? "bg-home-accent"
                : "bg-home-ink/15",
            )}
          />
        ))}
      </div>

      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-home-field">
        <Image
          key={answer.id}
          src={answer.photo.src}
          alt={`The ${group.one} to name`}
          fill
          unoptimized
          loading="eager"
          onLoad={() => setLoadedId(answer.id)}
          className={cn(
            "object-cover",
            loadedId === answer.id ? "animate-field-reveal" : "opacity-0",
          )}
        />
      </div>

      <ul className="mt-4 grid gap-2">
        {options.map((option) => {
          const isAnswer = option.id === answer.id;
          const isPicked = option.id === picked;
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => pick(option.id)}
                disabled={isAnswered}
                aria-pressed={isPicked}
                className={cn(
                  "flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-4 text-left text-base font-semibold transition-colors duration-200",
                  focusRing,
                  !isAnswered &&
                    "cursor-pointer border-home-ink/20 text-home-ink hover:border-home-ink/50 hover:bg-home-field",
                  isAnswered &&
                    isAnswer &&
                    "border-[#2e7d32] bg-[#2e7d32] text-white dark:border-home-accent dark:bg-home-accent dark:text-home-ground",
                  isAnswered &&
                    isPicked &&
                    !isAnswer &&
                    "border-[#b42318] text-[#b42318] dark:border-[#f97066] dark:text-[#f97066]",
                  isAnswered && !isAnswer && !isPicked && "border-home-ink/10 text-home-muted",
                )}
              >
                {option.name}
                {isAnswered && isAnswer ? <Check aria-hidden className="size-5 shrink-0" /> : null}
                {isAnswered && isPicked && !isAnswer ? (
                  <X aria-hidden className="size-5 shrink-0" />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="min-h-[4.5rem] px-1 pt-4" aria-live="polite">
        {isAnswered ? (
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-base font-bold text-home-ink">
                {picked === answer.id ? "Right!" : "Not quite."} It&rsquo;s the {answer.name}.
              </p>
              <p className="mt-0.5 text-sm text-home-muted">
                <span className="italic">{answer.scientificName}</span>, seen{" "}
                {answer.count.toLocaleString("en-US")} times in Nepal
              </p>
            </div>
            <button
              type="button"
              onClick={next}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-home-ink px-5 text-sm font-semibold text-home-ground",
                focusRing,
              )}
            >
              {round + 1 < rounds.length ? "Next photo" : "See your score"}
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-home-muted">Pick a name to see the answer.</p>
        )}
      </div>

      <p className="mt-4 border-t border-home-line px-1 pt-3 text-[13px] text-home-muted">
        Photo &copy; {answer.photo.credit} ({answer.photo.license}) via{" "}
        <a
          href={answer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-home-ink"
        >
          iNaturalist
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}

/** A group's levels: pick one (locked until the one before is passed), then play it. */
export function DetectiveGame({ group }: { group: QuizGroup }) {
  const [progress, setProgress] = useState<Progress>({ unlocked: 1, stars: [] });
  const [playing, setPlaying] = useState<number | null>(null);

  // The saved progress is read in the browser only, after the first render.
  useEffect(() => {
    const timer = window.setTimeout(() => setProgress(loadProgress(group.id)), 0);
    return () => window.clearTimeout(timer);
  }, [group.id]);

  // Levels need enough species: Expert needs more than Beginner.
  const available = levels.filter(
    (level) => (group.species?.length ?? 0) >= Math.min(level.species, 8),
  ).length;

  const finish = (level: number, right: number) => {
    setProgress((current) => {
      const stars = [...current.stars];
      stars[level - 1] = Math.max(stars[level - 1] ?? 0, starsFor(right));
      const unlocked =
        right >= PASS
          ? Math.max(current.unlocked, Math.min(level + 1, available))
          : current.unlocked;
      const next = { unlocked, stars };
      saveProgress(group.id, next);
      return next;
    });
  };

  if (playing) {
    return (
      <Level
        key={`${group.id}-${playing}`}
        group={group}
        level={playing}
        onFinish={(right) => finish(playing, right)}
        onExit={() => setPlaying(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-center text-2xl font-bold text-home-ink">{group.label}</h2>
      <p className="mt-1 text-center text-sm text-home-muted">
        Get {PASS} of {ROUNDS} right to unlock the next level.
      </p>
      <ol className="mt-6 grid gap-3">
        {levels.slice(0, available).map((level, index) => {
          const number = index + 1;
          const locked = number > progress.unlocked;
          return (
            <li key={level.name}>
              <button
                type="button"
                disabled={locked}
                onClick={() => setPlaying(number)}
                className={cn(
                  "flex min-h-16 w-full items-center justify-between gap-4 rounded-xl border p-4 text-left transition-colors duration-200",
                  focusRing,
                  locked
                    ? "cursor-not-allowed border-home-ink/10 text-home-muted"
                    : "cursor-pointer border-home-ink/20 text-home-ink hover:border-home-ink/50 hover:bg-home-field",
                )}
              >
                <span>
                  <span className="block font-bold">
                    Level {number}: {level.name}
                  </span>
                  <span className="block text-sm text-home-muted">
                    {Math.min(level.species, group.species?.length ?? 0)} species · {level.choices}{" "}
                    choices
                  </span>
                </span>
                {locked ? (
                  <Lock aria-label="Locked" className="size-5 shrink-0" />
                ) : (
                  <Stars count={progress.stars[index] ?? 0} />
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
