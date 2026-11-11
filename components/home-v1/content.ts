/**
 * Copy for "Our Work in Action", "Publications" and "News & Updates" as they were in the first
 * homepage redesign. /home-preview-2 uses these sections in place of the newer ones.
 */

export const homeContent = {
  work: {
    title: "Our Work in Action",
    /** Projects themselves come from the project list (newest first); these add image detail. */
    images: {
      "/images/projects/moths-of-bagmati-province.jpg": {
        alt: "A large orange silk moth resting on a whitewashed wall",
      },
      "/images/projects/godawari-butterfly-watch.webp": {
        alt: "A brown butterfly resting with its wings open on a rock",
      },
      "/images/projects/chinari-logo.png": {
        alt: "Chinari logo: a snow leopard drawn in front of mountain peaks",
        darkSrc: "/images/projects/chinari-logo-dark.png",
        isLogo: true,
      },
    } as Record<string, { alt: string; darkSrc?: string; isLogo?: boolean }>,
    more: {
      href: "/projects",
      label: "See all projects",
    },
  },
  publications: {
    title: "Publications",
    more: {
      href: "/publications",
      label: "See all publications",
    },
  },
  news: {
    title: "News & Updates",
    more: {
      href: "/news",
      label: "See all news",
    },
  },
} as const;
