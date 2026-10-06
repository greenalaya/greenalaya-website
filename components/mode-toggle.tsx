"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@teispace/next-themes";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

function useIsClient() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function ModeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useIsClient();
  const toggleClass = cn(
    "group size-9 cursor-pointer bg-secondary data-[state=on]:bg-transparent data-[state=on]:hover:bg-muted dark:bg-secondary",
    className,
  );

  // The theme is only known in the browser; reserve the button's space
  // during server render so the header doesn't shift on load.
  if (!isClient) return <span aria-hidden className={cn("inline-block rounded-md", toggleClass)} />;

  // resolvedTheme reflects the OS setting when the theme is "system".
  const isDark = resolvedTheme === "dark";

  return (
    <Toggle
      className={toggleClass}
      pressed={isDark}
      onPressedChange={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Moon
        size={16}
        className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
        aria-hidden="true"
      />
      <Sun
        size={16}
        className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
        aria-hidden="true"
      />
    </Toggle>
  );
}
