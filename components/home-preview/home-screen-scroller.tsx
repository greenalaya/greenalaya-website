"use client";

import { useEffect } from "react";

/** How long one move from screen to screen takes, and its easing (slow, fast, slow). */
const DURATION_MS = 750;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/** A wheel or trackpad gesture ends when no wheel event has come for this long. */
const GESTURE_GAP_MS = 180;

const LAPTOP = "(min-width: 64rem)";

/**
 * Smooth screen-by-screen scrolling for pages built of one-screen sections (`.snap-start`,
 * see homeScreenClass), on laptops. One wheel or trackpad gesture glides to the next or the
 * previous screen; the keyboard (arrows, Page Up/Down, Space, Home, End) does the same, and a
 * scroll that ends between screens (the scrollbar dragged, say) settles on the nearest one.
 *
 * It replaces the browser's own snapping there (globals.css), which jumps rather than glides
 * and fights a fast wheel. A screen taller than the window (a very short window) scrolls
 * normally until its end. Phones scroll freely, with no snapping; with reduced motion the move is
 * instant. Renders nothing.
 */
export function HomeScreenScroller() {
  useEffect(() => {
    const laptop = window.matchMedia(LAPTOP);
    const root = document.documentElement;
    let cleanup: (() => void) | null = null;

    const start = () => {
      // The script does the snapping now; the browser's own would fight every frame.
      root.style.scrollSnapType = "none";

      let animating = false;
      let frame = 0;
      let lastWheelAt = 0;
      let movedThisGesture = false;

      /** Where each screen starts (under the fixed header), in page order. */
      const points = () => {
        const max = root.scrollHeight - window.innerHeight;
        const tops = [
          ...document.querySelectorAll<HTMLElement>("[data-snap-screens] .snap-start"),
        ].map((el) => {
          const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
          const top = el.getBoundingClientRect().top + window.scrollY - margin;
          return Math.min(max, Math.max(0, Math.round(top)));
        });
        return [...new Set(tops)].sort((a, b) => a - b);
      };

      const glideTo = (target: number) => {
        cancelAnimationFrame(frame);
        const from = window.scrollY;
        if (Math.abs(target - from) < 1) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          window.scrollTo({ top: target, behavior: "instant" });
          return;
        }
        animating = true;
        const began = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - began) / DURATION_MS);
          window.scrollTo({ top: from + (target - from) * ease(t), behavior: "instant" });
          if (t < 1) frame = requestAnimationFrame(step);
          else animating = false;
        };
        frame = requestAnimationFrame(step);
      };

      /**
       * The screen to move to, or null to let the page scroll normally (inside a screen taller
       * than the window, or past the last screen).
       */
      const targetFor = (direction: 1 | -1) => {
        const y = window.scrollY;
        const all = points();
        const next =
          direction === 1 ? all.find((p) => p > y + 2) : [...all].reverse().find((p) => p < y - 2);
        if (next === undefined) return null;
        // A tall screen: read it to its end before moving on.
        if (Math.abs(next - y) > window.innerHeight + 2) return null;
        return next;
      };

      const onWheel = (event: WheelEvent) => {
        if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return; // zoom, sideways
        const now = performance.now();
        if (now - lastWheelAt > GESTURE_GAP_MS) movedThisGesture = false;
        lastWheelAt = now;
        // Mid-glide, or the tail of a gesture that already moved: hold the page still.
        if (animating || movedThisGesture) {
          event.preventDefault();
          return;
        }
        const target = targetFor(event.deltaY > 0 ? 1 : -1);
        if (target === null) return;
        event.preventDefault();
        movedThisGesture = true;
        glideTo(target);
      };

      const onKey = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        const el = event.target as HTMLElement | null;
        if (el?.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']"))
          return;
        // Space presses a focused button or link; leave it to them.
        if (event.key === " " && el?.closest("button, a, [role='button']")) return;
        let target: number | null = null;
        if (event.key === "Home") target = 0;
        else if (event.key === "End") target = root.scrollHeight - window.innerHeight;
        else if (
          ["ArrowDown", "PageDown"].includes(event.key) ||
          (event.key === " " && !event.shiftKey)
        )
          target = targetFor(1);
        else if (["ArrowUp", "PageUp"].includes(event.key) || (event.key === " " && event.shiftKey))
          target = targetFor(-1);
        else return;
        if (target === null) return;
        event.preventDefault();
        glideTo(target);
      };

      // A scroll the script didn't make (the scrollbar, a link to a section) that stops between
      // screens settles on the nearest one.
      const onScrollEnd = () => {
        if (animating) return;
        const y = window.scrollY;
        const all = points();
        const nearest = all.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a), 0);
        const above = [...all].reverse().find((p) => p <= y) ?? 0;
        const below = all.find((p) => p > y);
        // Inside a tall screen, reading it: stay put.
        if (below !== undefined && below - above > window.innerHeight + 2) return;
        if (Math.abs(nearest - y) > 1) glideTo(nearest);
      };

      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("keydown", onKey);
      window.addEventListener("scrollend", onScrollEnd);
      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("scrollend", onScrollEnd);
        root.style.scrollSnapType = "";
      };
    };

    const sync = () => {
      cleanup?.();
      cleanup = null;
      if (laptop.matches) start();
    };
    sync();
    laptop.addEventListener("change", sync);
    return () => {
      laptop.removeEventListener("change", sync);
      cleanup?.();
    };
  }, []);

  return null;
}
