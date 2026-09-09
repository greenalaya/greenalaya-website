import type { Metadata } from "next";

const faviconVersion = "10";

/** Static favicon set in /public — kept small for sub-100ms loads on every route. */
export const siteIcons: NonNullable<Metadata["icons"]> = {
  icon: [
    // List 48×48 PNG first — Google’s preferred explicit size; /favicon.ico remains the default fetch path.
    { url: `/favicon-48x48.png?v=${faviconVersion}`, sizes: "48x48", type: "image/png" },
    { url: `/favicon.png?v=${faviconVersion}`, sizes: "512x512", type: "image/png" },
    { url: `/favicon.ico?v=${faviconVersion}`, sizes: "any", type: "image/x-icon" },
    { url: `/icon-192.png?v=${faviconVersion}`, sizes: "192x192", type: "image/png" },
    { url: `/icon-512.png?v=${faviconVersion}`, sizes: "512x512", type: "image/png" },
    { url: `/favicon-32x32.png?v=${faviconVersion}`, sizes: "32x32", type: "image/png" },
    { url: `/favicon-16x16.png?v=${faviconVersion}`, sizes: "16x16", type: "image/png" },
  ],
  apple: [
    { url: `/apple-touch-icon.png?v=${faviconVersion}`, sizes: "180x180", type: "image/png" },
  ],
};

export const siteConfig = {
  name: "Greenalaya Nepal",
  url: "https://greenalayanepal.org.np",
  tagline: "Technology & Research for Nature",
  description:
    "Technology and research for nature conservation in Nepal - data-driven tools and evidence-based solutions for resilient ecosystems.",
  ogImage: "/og-image.png",
  social: {
    facebook: "https://www.facebook.com/greenalayanepal/",
    instagram: "https://www.instagram.com/greenalayanepal/",
    linkedin: "https://www.linkedin.com/company/greenalaya-nepal/",
  },
  images: {
    aboutBackground: "/images/about-rings.png",
    communityHero: "/images/community-group.png",
    foundationBackground: "/images/foundation-background.png",
    thematicAreasBackground: "/images/thematic-areas-background.png",
    footerCarousel: [
      "/images/footer-carousel-1.png",
      "/images/footer-carousel-2.png",
      "/images/footer-carousel-3.png",
      "/images/footer-carousel-4.png",
    ] as const,
  },
} as const;

/** Square logo URLs for structured data (absolute) and favicon discovery. */
export const siteLogo = {
  path: "/icon-512.png",
  width: 512,
  height: 512,
  structuredData: `${siteConfig.url}/icon-512.png`,
} as const;

export const aboutPageContent = {
  title: "About Greenalaya Nepal",
  heroDescription:
    "Greenalaya Nepal builds the technology and conducts the research nature conservation needs - biodiversity databases of images, videos, and audio recordings, early-warning systems for environmental disasters and pollution, and climate-tech innovation to cut pollution and rising temperatures.",
  leadMission:
    "To build the technology and conduct the research nature conservation needs - from biodiversity databases of images, videos, and audio recordings, to early-warning systems for environmental disasters and pollution, to climate-tech innovation that reduces pollution and rising temperatures, advancing resilient ecosystems and sustainable development across Nepal.",
  intro: [
    "Greenalaya Nepal is a national environmental company that leverages research, technological innovation, and green enterprise to deliver data-driven solutions for resilient ecosystems through collaboration.",
    "We work at the intersection of technology and research, empowering communities to conserve and restore ecosystems through data-driven tools and scientific evidence.",
  ],
  vision:
    "A Nepal where technology and research are the driving force behind nature conservation - equipping communities, scientists, and institutions with the tools to protect ecosystems and build a resilient future.",
  pillarsHeading: "Strategic Pillars",
  pillarsDescription:
    "Five strategic pillars shape how we design research, technology, and community programs across Nepal.",
  thematicHeading: "Thematic Areas",
  thematicDescription:
    "Seven key thematic areas drive our work across Nepal, from emerging research questions to policy and community stewardship.",
} as const;

