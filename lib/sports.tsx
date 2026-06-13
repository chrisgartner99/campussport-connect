import { createElement } from "react";
import {
  Activity,
  CircleDot,
  Disc2,
  Dumbbell,
  Feather,
  Footprints,
  Goal,
  Mountain,
  Target,
  Volleyball,
  Waves,
  type LucideIcon,
} from "lucide-react";

/** Zentrale Zuordnung Sportart → Icon. Fallback: Activity. */
export const SPORT_ICONS: Record<string, LucideIcon> = {
  Badminton: Feather,
  Fußball: Goal,
  "Fitness/Gym": Dumbbell,
  Laufen: Footprints,
  Volleyball: Volleyball,
  Basketball: CircleDot,
  Tennis: Target,
  Bouldern: Mountain,
  Schwimmen: Waves,
  Tischtennis: Disc2,
};

export function sportIcon(sportart: string): LucideIcon {
  return SPORT_ICONS[sportart] ?? Activity;
}

/** Farbcodierung je Sportart (Tailwind-Klassen bg/text, AA-konform). */
const SPORT_TONES = [
  "bg-brand-soft text-on-brand-soft",
  "bg-blue-soft text-on-blue-soft",
  "bg-warning-soft text-on-warning-soft",
  "bg-success-soft text-on-success-soft",
  "bg-danger-soft text-on-danger-soft",
];

export function sportTone(sportart: string): string {
  let hash = 0;
  for (let i = 0; i < sportart.length; i++) {
    hash = (hash + sportart.charCodeAt(i)) % SPORT_TONES.length;
  }
  return SPORT_TONES[hash];
}

/** Icon zu einer Sportart, einheitlich eingebunden. */
export function SportIcon({
  sportart,
  className,
  size = 16,
}: {
  sportart: string;
  className?: string;
  size?: number;
}) {
  // createElement statt <Icon/>, damit der Lookup nicht als "Komponente
  // im Render erzeugt" gewertet wird.
  return createElement(sportIcon(sportart), {
    size,
    className,
    "aria-hidden": true,
  });
}
