/** Auswahloptionen für Onboarding und Treffen-Erstellung. */

export const SPORTARTEN = [
  "Badminton",
  "Fußball",
  "Fitness/Gym",
  "Laufen",
  "Volleyball",
  "Basketball",
  "Tennis",
  "Bouldern",
  "Schwimmen",
  "Tischtennis",
] as const;

export const NIVEAUS = ["Anfänger", "Mittel", "Fortgeschritten"] as const;

export type Niveau = (typeof NIVEAUS)[number];
