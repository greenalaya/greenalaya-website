"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

/**
 * A link to a section ("#advisors", or "/about#advisors") that always glides there when that
 * section is on the current page, even when the computer is set to reduce motion (Windows turns
 * that on with "Animation effects" off), where the page-wide smooth scrolling would otherwise jump.
 * From another page it navigates as usual. The address still updates, so the section can be shared.
 */
export function SmoothHashLink({
  href,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const url = new URL(href, window.location.href);
    if (!url.hash || url.pathname !== window.location.pathname) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    window.history.pushState(window.history.state, "", url.hash);
    // After this frame, so a menu closing on the same click has unlocked the page's scrolling.
    requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
