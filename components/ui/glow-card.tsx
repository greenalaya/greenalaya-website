"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type GlowCardColor = "blue" | "purple" | "green" | "red" | "orange";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: GlowCardColor;
  size?: "sm" | "md" | "lg";
  width?: string | number;
  height?: string | number;
  customSize?: boolean;
  /** Glass fill opacity (0–1). Default 0.12 */
  backdropOpacity?: number;
  /** Glass panel tint behind the glow. Default grey */
  glassTone?: "grey" | "black";
  /** Use a static glass card below lg; glow effects from lg upward. */
  staticBelowLg?: boolean;
  /**
   * Use the homepage redesign surface tokens (light card in light mode, dark in dark mode)
   * instead of the dark glass. The pointer-following glow is unchanged.
   */
  themed?: boolean;
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
};

const sizeMap = {
  sm: "w-48 h-64",
  md: "w-64 h-80",
  lg: "w-80 h-96",
};

const glowElements = new Set<HTMLElement>();
let glowRafId: number | null = null;
let pendingPointerEvent: PointerEvent | null = null;

function applyGlowPointer(e: PointerEvent) {
  const { clientX: x, clientY: y } = e;
  const xp = (x / window.innerWidth).toFixed(2);
  const yp = (y / window.innerHeight).toFixed(2);
  const xStr = x.toFixed(2);
  const yStr = y.toFixed(2);

  glowElements.forEach((el) => {
    el.style.setProperty("--x", xStr);
    el.style.setProperty("--xp", xp);
    el.style.setProperty("--y", yStr);
    el.style.setProperty("--yp", yp);
  });
}

function syncGlowPointer(e: PointerEvent) {
  pendingPointerEvent = e;
  if (glowRafId !== null) return;

  glowRafId = requestAnimationFrame(() => {
    glowRafId = null;
    if (pendingPointerEvent) applyGlowPointer(pendingPointerEvent);
  });
}

function subscribeGlowPointer(el: HTMLElement) {
  if (glowElements.size === 0) {
    document.addEventListener("pointermove", syncGlowPointer);
  }
  glowElements.add(el);
}

function unsubscribeGlowPointer(el: HTMLElement) {
  glowElements.delete(el);
  if (glowElements.size === 0) {
    document.removeEventListener("pointermove", syncGlowPointer);
    if (glowRafId !== null) {
      cancelAnimationFrame(glowRafId);
      glowRafId = null;
    }
  }
}

function GlowCard({
  children,
  className = "",
  glowColor = "green",
  size = "md",
  width,
  height,
  customSize = false,
  backdropOpacity = 0.12,
  glassTone = "grey",
  staticBelowLg = false,
  themed = false,
}: GlowCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  // SSR-safe initial value: the real viewport-based value (matchMedia) is only
  // knowable on the client, so it's applied in the effect below after mount —
  // reading it here would make the server and first client render diverge and
  // trigger a hydration mismatch whenever staticBelowLg is true.
  const [glowActive, setGlowActive] = useState(() => !staticBelowLg);

  useEffect(() => {
    if (!staticBelowLg) return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateGlow = () => setGlowActive(mediaQuery.matches);

    updateGlow();
    mediaQuery.addEventListener("change", updateGlow);
    return () => mediaQuery.removeEventListener("change", updateGlow);
  }, [staticBelowLg]);

  useEffect(() => {
    if (!glowActive) return;
    const el = rootRef.current;
    if (!el) return;

    subscribeGlowPointer(el);
    return () => unsubscribeGlowPointer(el);
  }, [glowActive]);

  const { base, spread } = glowColorMap[glowColor];
  const isStatic = staticBelowLg && !glowActive;

  const getSizeClasses = () => {
    if (customSize) {
      return "";
    }
    return sizeMap[size];
  };

  const glassLightness = glassTone === "black" ? 0 : 60;
  const backdrop = themed
    ? "var(--home-surface)"
    : `hsl(0 0% ${glassLightness}% / ${backdropOpacity})`;

  const getStaticStyles = (): CSSProperties => {
    const styles: CSSProperties = {
      backgroundColor: backdrop,
      border: themed
        ? "1px solid color-mix(in srgb, var(--home-accent) 25%, transparent)"
        : "1px solid hsl(0 0% 100% / 0.15)",
      position: "relative",
    };

    if (width !== undefined) {
      styles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      styles.height = typeof height === "number" ? `${height}px` : height;
    }

    return styles;
  };

  const getInlineStyles = (): CSSProperties & Record<string, string | number> => {
    const baseStyles: CSSProperties & Record<string, string | number> = {
      "--base": base,
      // Themed cards stay within brand greens instead of sweeping towards blue and purple.
      "--spread": themed ? 30 : spread,
      "--radius": "14",
      "--border": "3",
      "--backdrop": backdrop,
      "--backup-border": themed
        ? "color-mix(in srgb, var(--home-accent) 25%, transparent)"
        : "var(--backdrop)",
      "--size": "200",
      "--outer": "1",
      "--border-size": "calc(var(--border, 2) * 1px)",
      "--spotlight-size": "calc(var(--size, 150) * 1px)",
      "--hue": "calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))",
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: "var(--backdrop, transparent)",
      backgroundSize: "calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))",
      backgroundPosition: "50% 50%",
      backgroundAttachment: "fixed",
      border: "var(--border-size) solid var(--backup-border)",
      position: "relative",
      touchAction: "none",
    };

    if (width !== undefined) {
      baseStyles.width = typeof width === "number" ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === "number" ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <div
      ref={rootRef}
      {...(isStatic ? {} : { "data-glow": true })}
      {...(themed ? { "data-glow-themed": true } : {})}
      style={isStatic ? getStaticStyles() : getInlineStyles()}
      className={`
          ${getSizeClasses()}
          ${!customSize ? "aspect-[3/4]" : ""}
          rounded-2xl
          relative
          ${
            themed
              ? "shadow-[0_10px_30px_-12px_rgba(13,55,22,0.25)] dark:shadow-[0_1rem_2rem_-1rem_black]"
              : isStatic
                ? "shadow-lg backdrop-blur-md"
                : "shadow-[0_1rem_2rem_-1rem_black] backdrop-blur-[5px]"
          }
          ${isStatic ? "touch-auto" : "touch-none"}
          p-4
          ${className}
        `}
    >
      {!isStatic ? <div data-glow aria-hidden /> : null}
      {children}
    </div>
  );
}

export { GlowCard };
