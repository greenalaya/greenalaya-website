"use client";

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DetectiveGame } from "@/components/quiz/detective-game";
import type { QuizGroup } from "@/lib/content/inaturalist";
import { cn } from "@/lib/utils";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-home-action";

/** What stands in for a group without enough photos yet (fireflies). */
function ComingSoon({ group }: { group: QuizGroup }) {
  return (
    <div className="rounded-2xl border border-dashed border-home-ink/25 p-6 text-center">
      <p className="text-lg font-bold text-home-ink">{group.label}: coming soon</p>
      <p className="mx-auto mt-2 max-w-[36ch] text-sm leading-relaxed text-home-muted">
        Nepal has too few confirmed {group.label.toLowerCase()} photos for a fair quiz yet. Our
        Junkiri project is mapping them with citizen scientists.
      </p>
      <Link
        href="/labs"
        className={cn(
          "mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-home-accent underline-offset-4 hover:underline",
          focusRing,
        )}
      >
        About Junkiri
        <ArrowUpRight aria-hidden className="size-3.5" />
      </Link>
    </div>
  );
}

function GroupQuiz({ group }: { group: QuizGroup; id?: string }) {
  if (!group.species) return <ComingSoon group={group} />;
  return <DetectiveGame key={group.id} group={group} />;
}

/**
 * Nature Detective: pick a group from photo tiles, then a level, and play; a back button returns
 * to the tiles.
 */
export function QuizPicker({ groups }: { groups: QuizGroup[] }) {
  const [active, setActive] = useState<string | null>(null);
  const group = groups.find((item) => item.id === active);

  if (group) {
    return (
      <div className="mx-auto max-w-lg">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={cn(
            "mb-4 inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-home-accent",
            focusRing,
          )}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Choose another group
        </button>
        <GroupQuiz group={group} id="quiz-pick-title" />
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {groups.map((item) => {
        const cover = item.species?.[0];
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setActive(item.id)}
              className={cn(
                "group/tile relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-xl bg-home-field text-left",
                focusRing,
              )}
            >
              {cover ? (
                <Image
                  src={cover.photo.src}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover/tile:scale-[1.03]"
                />
              ) : (
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,#07110c_0%,#16321f_100%)]"
                />
              )}
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.75)_100%)]"
              />
              <span className="absolute inset-x-0 bottom-0 p-3 text-white">
                <span className="block text-lg leading-tight font-bold">{item.label}</span>
                <span className="block text-xs opacity-90">
                  {item.species ? `${item.species.length} species to name` : "Coming soon"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
