"use client";

import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { homeHeroPanelClass } from "@/components/home/home-styles";
import type { QuizSpecies } from "@/lib/content/inaturalist";
import { cn } from "@/lib/utils";

/**
 * Three names for one photo, chosen from the round number so the server and browser agree:
 * the photos go down the list in order.
 * The three are shown in alphabetical order.
 */
function choicesFor(species: QuizSpecies[], round: number) {
  const total = species.length;
  const answerIndex = round % total;
  // The other names: two from opposite halves of the rest of the list, turning each round.
  const others = species.filter((_, index) => index !== answerIndex);
  const offset = (round * 3) % others.length;
  const options = [
    species[answerIndex],
    others[offset],
    others[(offset + Math.floor(others.length / 2)) % others.length],
  ];
  return {
    answer: species[answerIndex],
    options: options.sort((a, b) => a.name.localeCompare(b.name)),
  };
}

/**
 * "Name this species": a photo of one of Nepal's most-recorded butterflies and moths and
 * three names to choose from. The answer is revealed with its scientific name and sightings,
 * and a running score is kept for the visit.
 */
export function HomeNameQuiz({ species }: { species: QuizSpecies[] }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, played: 0 });
  const [loadedId, setLoadedId] = useState<number | null>(null);

  const { answer, options } = choicesFor(species, round);
  const isAnswered = picked !== null;
  const isRight = picked === answer.id;

  // Fetch the next photo while this one is being answered, so "Next photo" is instant.
  useEffect(() => {
    new window.Image().src = choicesFor(species, round + 1).answer.photo.src;
  }, [species, round]);

  const pick = (id: number) => {
    if (isAnswered) return;
    setPicked(id);
    setScore((value) => ({
      right: value.right + (id === answer.id ? 1 : 0),
      played: value.played + 1,
    }));
  };

  const next = () => {
    setPicked(null);
    setRound((value) => value + 1);
  };

  return (
    <section aria-labelledby="name-quiz-title" className={homeHeroPanelClass}>
      <div className="flex items-start justify-between gap-3 px-1 pb-3">
        <div>
          <h2 id="name-quiz-title" className="text-sm font-semibold text-home-ink">
            Can you name this species?
          </h2>
          <p className="mt-0.5 text-[13px] text-home-muted">All of them are common in Nepal.</p>
        </div>
        <p
          className="shrink-0 rounded-full bg-home-field px-3 py-1 text-[13px] font-semibold text-home-ink tabular-nums"
          aria-live="polite"
        >
          {score.right} / {score.played} right
        </p>
      </div>

      <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-home-field">
        <Image
          key={answer.id}
          src={answer.photo.src}
          alt="The butterfly or moth to name"
          fill
          unoptimized
          loading="eager"
          onLoad={() => setLoadedId(answer.id)}
          // The reveal waits for the photo, so it never uncovers an empty frame.
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
                  "flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-4 text-left text-base font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action",
                  !isAnswered &&
                    "border-home-ink/20 text-home-ink hover:border-home-ink/50 hover:bg-home-field",
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
                {isRight ? "Right!" : "Not quite."} It&rsquo;s the {answer.name}.
              </p>
              <p className="mt-0.5 text-sm text-home-muted">
                <span className="italic">{answer.scientificName}</span>, seen{" "}
                {answer.count.toLocaleString("en-US")} times in Nepal
              </p>
            </div>
            <button
              type="button"
              onClick={next}
              className="group/next inline-flex min-h-11 items-center gap-2 rounded-full bg-home-ink px-5 text-sm font-semibold text-home-ground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action"
            >
              Next photo
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-200 group-hover/next:translate-x-0.5"
              />
            </button>
          </div>
        ) : (
          <p className="text-sm text-home-muted">Pick a name to see the answer.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-home-line px-1 pt-3 text-[13px] text-home-muted">
        <p>
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
        <Link
          href="/projects/chinari-ai-wildlife-classification"
          className="inline-flex min-h-8 items-center gap-1 font-semibold text-home-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action"
        >
          Our AI that names species
          <ArrowUpRight aria-hidden className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
