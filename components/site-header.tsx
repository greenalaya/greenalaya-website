"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { SiteLogo } from "@/components/site-logo";
import { homePreviewPath, labsPath, primaryNavItems, siteConfig } from "@/lib/site";
import { cn, rafThrottle } from "@/lib/utils";

const MOBILE_MENU_ID = "mobile-primary-nav";

function isNavItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return href === pathname || pathname.startsWith(`${href}/`);
}

// Menu links are bold, pure black in light theme and pure white in dark theme; the current
// page and hover get a pale green pill.
const navLinkClass = (active: boolean) =>
  cn(
    "rounded-full px-4 py-2 text-sm font-bold text-black no-underline transition-colors dark:text-white",
    active
      ? "bg-[#4caf50]/15 dark:bg-[#4caf50]/20"
      : "hover:bg-[#4caf50]/10 dark:hover:bg-[#4caf50]/15",
  );

const mobileNavLinkClass = (active: boolean) =>
  cn(
    "flex min-h-11 items-center rounded-lg px-4 py-3 text-base font-bold text-black no-underline transition-colors dark:text-white",
    active
      ? "bg-[#4caf50]/15 dark:bg-[#4caf50]/20"
      : "hover:bg-[#4caf50]/10 dark:hover:bg-[#4caf50]/15",
  );

/** Round icon buttons in the header and mobile menu (theme toggle, menu open/close). */
const iconButtonClass =
  "border border-black/10 bg-black/[0.04] text-[#1a221d] hover:bg-black/[0.08] dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
  }

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
  const ctaHref = ["/", homePreviewPath, labsPath, "/about"].includes(pathname)
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
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.href);
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
                const active = isNavItemActive(pathname, item.href);
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
