"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "@teispace/next-themes";
import { MotionConfig } from "framer-motion";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {/* Honour the OS "reduce motion" setting for every framer-motion animation. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  );
}
