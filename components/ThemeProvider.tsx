"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      {/* reducedMotion="user" deaktiviert framer-motion-Animationen für
          Nutzer mit prefers-reduced-motion. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemeProvider>
  );
}
