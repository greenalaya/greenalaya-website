import type { BlogPost } from "@/lib/types/blog";
import type { Collaborator } from "@/lib/types/collaborator";
import type { NewsPost } from "@/lib/types/news";
import type { Project } from "@/lib/types/project";
import type { Research } from "@/lib/types/research";
import type { TeamMember } from "@/lib/types/team";
import { butterflyPublication } from "@/lib/site";

/** Shown when Supabase has no rows yet. Mirrors supabase/phase4.sql. */
export const seedTeamMembers: TeamMember[] = [
  {
    id: "seed-nabin-sapkota",
    name: "Nabin Sapkota",
    slug: "nabin-sapkota",
    position: null,
    bio: null,
    photo_url: "/images/team/nabin-sapkota.jpg",
    linkedin_url: "https://www.linkedin.com/in/nabin1sapkota/",
    website_url: "https://nabin-sapkota.com.np/",
  },
  {
    id: "seed-binit-timalsina",
    name: "Binit Timalsina",
    slug: "binit-timalsina",
    position: null,
    bio: null,
    photo_url: "/images/team/binit-timalsina.jpg",
    linkedin_url: "https://www.linkedin.com/in/binit-timalsina-04a440266/",
    website_url: "https://www.binittimalsina.com.np/",
  },
  {
    id: "seed-siddhartha-sapkota",
    name: "Siddartha Sapkota",
    slug: "siddhartha-sapkota",
    position: null,
    bio: "Supports Greenalaya Nepal's governance and strategic direction, linking conservation research with community-centered environmental action across Nepal.",
    photo_url: "/images/team/siddhartha-sapkota.png",
    linkedin_url: "https://www.linkedin.com/in/siddartha-sapkota-133810290/",
  },
  {
    id: "seed-binay-dhakal",
    name: "Binay Dhakal",
    slug: "binay-dhakal",
    position: null,
    bio: null,
    photo_url: "/images/team/binay-dhakal.jpg",
  },
  {
    id: "seed-nirjal-sapkota",
    name: "Nirjal Sapkota",
    slug: "nirjal-sapkota",
    position: null,
    bio: null,
    photo_url: "/images/team/nirjal-sapkota.png",
  },
  {
    id: "seed-shreejana-bajracharya",
    name: "Shreejana Bajracharya",
    slug: "shreejana-bajracharya",
    position: null,
    bio: null,
    photo_url: "/images/team/shreejana-bajracharya.jpg",
    linkedin_url: "https://www.linkedin.com/in/shreejana-bajracharya-386b1028a/",
  },
  {
    id: "seed-rajib-sedhain",
    name: "Rajib Sedhain",
    slug: "rajib-sedhain",
    position: null,
    bio: null,
    photo_url: "/images/team/rajib-sedhain.jpg",
    linkedin_url: "https://www.linkedin.com/in/rajib-sedhain/",
  },
  {
    id: "seed-sarita-pokhrel",
    name: "Sarita Pokhrel",
    slug: "sarita-pokhrel",
    position: null,
    bio: null,
    photo_url: "/images/team/sarita-pokhrel.jpg",
    linkedin_url: "https://www.linkedin.com/in/sarita-pokhrel-025aa4269/",
  },
  {
    id: "seed-aashish-shrestha",
    name: "Aashish Shrestha",
    slug: "aashish-shrestha",
    position: null,
    bio: null,
    photo_url: "/images/team/aashish-shrestha.jpg",
    linkedin_url: "https://www.linkedin.com/in/saashish1746/",
  },
  {
    id: "seed-negma-shakya",
    name: "Negma Shakya",
    slug: "negma-shakya",
    position: null,
    bio: null,
    photo_url: "/images/team/negma-shakya.jpg",
  },
  {
    id: "seed-madhav-upadhya",
    name: "Madhav Upadhya",
    slug: "madhav-upadhya",
    position: null,
    bio: null,
    photo_url: "/images/team/madhav-upadhya.webp",
    linkedin_url: "https://www.linkedin.com/in/madhav-upadhaya-283a4622a/",
  },
  {
    id: "seed-pritam-thapa",
    name: "Pritam Thapa",
    slug: "pritam-thapa",
    position: null,
    bio: null,
    photo_url: "/images/team/pritam-thapa.jpg",
    linkedin_url: "https://www.linkedin.com/in/pritam-thapa-94640a32b/",
  },
  {
    id: "seed-firoj-raut",
    name: "Firoj Raut",
    slug: "firoj-raut",
    position: null,
    bio: null,
    photo_url: "/images/team/firoj-raut.jpeg",
    linkedin_url: "https://www.linkedin.com/in/firojraut1/",
  },
];

/**
 * Scientific advisors shown on About and /advisors — a separate roster from
 * the team page, kept independent so the two lists never overlap.
 */
