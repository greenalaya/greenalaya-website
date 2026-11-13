/**
 * Greenalaya Nepal Labs (/labs): the technology side of the organisation. All of the page's
 * wording lives here, so it can be edited without touching the layout.
 *
 * Every item carries an honest status: only Chinari and Junkiri are under way; the hazard
 * work is research, and early warning, pollution and climate-tech are plans. Change a status
 * here when the work moves on.
 */

/** Label colour: blue = being built, amber = running now, plain = research or planned. */
export type LabsStatusTone = "development" | "ongoing" | "research" | "planned";

export type LabsProject = {
  id: string;
  name: string;
  /** One line, in plain words. */
  summary: string;
  status: { label: string; tone: LabsStatusTone };
  /** Where to read more, when there is a page for it. */
  link?: { href: string; label: string; external?: boolean };
};

export const labsContent = {
  hero: {
    title: "Greenalaya Nepal Labs",
    description: "AI and data tools for Nepal's nature, built on Nepali data.",
    primary: { href: "#building", label: "See what we're building" },
  },

  /** How every Labs project works, in order. */
  approach: {
    title: "How we work",
    steps: ["AI does the first pass", "Nepali experts validate", "Records are shared openly"],
  },

  building: {
    title: "What We're Building",
    projects: [
      {
        id: "chinari",
        name: "Chinari",
        summary: "AI that identifies Nepal's animals from camera traps and photos.",
        status: { label: "In development", tone: "development" },
        link: { href: "/projects/chinari-ai-wildlife-classification", label: "About Chinari" },
      },
      {
        id: "junkiri",
        name: "Junkiri",
        summary: "Mapping the fireflies of the Himalayas with citizen scientists.",
        status: { label: "Ongoing", tone: "ongoing" },
      },
      {
        id: "hazard-monitoring",
        name: "AI for Hazard Monitoring",
        summary: "Research on watching glacial lakes, floods and fires with AI.",
        status: { label: "Research", tone: "research" },
        link: { href: "/blog/ai-environment-nepal", label: "Read our article" },
      },
      {
        id: "early-warning-climate-tech",
        name: "Early Warning, Pollution and Climate-Tech",
        summary: "Systems that warn early, and tools that cut pollution and heat.",
        status: { label: "Planned", tone: "planned" },
      },
    ] satisfies LabsProject[],
  },

  /** Chinari's pipeline, from a photograph to a trusted record. */
  chinari: {
    title: "How Chinari Works",
    logo: {
      src: "/images/projects/chinari-logo.png",
      darkSrc: "/images/projects/chinari-logo-dark.png",
      alt: "Chinari logo: a snow leopard drawn in front of mountain peaks",
    },
    steps: [
      { title: "Capture", description: "A camera trap or a phone takes the photo." },
      { title: "Detect", description: "AI finds the animal in each frame." },
      { title: "Classify", description: "AI suggests the species." },
      { title: "Validate", description: "Experts check the uncertain ones." },
      { title: "Record", description: "The confirmed sighting joins the shared record." },
    ],
    link: { href: "/projects/chinari-ai-wildlife-classification", label: "More about Chinari" },
  },
} as const;
