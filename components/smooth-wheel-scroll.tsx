"use client";

import { useEffect } from "react";

/**
 * How quickly the page catches up with the wheel: each frame it covers this share of the
 * remaining distance per 16ms, so one notch glides for about half a second and slows as it
 * arrives. Lower is softer.
 */
const CATCH_UP = 0.12;

/** Whether an element inside the page scrolls on its own in this direction (a list, say). */
function scrollsItself(start: EventTarget | null, deltaY: number) {
  for (let el = start as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
    if (el.dataset?.nativeScroll !== undefined) return true;
    const { overflowY } = getComputedStyle(el);
    if (overflowY !== "auto" && overflowY !== "scroll") continue;
    if (deltaY > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Smooth, natural scrolling with a mouse wheel: instead of jumping about 100px a notch, the
 * page glides there and eases to a stop, and further notches add to the glide. Scrolling stays
 * free (no snapping). Trackpads and touch screens keep their own scrolling, which already
 * glides; so do the keyboard, the scrollbar, links to a section, zooming with Ctrl, sideways
 * scrolling and anything inside the page that scrolls on its own (or carries
 * `data-native-scroll`). Off with reduced motion, and while a menu or preview has locked the
 * page. On every page (in the root layout). Renders nothing.
 */
export function SmoothWheelScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let lastTime = 0;

    const maxScroll = () => root.scrollHeight - window.innerHeight;

    const step = (time: number) => {
      // Something else moved the page mid-glide (a link, the keyboard, the scrollbar): let it.
      if (Math.abs(window.scrollY - Math.round(current)) > 2) {
        frame = 0;
        return;
      }
      const dt = lastTime ? Math.min(time - lastTime, 64) : 16;
      lastTime = time;
      current += (target - current) * (1 - (1 - CATCH_UP) ** (dt / 16));
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo({ top: current, behavior: "instant" });
      frame = current === target ? 0 : requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.shiftKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      // A mouse wheel scrolls in lines, or in whole steps of 50px or more; a trackpad sends a
      // stream of small, uneven steps and glides by itself.
      const lines = event.deltaMode === 1;
      const notch =
        event.deltaMode === 0 && Math.abs(event.deltaY) >= 50 && Number.isInteger(event.deltaY);
      if (!lines && !notch) return;
      if (scrollsItself(event.target, event.deltaY)) return;
      // A menu or preview is open and has locked the page behind it.
      if (document.body.style.overflow === "hidden") return;

      event.preventDefault();
      const delta = lines ? event.deltaY * 40 : event.deltaY;
      // Start from where the page is now unless a glide is under way.
      if (!frame) {
        target = window.scrollY;
        current = window.scrollY;
        lastTime = 0;
      }
      target = Math.max(0, Math.min(maxScroll(), target + delta));
      if (!frame) frame = requestAnimationFrame(step);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