export const seedAdvisors: TeamMember[] = [
  {
    id: "seed-mahendra-singh-limbu",
    name: "Mahendra Singh Limbu",
    slug: "mahendra-singh-limbu",
    position: null,
    bio: null,
    photo_url: "/images/team/mahendra-singh-limbu.webp",
  },
  {
    id: "seed-ruman-shrestha",
    name: "Ruman Shrestha",
    slug: "ruman-shrestha",
    position: null,
    bio: null,
    photo_url: "/images/team/ruman-shrestha.jpg",
  },
  {
    id: "seed-prasanna-shrestha",
    name: "Prasan Shrestha",
    slug: "prasanna-shrestha",
    position: null,
    bio: null,
    photo_url: "/images/team/prasanna-shrestha.jpg",
  },
];

/** Shown when Supabase supported_by table has no rows yet. */
export const seedSupportedBy: Collaborator[] = [
  {
    id: "seed-idea-wild",
    name: "Idea Wild",
    slug: "idea-wild",
    position: "Conservation partner",
    bio: null,
    photo_url: "/images/collaborators/supported-idea-wild.png",
    website_url: "https://ideawild.org/",
    logo_caption: "Idea Wild",
  },
  {
    id: "seed-ncsc",
    name: "Nature Conservation and Study Centre",
    slug: "nature-conservation-study-centre",
    position: "Conservation partner",
    bio: null,
    photo_url: "/images/collaborators/supported-ncsc.png",
    website_url: "https://ncsc.org.np/",
    logo_caption: "NCSC",
  },
];

/** Shown when Supabase collaborators table has no rows yet. */
export const seedCollaborators: Collaborator[] = [
  // Preserve the order logos were shared; append new collaborators at the end.
  {
    id: "seed-tinylife-finders",
    name: "Tinylife Finders",
    slug: "tinylife-finders",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/tinylife-finders.png",
  },
  {
    id: "seed-butterfly-watchers-nepal",
    name: "Butterfly Watchers Nepal",
    slug: "butterfly-watchers-nepal",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/butterfly-watchers-nepal.png",
  },
  {
    id: "seed-club-for-wildlife-conservation",
    name: "Club for Wildlife Conservation (CWC)",
    slug: "club-for-wildlife-conservation",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/club-for-wildlife-conservation.jpg",
  },
  {
    id: "seed-wildlife-logo",
    name: "Green and orange collaborator logo featuring wildlife",
    slug: "wildlife-logo",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/wildlife-logo.png",
  },
  {
    id: "seed-ifsa-hetauda",
    name: "IFSA Hetauda",
    slug: "ifsa-hetauda",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/ifsa-hetauda.png",
  },
  {
    id: "seed-ifsa-pokhara",
    name: "International Forestry Students' Association (IFSA) Pokhara",
    slug: "ifsa-pokhara",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/ifsa-pokhara.png",
  },
  {
    id: "seed-vision-green-organization",
    name: "Vision Green Organization",
    slug: "vision-green-organization",
    position: null,
    bio: null,
    photo_url: "/images/collaborators/vision-green-organization.png",
  },
];

export function getSeedNewsPost(slug: string): NewsPost | null {
  return seedNewsPosts.find((post) => post.slug === slug) ?? null;
}

export const seedResearch: Research[] = [
  {
    id: "seed-butterfly-research",
    title: butterflyPublication.title,
    slug: butterflyPublication.slug,
    abstract: butterflyPublication.abstract,
    pdf_url: butterflyPublication.pdfUrl,
    published_date: "2026-04-01",
  },
];

export const seedProjects: Project[] = [
  {
    id: "seed-butterfly-project",
    title: "Kathmandu Valley Butterfly Documentation",
    slug: "kathmandu-valley-butterfly-documentation",
    description:
      "A Greenalaya Nepal and TinyLife Finders initiative that brought together 503 photographs of 174 butterfly species from 34 locations across Kathmandu Valley.",
    image_url: "/images/projects/godawari-butterfly-watch.webp",
    created_at: "2026-04-01T00:00:00.000Z",
  },
  {
    id: "seed-chinari",
    title: "Chinari: AI-Based Vertebrate Classification Platform for Nepal",
    slug: "chinari-ai-wildlife-classification",
    description:
      "An AI platform for the automated detection, tracking, and species-level identification of Nepal's vertebrate fauna from camera-trap imagery, ranger field reports, and citizen-submitted photos and video.",
    image_url: "/images/projects/chinari-logo.png",
    created_at: "2026-08-01T00:00:00.000Z",
  },
];

export function getSeedProject(slug: string): Project | null {
  return seedProjects.find((project) => project.slug === slug) ?? null;
}

