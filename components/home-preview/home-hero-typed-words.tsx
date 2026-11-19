"use client";

import { useEffect, useState } from "react";

/** Typing speed: per letter, and the pause at the end of each word. */
const LETTER_MS = 75;
const WORD_PAUSE_MS = 280;
const START_DELAY_MS = 300;
/** Once typed, the words rest this long, are erased quickly, and are typed again. */
const REST_MS = 4000;
const ERASE_MS = 30;
const RETYPE_DELAY_MS = 400;

/**
 * The hero's headline words, one per line. On phones and tablets they are typed out letter by
 * letter with a blinking cursor; 4 seconds after the last word is done they are erased quickly
 * (as if backspaced) and typed again, on repeat. Laptops show them still. Each word's full
 * width and height is held from the start (an invisible copy), so nothing moves while it
 * types. Decorative only: the heading's text for screen readers and search is the `sr-only`
 * title the parent renders. With reduced motion the words show at once and stay.
 */
export function HomeHeroTypedWords({ words }: { words: string[] }) {
  const total = words.reduce((sum, word) => sum + word.length, 0);
  const [typed, setTyped] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const show = window.setTimeout(() => {
        setTyped(total);
        setStill(true);
      }, 0);
      return () => window.clearTimeout(show);
    }
    // Where each word ends, counted in letters, to pause there.
    const ends = new Set(
      words.map((_, index) => words.slice(0, index + 1).reduce((sum, w) => sum + w.length, 0)),
    );
    let count = 0;
    let timer = 0;
    const type = () => {
      count += 1;
      setTyped(count);
      if (count < total)
        timer = window.setTimeout(type, ends.has(count) ? WORD_PAUSE_MS : LETTER_MS);
      else timer = window.setTimeout(erase, REST_MS);
    };
    const erase = () => {
      count -= 1;
      setTyped(count);
      if (count > 0) timer = window.setTimeout(erase, ERASE_MS);
      else timer = window.setTimeout(type, RETYPE_DELAY_MS);
    };
    timer = window.setTimeout(type, START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [words, total]);

  // Where each word starts, counted in letters.
  const starts = words.map((_, index) =>
    words.slice(0, index).reduce((sum, w) => sum + w.length, 0),
  );
  return (
    <>
      {words.map((word, index) => {
        const start = starts[index];
        const shown = Math.max(0, Math.min(word.length, typed - start));
        // The cursor sits on the word being typed or erased: the first when nothing is typed,
        // the last once it is all there.
        const typing =
          (typed > start && typed <= start + word.length) || (typed === 0 && start === 0);
        return (
          <span key={word} aria-hidden className="block">
            <span className="relative inline-block">
              {/* Holds the word's full size; the visible word on laptops. */}
              <span className="max-lg:invisible">{word}</span>
              {/* Phones and tablets: the typed part, over the held space, from its left edge. */}
              <span className="absolute top-0 left-0 whitespace-nowrap lg:hidden">
                {word.slice(0, shown)}
                {typing && !still ? (
                  <span className="ml-0.5 inline-block h-[0.85em] w-[0.08em] translate-y-[0.08em] animate-[hero-caret_1s_steps(1)_infinite] bg-home-accent align-baseline motion-reduce:hidden" />
                ) : null}
              </span>
            </span>
          </span>
        );
      })}
    </>
  );
}
