"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteLogo } from "@/components/site-logo";
import { SmoothHashLink } from "@/components/smooth-hash-link";
import { homePreviewPath, labsPath, primaryNavItems, siteConfig, type NavItem } from "@/lib/site";
import { cn, rafThrottle } from "@/lib/utils";

const MOBILE_MENU_ID = "mobile-primary-nav";

function isPathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return href === pathname || pathname.startsWith(`${href}/`);
}

/** A menu item is current on its own page, any page under it, and the pages in its drop-down. */
function isNavItemActive(pathname: string, item: NavItem) {
  return [item.href, ...(item.children ?? []).map((child) => child.href)].some((href) =>
    isPathActive(pathname, href),
  );
}

// The current page and hover get a pale green pill.
const navPillClass = (active: boolean) =>
  active
    ? "bg-[#4caf50]/15 dark:bg-[#4caf50]/20"
    : "hover:bg-[#4caf50]/10 dark:hover:bg-[#4caf50]/15";

// Menu links are bold, pure black in light theme and pure white in dark theme. Slightly tighter
// on narrow laptops, so the row with its drop-down arrows still fits beside the logo.
const navTextClass = "text-sm font-bold text-black no-underline transition-colors dark:text-white";

const navLinkClass = (active: boolean) =>
  cn("rounded-full px-3 py-2 xl:px-4", navTextClass, navPillClass(active));

// A link in a drop-down.
const dropdownLinkClass = (active: boolean) =>
  cn(
    "flex min-h-10 items-center rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap text-black no-underline transition-colors dark:text-white",
    navPillClass(active),
  );

const mobileNavLinkClass = (active: boolean) =>
  cn(
    "flex min-h-11 items-center rounded-lg px-4 py-3 text-base font-bold text-black no-underline transition-colors dark:text-white",
    navPillClass(active),
  );

// The pages in a group on the phone menu, indented under its name.
const mobileSubLinkClass = (active: boolean) =>
  cn(
    "flex min-h-11 items-center rounded-lg px-4 py-2.5 text-[15px] font-semibold text-black no-underline transition-colors dark:text-white",
    navPillClass(active),
  );