export const seedNewsPosts: NewsPost[] = [
  {
    id: "seed-big-butterfly-count-2026-godawari",
    title: "Big Butterfly Count 2026: Butterfly Walk Records 16 Species in Godawari",
    slug: "big-butterfly-count-2026-godawari-walk",
    excerpt:
      "Despite rainy weather, Greenalaya Nepal's opening walk for Big Butterfly Month 2026 recorded 16 butterfly species in Godawari, Lalitpur, including the notable Tamur Labyrinth.",
    content:
      "Greenalaya Nepal kicked off Big Butterfly Month 2026 with a butterfly walk in Godawari, Lalitpur. Despite persistent rainfall and overcast weather, the 13 participants recorded an impressive 16 butterfly species, including the notable Tamur Labyrinth.\n\nThe walk was led by our Advisor, Mahendra Singh Limbu, and coordinated by our Founder, Siddartha Sapkota. The event was supported by Butterfly Watchers Nepal.\n\nThis is just the beginning: more butterfly walks and counts are planned throughout September across Nepal as part of Big Butterfly Month 2026.",
    featured_image_url: "/images/news/big-butterfly-count-2026-godawari/group-photo.jpg",
    published_at: "2026-09-05T00:00:00.000Z",
  },
  {
    id: "seed-butterfly-watching-godawari",
    title: "Greenalaya Nepal’s Godawari Butterfly Watch Records 46+ Species",
    slug: "godawari-butterfly-watch",
    excerpt:
      "More than 45 nature enthusiasts joined a community field program in Godawari, recording over 46 butterfly species—including two rare highlights.",
    content:
      "Greenalaya Nepal successfully hosted an engaging butterfly-watching program in the ecologically rich region of Godawari. Organized in collaboration with Butterfly Watchers Nepal, TinyLife Finders, and the Club for Wildlife Conservation (CWC), the event brought together more than 45 nature lovers and conservation enthusiasts.\n\nThe day’s activities were led by Mr. Mahendra Singh Limbu, an advisor to Greenalaya Nepal. After the field observation, Mr. Limbu delivered an insightful presentation on butterfly ecology, behavior, and field identification techniques. His guidance helped participants reflect on their sightings and deepen their understanding of the biodiversity they had encountered in Godawari’s lush natural habitat.\n\nThe field expedition yielded remarkable results, with the group recording over 46 distinct butterfly species. Among the sightings were two rare and seldom-seen species, the Great Hockeystick Sailer and the Scarce Lilacfork, bringing immense excitement to amateur watchers and seasoned experts alike.\n\nThe event was further honored by the presence of distinguished guests Mr. Hem Sagar Baral and Mr. Rajendra Gurung. Their participation underscored the importance of community-driven conservation and wildlife observation in Nepal.\n\nGreenalaya Nepal extends its deepest gratitude to every participant, guest, and partner organization for making the program so fruitful. Building on its success, Greenalaya Nepal remains committed to fostering nature appreciation and conservation through more community-driven programs in the near future.",
    featured_image_url: "/images/news/butterfly-watching-godavari/participants-observing.jpg",
    published_at: "2026-06-06T00:00:00.000Z",
  },
  {
    id: "seed-butterfly-publication",
    title: "Butterfly Images of Kathmandu Valley — publication released",
    slug: "butterfly-images-kathmandu-valley-released",
    excerpt:
      "Our photographic guide documenting 174 butterfly species in the Kathmandu Valley is now available as a free PDF.",
    content:
      "Greenalaya Nepal has published Butterfly Images of Kathmandu Valley, a visual reference documenting 174 butterfly species observed across seasons and habitats in the valley. The publication supports researchers, conservation practitioners, educators, and nature enthusiasts working on urban biodiversity in Nepal.\n\nDownload the PDF from our Publications page or the Research section.",
    featured_image_url: null,
    published_at: "2026-04-21T00:00:00.000Z",
  },
  {
    id: "seed-org-launch",
    title: "Greenalaya Nepal — research and innovation for nature",
    slug: "greenalaya-nepal-launch",
    excerpt:
      "We are building a national platform that connects conservation with research, technology, and sustainable enterprise.",
    content:
      "Greenalaya Nepal is a national environmental organization focused on credible science, community-centered conservation, and green enterprise. Our work spans emerging environmental research, ecosystem restoration, climate and pollution action, environmental technology, capacity building, and science-based policy.\n\nWe welcome collaborations with researchers, communities, students, and partner organizations. Reach us through the contact page to volunteer, intern, or explore partnerships.",
    featured_image_url: null,
    published_at: "2026-04-13T00:00:00.000Z",
  },
];

/** Shown when Supabase has no rows yet. Mirrors supabase/phase10-blog.sql. */
export const seedBlogPosts: BlogPost[] = [];

export function getSeedBlogPost(slug: string): BlogPost | null {
  return seedBlogPosts.find((post) => post.slug === slug) ?? null;
}