export const aboutWhatWeDo = {
  heading: "What we do?",
  paragraphs: [
    "Greenalaya Nepal is a national environmental organization that builds the technology and resources nature conservation needs such as biodiversity databases, monitoring tools, and research that turns field observation into evidence.",
    "We work at the intersection of technology and research, equipping communities, scientists, and institutions with the resources to protect and restore Nepal's ecosystems.",
    "We partner with researchers, communities, and institutions to put these tools and resources to work, protecting biodiversity and strengthening livelihoods across Nepal.",
  ],
  image: siteConfig.images.communityHero,
} as const;

export const strategicPillars = [
  {
    title: "Technology",
    description:
      "Building biodiversity databases of images, videos, and audio recordings, plus early-warning systems for environmental disasters and pollution",
    icon: "technology",
  },
  {
    title: "Research",
    description:
      "Researching climate-tech innovations that cut pollution and reduce rising temperatures",
    icon: "research",
  },
  {
    title: "Nature",
    description: "Protecting and restoring ecosystems, biodiversity, and natural resources",
    icon: "nature",
  },
  {
    title: "People",
    description:
      "Empowering communities through education, training, and participatory conservation",
    icon: "people",
  },
  {
    title: "Collaboration",
    description: "Partnering with communities, organizations, and government for systemic change",
    icon: "collaboration",
  },
] as const;

export const siteContact = {
  email: "info@greenalayanepal.org.np",
  location: "Pokhara, Nepal",
  phone: "+977-9864835254",
} as const;

export const contactIntents = {
  volunteer: {
    label: "Get Membership",
    subject: "Membership inquiry",
    description: "Tell us how you would like to become a member and support our work.",
  },
  internship: {
    label: "Research Internship",
    subject: "Research internship inquiry",
    description: "Share your research interests and availability for an internship.",
  },
  partner: {
    label: "Partner With Us",
    subject: "Partnership inquiry",
    description: "Describe your organization and how you would like to collaborate.",
  },
} as const;

export type ContactIntentKey = keyof typeof contactIntents;

export function getContactIntent(key: string | undefined | null) {
  if (!key) return null;
  return contactIntents[key as ContactIntentKey] ?? null;
}

export function contactHref(intent: ContactIntentKey) {
  return `/contact?intent=${intent}`;
}

export const membershipPageContent = {
  title: "Become a Member",
  intro:
    "Greenalaya Nepal builds the technology and conducts the research that nature conservation needs - from biodiversity databases and early-warning systems to climate-tech innovation and community-led conservation. Become a member and join us in advancing environmental research, green technology, and sustainable enterprise across Nepal.",
  focusAreas: ["Technology", "Research", "Nature", "People", "Collaboration"] as const,
  whyJoinHeading: "Why Join Us?",
  whyJoin: [
    "Take part in our technology, research, and field conservation work.",
    "Work alongside researchers, technologists, and communities across Nepal.",
    "Contribute your knowledge, ideas, and skills to a greener Nepal.",
  ],
  optionsHeading: "Membership Options",
  applicationHeading: "Membership Application",
  closing:
    "Thank you for your interest in Greenalaya Nepal. Together, we can build the technology and research a resilient Nepal needs.",
} as const;

export const membershipTiers = [
  {
    id: "life",
    label: "Life Member",
    fee: "NPR 3,000",
    feeNote: "one-time fee",
    renewal: null,
  },
  {
    id: "general",
    label: "General Member",
    fee: "NPR 500",
    feeNote: "initial fee",
    renewal: "NPR 200 renewal fee",
  },
  {
    id: "student",
    label: "Student Member",
    fee: "NPR 200",
    feeNote: "initial fee",
    renewal: "NPR 100 renewal fee",
  },
] as const;

export const membershipEducationOptions = [
  "SLC / SEE",
  "Diploma",
  "Higher School (+2)",
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "None",
] as const;

export const primaryNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
] as const;

export const footerAboutLinks = [
  { text: "About Greenalaya Nepal", href: "/about" },
  { text: "Advisors & Partners", href: "/about#advisors" },
  { text: "Team", href: "/team" },
] as const;