/** Round icon buttons in the header and mobile menu (theme toggle, menu open/close). */
const iconButtonClass =
  "border border-black/10 bg-black/[0.04] text-[#1a221d] hover:bg-black/[0.08] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  /** The open drop-down on laptops (its item's href), if any. */
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const checkScrolled = () => setScrolled(window.scrollY > 50);
    const onScroll = rafThrottle(checkScrolled);
    checkScrolled();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
    setOpenDropdown(null);
  }

  // An open drop-down closes on Escape (back to its arrow button) and on a click elsewhere.
  useEffect(() => {
    if (!openDropdown) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      desktopNavRef.current
        ?.querySelector<HTMLButtonElement>(`[data-dropdown-button="${openDropdown}"]`)
        ?.focus();
      setOpenDropdown(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a[href]");
    firstLink?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Pages with their own "Get Involved" band jump to it; every other page goes to the homepage's.
  const ctaHref = ["/", homePreviewPath, labsPath, "/about", "/about-copy"].includes(pathname)
    ? "#get-involved"
    : "/#get-involved";

  return (
    <>
      <header
        data-site-header
        className={cn(
          "fixed top-0 right-0 left-0 z-[100] flex items-center justify-between border-b border-[#2e7d32]/15 bg-white/90 px-4 py-4 backdrop-blur-xl transition-all duration-300 sm:px-5 md:px-10 dark:border-[#2e7d32]/20 dark:bg-black/90",
          scrolled && "bg-white/95 py-3.5 shadow-sm dark:bg-black/95 dark:shadow-none",
        )}
      >
        <Link href="/" className="flex min-w-0 items-center gap-2 no-underline">
          <SiteLogo
            surface="default"
            decorative
            preload
            className="h-10 w-auto shrink-0 object-contain"
          />
          <span className="min-w-0 translate-y-1 truncate text-lg font-semibold text-[#2e7d32] sm:text-xl dark:text-[#66bb6a]">
            {siteConfig.name}
          </span>
        </Link>

        {/* From laptop width: on tablets the full row crowds the "Get Involved" button, so they
            use the menu button, like phones. */}
        <nav
          ref={desktopNavRef}
          className="hidden items-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Primary"
        >
          {primaryNavItems.map((item) => {
            const active = isNavItemActive(pathname, item);
            if (!item.children) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={navLinkClass(active)}
                >
                  {item.label}
                </Link>
              );
            }

            // The name opens its page; the arrow beside it, or hovering, opens the drop-down.
            const open = openDropdown === item.href;
            const dropdownId = `nav-dropdown-${item.label.toLowerCase()}`;
            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.href)}
                onMouseLeave={() => setOpenDropdown(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setOpenDropdown((current) => (current === item.href ? null : current));
                  }
                }}
              >
                <div
                  className={cn(
                    "flex items-center rounded-full transition-colors",
                    navPillClass(active || open),
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn("rounded-full py-2 pr-0.5 pl-3 xl:pl-4", navTextClass)}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    data-dropdown-button={item.href}
                    aria-expanded={open}
                    aria-controls={open ? dropdownId : undefined}
                    aria-label={`${item.label} pages`}
                    onClick={() => setOpenDropdown(open ? null : item.href)}
                    className="mr-1 inline-flex size-7 items-center justify-center rounded-full text-black dark:text-white"
                  >
                    <ChevronDown
                      aria-hidden
                      className={cn(
                        "size-4 transition-transform duration-200",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                </div>
                {open ? (
                  // The top padding bridges the gap to the list, so moving the pointer down to it
                  // keeps it open.
                  <div className="absolute top-full left-0 pt-2">
                    <ul
                      id={dropdownId}
                      className="min-w-52 rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_12px_32px_rgb(0_0_0/0.12)] dark:border-white/15 dark:bg-[#0d120f] dark:shadow-[0_12px_32px_rgb(0_0_0/0.6)]"
                    >
                      {item.children.map((child) => {
                        const childActive = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <SmoothHashLink
                              href={child.href}
                              aria-current={childActive ? "page" : undefined}
                              className={dropdownLinkClass(childActive)}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                            </SmoothHashLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle
            className={cn(
              iconButtonClass,
              "focus-visible:ring-[#2e7d32] focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[state=on]:bg-black/[0.08] dark:focus-visible:ring-[#8bd88f] dark:focus-visible:ring-offset-black dark:data-[state=on]:bg-white/15 dark:data-[state=on]:hover:bg-white/20",
            )}
          />
          <Link
            href={ctaHref}
            className="hidden rounded-full bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] px-4 py-2 text-xs font-medium whitespace-nowrap text-white no-underline transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(76,175,80,0.4)] sm:inline-flex sm:min-h-11 sm:items-center sm:px-6 sm:py-2.5 sm:text-sm"
          >
            Get Involved
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full transition lg:hidden",
              iconButtonClass,
            )}
            aria-expanded={menuOpen}
            // The menu panel only exists while open, so only point at it then.
            aria-controls={menuOpen ? MOBILE_MENU_ID : undefined}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[110] lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            ref={panelRef}
            id={MOBILE_MENU_ID}
            data-site-header
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute top-0 right-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-[#2e7d32]/15 bg-white shadow-2xl dark:border-[#2e7d32]/25 dark:bg-black"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <p id={titleId} className="text-lg font-semibold text-[#2e7d32]">
                Menu
              </p>
              <button
                type="button"
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full transition",
                  iconButtonClass,
                )}
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4"
              aria-label="Primary mobile"
            >
              {primaryNavItems.map((item) => {
                if (!item.children) {
                  const active = isPathActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={mobileNavLinkClass(active)}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  );
                }
                // A group: its name, with its pages (the first is the main page) under it.
                const groupId = `mobile-nav-${item.label.toLowerCase()}`;
                return (
                  <div key={item.href} role="group" aria-labelledby={groupId} className="mt-2">
                    <p
                      id={groupId}
                      className="px-4 pt-1 pb-1 text-xs font-bold tracking-wider text-[#2e7d32] uppercase dark:text-[#8bd88f]"
                    >
                      {item.label}
                    </p>
                    <ul className="ml-4 border-l border-black/10 pl-2 dark:border-white/15">
                      {item.children.map((child) => {
                        const active = pathname === child.href;
                        return (
                          <li key={child.href}>
                            <SmoothHashLink
                              href={child.href}
                              aria-current={active ? "page" : undefined}
                              className={mobileSubLinkClass(active)}
                              onClick={closeMenu}
                            >
                              {child.label}
                            </SmoothHashLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </nav>
            <div className="border-t border-black/10 p-4 dark:border-white/10">
              <Link
                href={ctaHref}
                className="flex min-h-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2e7d32] to-[#1b5e20] px-6 py-3 text-sm font-medium text-white no-underline transition-all hover:shadow-[0_8px_24px_rgba(76,175,80,0.4)]"
                onClick={closeMenu}
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
