"use client";

import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { SiteLogo } from "@/components/site-logo";
import { SocialLinks } from "@/components/social-links";
import {
  footerAboutLinks,
  footerMediaLinks,
  footerWorkLinks,
  siteConfig,
  siteContact,
} from "@/lib/site";
import { cn } from "@/lib/utils";

/** One line in the footer; the full description stays in the page metadata. */
const footerTagline = "Technology and research for nature conservation in Nepal.";

const footerTextClass = "text-black dark:text-white";

const footerLinkClass = cn(footerTextClass, "transition hover:opacity-70");

const footerColumns = [
  { title: "About", links: footerAboutLinks },
  { title: "Our Work", links: footerWorkLinks },
  { title: "Media", links: footerMediaLinks },
] as const;

const contactInfo = [
  { icon: Mail, text: siteContact.email, href: `mailto:${siteContact.email}` },
  {
    icon: Phone,
    text: siteContact.phone,
    href: `tel:${siteContact.phone.replace(/[^+\d]/g, "")}`,
  },
  { icon: MapPin, text: siteContact.location },
] as const;

function FooterLinkList({
  links,
  className,
}: {
  links: ReadonlyArray<{ text: string; href: string }>;
  className?: string;
}) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.text}>
          <Link href={link.href} className={footerLinkClass}>
            {link.text}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterContactList({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {contactInfo.map((item) => {
        const Icon = item.icon;
        const content = (
          <>
            <Icon aria-hidden className="size-4 shrink-0 text-primary" />
            <span className="min-w-0 break-words">{item.text}</span>
          </>
        );
        return (
          <li key={item.text}>
            {"href" in item ? (
              <a href={item.href} className={cn("flex items-center gap-2", footerLinkClass)}>
                {content}
              </a>
            ) : (
              <address className={cn("flex items-center gap-2 not-italic", footerTextClass)}>
                {content}
              </address>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function FooterAccordionSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-black/10 dark:border-white/10">
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between gap-4 py-3 text-left"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="text-base font-semibold text-black dark:text-white">{title}</span>
        <ChevronDown
          aria-hidden
          className={cn(
            "size-5 shrink-0 text-black/70 transition-transform duration-200 dark:text-white/70",
            open && "rotate-180",
          )}
        />
      </button>
      {/* Always rendered (hidden when closed) so the button's aria-controls points at a real panel. */}
      <div id={panelId} hidden={!open} className="pb-4">
        {children}
      </div>
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  // Publishes the footer's height as --site-footer-h, so the closing "Stay ahead" band can size
  // itself to share one laptop screen with the footer.
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer || typeof ResizeObserver === "undefined") return;
    const root = document.documentElement;
    const update = () => root.style.setProperty("--site-footer-h", `${footer.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(footer);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--site-footer-h");
    };
  }, []);

  // One footer on every page: the same column, background and spacing everywhere.
  const container = "max-w-[1200px] px-5 sm:px-8";

  return (
    <footer
      ref={footerRef}
      className={cn(
        // In dark mode the closing band and the footer share a black ground; a hairline
        // keeps them apart now that the footer's top padding is tight.
        "w-full place-self-end bg-secondary dark:border-t dark:border-white/10 dark:bg-black",
      )}
    >
      <div className={cn("mx-auto pt-8 pb-4 lg:pt-10 lg:pb-8", container)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Link href="/" className="flex items-center gap-2 no-underline">
              <SiteLogo surface="default" decorative className="h-9 w-auto object-contain" />
              <span className="text-[22px] font-semibold leading-none text-primary">
                {siteConfig.name}
              </span>
            </Link>

            <p className={cn("mt-3 max-w-xs text-[15px] leading-relaxed", footerTextClass)}>
              {footerTagline}
            </p>

            <SocialLinks
              className="mt-4 flex gap-7"
              iconClassName="size-6 text-primary transition hover:text-primary/80"
              largeTapArea
            />
          </div>

          <nav
            aria-label="Footer"
            className="hidden lg:col-span-2 lg:flex lg:items-start lg:justify-between lg:gap-x-8"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="mb-3 text-base font-semibold text-black dark:text-white">
                  {column.title}
                </p>
                <FooterLinkList links={column.links} className="space-y-2 text-[15px]" />
              </div>
            ))}
            <div className="shrink-0">
              <p className="mb-3 text-base font-semibold text-black dark:text-white">Contact</p>
              <FooterContactList className="space-y-2 text-[15px]" />
            </div>
          </nav>

          <nav className="lg:hidden" aria-label="Footer">
            {footerColumns.map((column) => (
              <FooterAccordionSection key={column.title} title={column.title}>
                <FooterLinkList links={column.links} className="space-y-3 text-[15px]" />
              </FooterAccordionSection>
            ))}
            <FooterAccordionSection title="Contact">
              <FooterContactList className="space-y-3 text-[15px]" />
            </FooterAccordionSection>
          </nav>
        </div>
      </div>

      <div className="border-t border-black/10 dark:border-white/10 dark:bg-black">
        {/* Prerendered pages carry the build year; the browser renders the current one. */}
        <p
          className={cn(
            "mx-auto py-3.5 text-center text-sm sm:text-left",
            container,
            footerTextClass,
          )}
          suppressHydrationWarning
        >
          &copy; {year} {siteConfig.name}
          <span aria-hidden className="mx-2">
            &middot;
          </span>
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}
