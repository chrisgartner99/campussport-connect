"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/** Sonne/Mond-Umschalter. Vermeidet Hydration-Mismatch über mounted-Flag. */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // next-themes-Standard: erst nach dem Mounten das echte Theme-Icon zeigen,
  // um Hydration-Mismatches zu vermeiden.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Zu hellem Modus wechseln" : "Zu dunklem Modus wechseln"}
      title={isDark ? "Heller Modus" : "Dunkler Modus"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors hover:bg-surface-2 hover:text-ink"
    >
      {/* Vor dem Mounten neutrales Icon, um Flackern zu vermeiden. */}
      {mounted && isDark ? (
        // Sonne
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        // Mond
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
