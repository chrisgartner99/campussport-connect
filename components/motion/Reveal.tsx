"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT_QUART: [number, number, number, number] = [0.25, 1, 0.5, 1];

/**
 * Dezentes Einblenden (fade + slight slide-up) beim Sichtbarwerden.
 * Kurz und einmalig; bei prefers-reduced-motion via MotionConfig deaktiviert.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, ease: EASE_OUT_QUART, delay }}
    >
      {children}
    </motion.div>
  );
}
