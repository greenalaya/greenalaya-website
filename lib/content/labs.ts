/**
 * Greenalaya Nepal Labs (/labs): the research, data and AI side of the organisation. All of the
 * page's wording lives here, so it can be edited without touching the layout.
 *
 * Every item carries an honest status: Chinari is in development, Junkiri is under way (the
 * pilot for local-level data collection), and the GLOF and pollution work is at concept stage.
 * Change a status here when the work moves on.
 */
import { contactHref } from "@/lib/site";

/** Label colour: blue = being built, amber = running now, plain = concept or planned. */
export type LabsStatusTone = "development" | "ongoing" | "research" | "planned";

export type LabsStatus = { label: string; tone: LabsStatusTone };

export const labsContent = {
  hero: {
    eyebrow: "Greenalaya's Environmental AI Labs",
    title: "Building Nepal's foundational data and AI for climate and biodiversity",
    description:
      "We are not a commercial testing lab. We are an applied research and data initiative, turning local environmental observations into trusted data and AI models for Nepal.",
    primary: { href: contactHref("partner"), label: "Partner with us" },
    secondary: { href: "/projects/chinari-ai-wildlife-classification", label: "About Chinari" },
    image: {
      src: "/images/news/big-butterfly-count-2026-godawari/group-forest-observation.jpg",
      alt: "Volunteers recording butterflies in the forest during the Big Butterfly Count",
      caption: "Field Data Collection: Big Butterfly Count Nepal 2026",
    },
  },

  /** Why the work starts with local data, and the three steps every project follows. */
  approach: {
    title: "Good AI starts with good local data",
    body: [
      "Global AI models often fail in the Himalayas. The terrain is complex, and the ground-truth data they need from Nepal is missing or scattered.",
      "So we start on the ground: high-resolution observations collected with local communities and at field sites, checked by experts, then used to train AI that understands Nepal.",
    ],
    steps: [
      {
        title: "Collect locally",
        description: "Field surveys, camera traps and citizen science, with local communities.",
      },
      {
        title: "Standardise and check",
        description: "Cleaning, structuring and expert validation, so the data can be trusted.",
      },
      {
        title: "Model and act",
        description: "AI that turns the data into insight for conservation and disaster risk.",
      },
    ],
  },

  /** The flagship: Chinari, as described on its project page. */
  chinari: {
    title: "Chinari: AI that identifies Nepal's animals",
    status: { label: "In development", tone: "development" } satisfies LabsStatus,
    summary:
      "An AI platform for the automated detection, tracking and species-level identification of Nepal's animals, both vertebrates and invertebrates, from camera-trap imagery, ranger field reports and citizen-submitted photos. High-confidence observations are processed automatically; uncertain ones go to an expert. It is offered to conservation organisations, researchers, government agencies and approved partners through secure APIs and web applications.",
    logo: {
      src: "/images/projects/chinari-logo-mark.png",
      darkSrc: "/images/projects/chinari-logo-mark-dark.png",
      alt: "Chinari logo: a snow leopard drawn in front of mountain peaks",
    },
    steps: [
      { title: "Capture", description: "A camera trap or a phone takes the photo." },
      { title: "Detect", description: "AI finds the animal in each frame." },
      { title: "Classify", description: "AI suggests the species." },
      { title: "Validate", description: "Experts check the uncertain ones." },
      { title: "Record", description: "The confirmed sighting joins the shared record." },
    ],
  },

  /** The research pillars, each with its status. */
  pillars: {
    title: "Our research pillars",
    items: [
      {
        id: "junkiri",
        name: "Junkiri: local-level data, starting with fireflies",
        status: { label: "Pilot, ongoing", tone: "ongoing" },
        summary:
          "Junkiri is finding out which species of firefly live in Nepal, starting in Pokhara Valley. It is our pilot for local-level data collection: testing how local contributors can record standardised observations that are good enough to train AI.",
      },
      {
        id: "glof",
        name: "AI for glacial lake outburst floods (GLOF)",
        status: { label: "Concept", tone: "planned" },
        summary:
          "We plan to combine satellite imagery, weather records and local river data to watch glacial lakes grow and model early-warning scenarios.",
      },
      {
        id: "pollution",
        name: "AI for pollution detection and monitoring",
        status: { label: "Concept", tone: "planned" },
        summary:
          "We plan to build machine-learning models that track pollution trends, using low-cost sensors and remote sensing.",
      },
    ] satisfies { id: string; name: string; status: LabsStatus; summary: string }[],
  },
} as const;
