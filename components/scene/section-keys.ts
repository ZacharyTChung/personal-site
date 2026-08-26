/** Each interactive object in the clearing maps to one section, shown in a panel. */
export type SectionKey =
  | "about"
  | "experience"
  | "stack"
  | "projects"
  | "awards"
  | "interests"
  | "music"
  | "ironman"
  | "contact";

/** Short label shown in the nav. */
export const SECTION_LABELS: Record<SectionKey, string> = {
  about: "About",
  experience: "Experience",
  stack: "Stack",
  projects: "Projects",
  awards: "Awards",
  interests: "Interests",
  music: "Focus",
  ironman: "Goals",
  contact: "Contact",
};

/** Order of the links in the top nav. */
export const NAV_ORDER: SectionKey[] = [
  "about",
  "experience",
  "stack",
  "projects",
  "awards",
  "interests",
  "music",
  "ironman",
  "contact",
];

/** True when a URL hash names one of the section panels. */
export function isSectionKey(value: string): value is SectionKey {
  return (NAV_ORDER as string[]).includes(value);
}