export const footerWorkLinks = [
  { text: "Projects", href: "/projects" },
  { text: "Publications", href: "/publications" },
] as const;

export const footerMediaLinks = [
  { text: "Blog", href: "/blog" },
  { text: "News & Updates", href: "/news" },
] as const;

export const socialProfiles = [
  { label: "Facebook", href: siteConfig.social.facebook },
  { label: "Instagram", href: siteConfig.social.instagram },
  { label: "LinkedIn", href: siteConfig.social.linkedin },
] as const;

const thematicAreas = [
  {
    title: "Environmental Technology & Data Systems",
    description: "GIS, AI, and data-driven solutions",
  },
  {
    title: "Climate-Tech & Pollution Management",
    description: "Adaptation, mitigation, and reduction",
  },
  {
    title: "Emerging Environmental Issues & Research",
    description: "Addressing new and understudied challenges",
  },
  {
    title: "Innovation, Eco-Products & Circular Economy",
    description: "Linking conservation with livelihoods",
  },
  {
    title: "Conservation & Ecosystem Restoration",
    description: "Protecting and rehabilitating habitats",
  },
  {
    title: "Community Conservation & Capacity Building",
    description: "Empowering local communities",
  },
  {
    title: "Environmental Policy, Governance & Ethics",
    description: "Science-based policies and advocacy",
  },
] as const;

/** Areas of Interest on the membership form - the site's thematic areas, plus a free-text "Other". */
export const membershipInterestOptions = [
  ...thematicAreas.map((area) => area.title),
  "Other",
] as const;

export const thematicAreasWithStyle = thematicAreas.map((area, index) => ({
  ...area,
  number: String(index + 1).padStart(2, "0"),
}));

const legacyButterflyGithubPdf =
  "https://github.com/greenalayanepal-del/greenalayanepal/raw/main/butterfly_images_of_kathmandu_valley.pdf";

export const butterflyPublication = {
  title: "Butterfly Images of Kathmandu Valley",
  slug: "butterfly-images-kathmandu-valley",
  pdfUrl: "/publications/butterfly_images_of_kathmandu_valley.pdf",
  abstract:
    "A comprehensive photographic collection documenting 174 butterfly species across the Kathmandu Valley, captured across different seasons and habitats.",
  description:
    "A comprehensive photographic collection documenting the diverse butterfly species found across the Kathmandu Valley. This visual guide showcases 174 species captured across different seasons and habitats, serving as an important reference for researchers, conservationists, and nature enthusiasts.",
  coverImage: "/images/butterfly-publication-cover.png",
  publishedDate: "April 2026",
  pageCount: 134,
} as const;

export type PublicationMetadata = {
  language?: string;
  published?: string;
  publishers?: string;
  isbn?: string;
};

/** Bibliographic details shown on publication detail pages. */
const publicationMetadata: Record<string, PublicationMetadata> = {
  [butterflyPublication.slug]: {
    language: "English",
    published: "2026",
    publishers: "Greenalaya Nepal and TinyLife Finders",
    isbn: "9789905-0-0219-7",
  },
};

export function getPublicationMetadata(slug: string, year: string): PublicationMetadata | null {
  const custom = publicationMetadata[slug];
  if (!custom) return null;

  return {
    language: custom.language,
    published: custom.published ?? year,
    publishers: custom.publishers ?? siteConfig.name,
    isbn: custom.isbn,
  };
}

/** Cover art and optional location overlay per publication slug. */
export const publicationAssets: Record<string, { coverImage: string; locationLabel?: string }> = {
  [butterflyPublication.slug]: {
    coverImage: butterflyPublication.coverImage,
    locationLabel: "Kathmandu Valley",
  },
};

export const defaultPublicationCover = butterflyPublication.coverImage;

/** Maps legacy GitHub-hosted PDF links to the deployed site asset. */
export function resolvePublicationPdfUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (
    url === legacyButterflyGithubPdf ||
    url.includes("butterfly_images_of_kathmandu_valley.pdf")
  ) {
    return butterflyPublication.pdfUrl;
  }
  return url;
}
