import type { BlogPost } from "@/lib/types/blog";
import type { Collaborator } from "@/lib/types/collaborator";
import type { NewsPost } from "@/lib/types/news";
import type { Project } from "@/lib/types/project";
import type { Research } from "@/lib/types/research";
import type { TeamMember } from "@/lib/types/team";
import { butterflyPublication, pollinatorWeekReport } from "@/lib/site";

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
    id: "seed-pollinator-week-2026-report",
    title: pollinatorWeekReport.title,
    slug: pollinatorWeekReport.slug,
    abstract: pollinatorWeekReport.abstract,
    pdf_url: pollinatorWeekReport.pdfUrl,
    published_date: "2026-09-30",
  },
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
    title: "Chinari: AI-Based Animal Classification Platform for Nepal",
    slug: "chinari-ai-wildlife-classification",
    description:
      "An AI platform for the automated detection, tracking, and species-level identification of Nepal's animals - both vertebrates and invertebrates - from camera-trap imagery, ranger field reports, and citizen-submitted photos and video.",
    image_url: "/images/projects/chinari-logo.png",
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "seed-moths-bagmati-province",
    title: "Moonlight Dancer: Documenting the Moths of Bagmati Province",
    slug: "moths-of-bagmati-province",
    description:
      "Following the success of Butterfly Images of Kathmandu Valley, Greenalaya Nepal's next citizen-science initiative documents the moths of an entire province - from the plains of the Terai to the valleys, hills, and higher Central Himalayas of Bagmati Province.",
    image_url: "/images/projects/moths-of-bagmati-province.jpg",
    created_at: "2026-09-17T00:00:00.000Z",
  },
];

export function getSeedProject(slug: string): Project | null {
  return seedProjects.find((project) => project.slug === slug) ?? null;
}

export const seedNewsPosts: NewsPost[] = [
  {
    id: "seed-moths-bagmati-province-launch",
    title: "Announcing Our Next Project: Moths of Bagmati Province",
    slug: "announcing-moths-of-bagmati-province",
    excerpt:
      "Following the success of Butterfly Images of Kathmandu Valley, Greenalaya Nepal is launching a province-wide citizen-science initiative to photograph and document the moths of Bagmati Province.",
    content:
      "Greenalaya Nepal is launching A Pictorial E-book of Moths of Bagmati Province, Nepal, a province-wide citizen-science initiative that builds on the success of Butterfly Images of Kathmandu Valley. The project scales up from a single valley to an entire province, capturing the wider ecological range Bagmati Province offers, from the plains of the Terai region to the valleys and mountains of the hills, extending to the higher Central Himalayas.\n\nMoths are one of the most overlooked groups in Nepal's biodiversity conversation. Far more numerous than butterflies yet drastically under-recorded, they make excellent bioindicators, and this project fills a genuine knowledge gap by contributing new baseline data on a chronically understudied group.\n\nThe project is built entirely on community participation, with photographers, students, and naturalists across the province invited to submit moth photographs. Every submission - of a moth on a wall, a windowsill, a light trap, or deep in the forest - adds a verified data point of species, date, and location, and every contributor is fully credited alongside their photograph in the project's photographer index.\n\nGreenalaya Nepal looks forward to building this baseline together with citizen scientists across Bagmati Province.",
    featured_image_url:
      "/images/news/announcing-moths-of-bagmati-province/moth-on-forest-floor.jpg",
    published_at: "2026-09-17T00:00:00.000Z",
  },
  {
    id: "seed-big-butterfly-count-2026-godawari",
    title: "Big Butterfly Count 2026: Butterfly Walk Records 16 Species in Godawari",
    slug: "big-butterfly-count-2026-godawari-walk",
    excerpt:
      "Despite rainy weather, Greenalaya Nepal's opening walk for Big Butterfly Month 2026 recorded 16 butterfly species in Godawari, Lalitpur, including the notable Spotted Jester.",
    content:
      "Greenalaya Nepal kicked off Big Butterfly Month 2026 with a butterfly walk in Godawari, Lalitpur. Despite persistent rainfall and overcast weather, the 13 participants recorded an impressive 16 butterfly species, including the notable Spotted Jester.\n\nThe walk was led by our Advisor, Mahendra Singh Limbu, and coordinated by our Founder, Siddartha Sapkota. The event was supported by Butterfly Watchers Nepal.\n\nThis is just the beginning: more butterfly walks and counts are planned throughout September across Nepal as part of Big Butterfly Month 2026.",
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
export const seedBlogPosts: BlogPost[] = [
  {
    id: "seed-ai-environment-nepal",
    title: "From Glaciers to Algorithms: How AI Can Help Nepal Watch Over Its Environment",
    slug: "ai-environment-nepal",
    excerpt:
      "Nepal’s environmental data gap is not a sign that little is happening. It exists because so much happens, so fast, in places so hard to reach.",
    content: `![Satellites and riverside sensors watching over a Himalayan valley](/images/blog/glaciers-to-algorithms-hero.png)

Nepal’s environmental data gap is not a sign that little is happening. It exists because so much happens, so fast, in places so hard to reach. A glacial lake can burst on the far side of a border, a forest fire can jump a ridge overnight, and a monsoon cloudburst can turn a quiet khola (stream) into a torrent within an hour. By the time a human report reaches Kathmandu, the event is often over.

This is the gap that artificial intelligence, paired with satellites and sensors, is starting to close. In this post, I look past the hype at what AI can realistically do for Nepal’s environment: where it already works, where it breaks down in a country like ours, and what it would take to get it right.

## The problem: our hazards move faster than our warnings
On the morning of 26 August 2026, a large rock–ice collapse on the north-facing slope of Langtang Lirung in Rasuwa district triggered an ice–rock avalanche and a cascading debris flow and flood that travelled downstream through the Lhende, Bhote Koshi and Trishuli river systems ([ICIMOD Q&A](https://www.icimod.org/kyirong-rasuwa-flood-2026-nepal-china-border/)). As of mid-October, Nepal’s National Disaster Risk Reduction and Management Authority (NDRRMA) reports about 1,455 deaths, with more than 5,000 people still missing. Its rapid damage and needs assessment puts economic losses at about US$883 million and total recovery and reconstruction needs at nearly US$4.8 billion (NDRRMA via [Deccan Chronicle](https://deccanchronicle.com/world/neighbours/nepal-flash-flood-sweeps-away-over-35-houses-bridges-in-gorkha-1994851); [Clickmandu](https://english.clickmandu.com/2026/10/11864)). The official technical reports show how quickly the first half hour unfolded:

- **08:37:** A seismic event is recorded. It is later identified as the collapse itself, not an earthquake.
- **~08:40:** The debris flood reaches the Bhote Koshi at the Nepal–China border. The Syafrubesi gauge reads 1.62 m, against a 6 m warning level.
- **08:50:** The Syafrubesi station stops transmitting. Four gauging stations are eventually swept away.
- **~08:56:** The Department of Hydrology and Meteorology learns of the flood, about 16 minutes after it reached the border.
- **Shortly after:** More than 600,000 SMS warnings go out, too late for communities nearest the source.

Sources: [OnlineKhabar technical report summary](https://english.onlinekhabar.com/technical-report-rasuwa-flood.html); [Nepal News](https://english.nepalnews.com/s/explainers/bhote-koshi-catastrophe-a-360-degree-look-at-what-happened-what-went-wrong-and-what-comes-next/); [PreventionWeb](https://www.preventionweb.net/news/emergency-warnings-werent-enough-save-nepals-flood-ravaged-villages-expert-explains).

The warning system worked as designed. The problem is what it was designed for. Nepal’s flood forecasting relies mainly on rainfall and river-level readings, and its gauges are built to detect gradual rises, not a wall of debris ([Republica](https://myrepublica.nagariknetwork.com/news/bhotekoshi-flood-where-happiness-was-washed-away-10-52.html)). The source area sat in what reporters called a monitoring blind spot. This was the second disaster in that valley in just over a year: in July 2025, a supraglacial lake in Tibet grew to about 0.64 km² and burst into the same river ([Climate Home News](https://www.climatechangenews.com/2025/08/27/nepal-and-china-agree-to-cooperate-on-glacial-lake-flooding-as-warming-hikes-threat/)).

The Rasuwa disaster is an extreme example of a wider pattern in Nepal’s environment:

- **The cryosphere is changing faster than we can survey it.** Hindu Kush Himalayan glaciers lost mass 65% faster in 2011–2020 than in the previous decade and could lose up to 80% of their volume by 2100 on current emissions ([ICIMOD HI-WISE](https://hkh.icimod.org/hi-wise/media/press-release/)).
- **Forest fires are a public-health problem, not just a forestry one.** In early 2021, NASA’s VIIRS sensor detected roughly 41,000 fire hotspots in Nepal in just over three months ([NASA](https://science.nasa.gov/?p=1053928)). In fire season, smoke regularly pushes air pollution to unhealthy levels, and Kathmandu’s AQI crossed 200 again in April 2026 ([Kathmandu Post](https://kathmandupost.com/health/2026/04/15/after-brief-relief-kathmandu-air-slips-back-to-unhealthy); [Rising Nepal](https://risingnepaldaily.com/news/79243)).
- **Biodiversity is rich but under-recorded.** Researchers still describe Nepal’s butterfly data, for example, as incomplete and out of date ([Kathmandu Post](https://kathmandupost.com/climate-environment/2026/09/16/nepal-begins-a-nationwide-butterfly-count)).

The common thread is not a lack of concern. It is a lack of continuous, local observation, and of systems that turn observations into action quickly.

## What AI can realistically do

![A glacial lake, and the same lake outlined by an AI segmentation model with a growth trend](/images/blog/glaciers-to-algorithms-lake-mapping.png)

AI earns its place where the data is too large, or the signal too fast, for people to watch. Look at the timeline again: the earliest evidence of the disaster was the 08:37 seismic signal, minutes before any river gauge reacted. That gap is where AI is most useful.

**1. Treat seismometers as hazard sensors.** Large rock and ice collapses produce seismic signals that differ from earthquakes, with emergent onsets and strong long-period energy. The USGS later classified the August signal as a landslide ([USGS](https://earthquake.usgs.gov/earthquakes/eventpage/us7000tbwb)). Machine-learning classifiers trained on global catalogues of known landslides and avalanches could, in principle, make that call within minutes, although they would need testing on Himalayan events to keep false alarms low. Paired with the location of high-risk slopes and lakes, a classification of “mass movement upstream of a populated river” could trigger an automatic alert, rather than waiting for a gauge that may already be destroyed.

**2. Watch every glacial lake and unstable slope from orbit.** Sentinel-2 provides free optical images at 10 m resolution and revisits the same place about every five days, although monsoon cloud can hide the ground for weeks at a time. Sentinel-1 radar, now flown by the Sentinel-1C and 1D pair, sees through cloud and repeats the same view every six days. Images typically reach users within hours of capture ([Copernicus](https://dataspace.copernicus.eu/news/2026-4-2-sentinel-1d-user-data-opening-and-future-plans); [eoPortal](https://www.eoportal.org/satellite-missions/copernicus-sentinel-2)). In principle, deep-learning segmentation models can map glacial lakes on cloud-free images and flag unusual growth for an expert to check, but they still make enough errors that they should support human analysts, not replace them. The July 2025 lake went from not visible to over 0.6 km² in under a week ([Khabarhub](https://english.khabarhub.com/2025/10/484718/)), a change of the kind an automated screening system could help catch. The technical challenges are real: frozen or debris-covered lakes, mountain shadow and turbid water all confuse models, so radar and optical data work best combined. Radar interferometry can also detect slopes that are slowly creeping before they fail.

**3. Make sensor networks smarter and harder to break.** Low-cost river, rain and air-quality sensors drift and fail. Models trained against a few reference stations can correct drift, fill gaps and treat a sudden loss of signal as information. Four stations falling silent in sequence down one river is itself a warning.

**4. Move from detecting fires to forecasting them.** Nepal already uses satellite hotspot data through its Forest Fire Detection and Monitoring System. The next step is prediction: models combining fuel dryness, temperature, wind and past fire patterns to tell district forest offices and community forest user groups where risk will peak in the coming days.

Little of this needs new technology. The satellites, seismic networks and open-source models are already available. What is missing is their careful application to Nepal’s terrain and institutions.

## Where AI fails quietly, and why Nepal is exposed
Most of the hype skips the failure modes. In Nepal, four stand out.

**Rare events starve supervised models.** A model learns from examples, and catastrophic collapses are, mercifully, rare. There are not enough labelled Himalayan ice-rock avalanches to train a reliable classifier from data alone. The practical answer is hybrid systems: physics-based models of lake volume, slope stability and flood routing, with machine learning used for detection and anomaly-spotting rather than for the whole prediction. A purely data-driven model will be confidently wrong about exactly the event it has never seen, much as gauges built for gradual monsoon rises were caught out in August.

**Global models do not know local ground.** Most training data comes from flatter, better-mapped parts of the world. A lake-mapping model can confuse snow-covered debris with water; an image classifier can mislabel a Himalayan species it has rarely seen. In Nepal, the bottleneck is not algorithms. It is labelled local data: mapped past events, ground-truthed lake surveys and verified species records.

**A warning is only as good as its last mile.** In Nuwakot, headteacher Rajendra Dawadi evacuated about 900 students minutes before the flood destroyed his school. He received four separate warnings, including one from Betrawati just upstream, and the head of the IFRC credited his Red Cross preparedness training ([IBTimes](https://www.ibtimes.co.uk/heroic-headteacher-saves-900-students-nepal-flood-1817065); [Jagan Chapagain](https://x.com/jagan_chapagain/status/2105685621473779763)). Elsewhere, some people went onto bridges to film the flood even after being warned ([Republica](https://myrepublica.nagariknetwork.com/news/bhotekoshi-flood-where-happiness-was-washed-away-10-52.html)). Faster detection buys nothing without trusted channels and practised responses. AI should feed ward offices, schools, FM radio and community groups, not bypass them.

**AI can also pollute the information space.** After the flood, the Press Council ordered 72 social-media users to remove content, and fact-checkers found AI-generated videos, recycled footage and fraudulent donation QR codes circulating as real ([Kathmandu Post](https://kathmandupost.com/national/2026/08/31/in-disaster-aftermath-nepal-battles-a-flood-of-misinformation); [Onmanorama/PTI](https://www.onmanorama.com/news/world/2026/09/01/after-flash-floods-nepal-now-battles-ai-generated-visuals-on-social-media.html)). Credible, verified information is now part of disaster response.

There are hard practical limits too. False alarms erode trust quickly. Remote sensors need power, telemetry and maintenance, and must survive the very hazard they measure. And the riskiest sources often sit across a border, where data sharing depends on diplomacy rather than technology.

## What we are doing at Greenalaya Nepal

![A camera trap on a tree flagging a red panda among its captured frames](/images/blog/glaciers-to-algorithms-camera-trap.png)

At [Greenalaya Nepal](https://www.greenalayanepal.org.np/), my team and I are researching these problems and opportunities. Our aim is to ensure that the AI tools Nepal adopts are built on Nepali data, tested in Nepali conditions and trusted by the communities who depend on them. We are starting with biodiversity, where the data gap is clearest, but the approach we are building, with AI doing the first pass, experts validating and records shared openly, applies just as much to hazard monitoring.

Our next major project is **Chinari**, a knowledge ecosystem for Nepal’s biodiversity. It is designed to bring together camera-trap detection, species identification, expert validation, and long-term monitoring and analysis across Nepal’s regions. The core idea is that AI does the first pass, flagging animals in camera-trap frames and suggesting identifications, while Nepali experts validate the results. Every validated record then improves the models and adds to a shared national knowledge base.

The groundwork is already in the field. Our fourth nationwide Big Butterfly Count, run with Butterfly Watchers Nepal in September 2026, involved more than 100 volunteers surveying 25 sites, with each observation photographed and uploaded to iNaturalist ([Kathmandu Post](https://kathmandupost.com/climate-environment/2026/09/16/nepal-begins-a-nationwide-butterfly-count)). Records like these are scientific evidence and, once verified, training data for models that need to learn Nepal’s species.

## What would make the difference
AI will not stop a glacier from collapsing. Used well, it can buy minutes in a flood, days in a fire season and years of insight into ecosystems we barely document. Drawing on the lessons of August, these are the priorities I would argue for:

1. **Automated alerts from the earliest signal.** Link seismic classification of mass movements to downstream SMS and siren alerts, so a warning does not wait for a river gauge.
2. **Satellite watch over the blind spots.** Routinely screen high-risk lakes and slopes, including those across the border, with combined radar and optical monitoring.
3. **Monitoring that survives the hazard.** Elevated, redundant stations with backup power and telemetry, and software that treats a silent station as a warning.
4. **Open, local, labelled data.** Shared inventories of past events, lake surveys and verified species records that Nepali researchers can train and test models on.
5. **Investment in the last mile.** Preparedness training, drills and trusted local channels, because a warning only works if people know what to do with it.

The question for Nepal is not whether to use AI. It is whose data, whose priorities and whose hands will shape it. I believe the answer should be Nepali researchers and communities, working openly with partners across the region.

*Note: Scientific understanding of the 26 August 2026 Rasuwa event continues to evolve. Event mechanisms, casualty figures and damage estimates may be revised as investigations and assessments progress. This article reflects information and assessments available at the time of publication.*

## Sources

- Clickmandu. “[One month since the devastating Bhotekoshi flood: How can Nepal move forward with the recovery drive?](https://english.clickmandu.com/2026/10/11864)” 1 October 2026.
- Climate Home News. “[Nepal and China agree to cooperate on glacial lake flooding, as warming hikes threat.](https://www.climatechangenews.com/2025/08/27/nepal-and-china-agree-to-cooperate-on-glacial-lake-flooding-as-warming-hikes-threat/)” 27 August 2025.
- Copernicus Data Space Ecosystem. “[Sentinel-1D user data opening and future plans.](https://dataspace.copernicus.eu/news/2026-4-2-sentinel-1d-user-data-opening-and-future-plans)” 2 April 2026.
- Deccan Chronicle. “[Nepal hit by fresh flash floods; houses and bridges washed away.](https://deccanchronicle.com/world/neighbours/nepal-flash-flood-sweeps-away-over-35-houses-bridges-in-gorkha-1994851)” October 2026.
- eoPortal (ESA). “[Copernicus: Sentinel-2.](https://www.eoportal.org/satellite-missions/copernicus-sentinel-2)” Mission page, accessed October 2026.
- IBTimes UK. “[Nepal principal’s 900 rescued students are a rare bright spot amid nearly 1,000 flood deaths.](https://www.ibtimes.co.uk/heroic-headteacher-saves-900-students-nepal-flood-1817065)” September 2026.
- ICIMOD. “[Water, Ice, Society, and Ecosystems in the Hindu Kush Himalaya (HI-WISE)](https://hkh.icimod.org/hi-wise/media/press-release/)”, press release. 20 June 2023.
- ICIMOD. “[Kyirong–Rasuwa Flood 2026: Q&A.](https://www.icimod.org/kyirong-rasuwa-flood-2026-nepal-china-border/)” 2026.
- Jagan Chapagain (IFRC Secretary General). [Post on X.](https://x.com/jagan_chapagain/status/2105685621473779763)
- The Kathmandu Post. “[After brief relief, Kathmandu air slips back to unhealthy.](https://kathmandupost.com/health/2026/04/15/after-brief-relief-kathmandu-air-slips-back-to-unhealthy)” 15 April 2026.
- The Kathmandu Post. “[In disaster aftermath, Nepal battles a flood of misinformation.](https://kathmandupost.com/national/2026/08/31/in-disaster-aftermath-nepal-battles-a-flood-of-misinformation)” 31 August 2026.
- The Kathmandu Post. “[Nepal begins a nationwide butterfly count.](https://kathmandupost.com/climate-environment/2026/09/16/nepal-begins-a-nationwide-butterfly-count)” 16 September 2026.
- Khabarhub. “[Satellite analysis shows GLOF as trigger behind devastating Rasuwa flood.](https://english.khabarhub.com/2025/10/484718/)” 10 July 2025.
- NASA Earth Observatory. “[A Fierce Fire Season in Nepal.](https://science.nasa.gov/?p=1053928)” 15 April 2021.
- Nepal News. “[Bhote Koshi catastrophe: A 360-degree look at what happened, what went wrong and what comes next.](https://english.nepalnews.com/s/explainers/bhote-koshi-catastrophe-a-360-degree-look-at-what-happened-what-went-wrong-and-what-comes-next/)” August 2026.
- OnlineKhabar. “[Technical report details Bhotekoshi flood’s journey from Tibet to Devghat.](https://english.onlinekhabar.com/technical-report-rasuwa-flood.html)” August 2026.
- Onmanorama / PTI. “[After flash floods, Nepal now battles AI-generated visuals on social media.](https://www.onmanorama.com/news/world/2026/09/01/after-flash-floods-nepal-now-battles-ai-generated-visuals-on-social-media.html)” 1 September 2026.
- PreventionWeb. “[Emergency warnings weren’t enough to save Nepal’s flood-ravaged villages. An expert explains.](https://www.preventionweb.net/news/emergency-warnings-werent-enough-save-nepals-flood-ravaged-villages-expert-explains)” September 2026.
- Republica. “[Bhotekoshi flood exposes Nepal’s warning system, raises questions over state accountability.](https://myrepublica.nagariknetwork.com/news/bhotekoshi-flood-where-happiness-was-washed-away-10-52.html)” September 2026.
- The Rising Nepal. “[Kathmandu among most polluted cities.](https://risingnepaldaily.com/news/79243)” 25 April 2026.
- U.S. Geological Survey. “[M 5.2 Landslide — 55 km NW of Kodari, Nepal.](https://earthquake.usgs.gov/earthquakes/eventpage/us7000tbwb)” 26 August 2026.`,
    featured_image_url: "/images/blog/glaciers-to-algorithms-hero.png",
    published_at: "2026-10-02T00:00:00.000Z",
    author: "Pritam Thapa",
    author_url: "/team/pritam-thapa",
    author_role: "AI Research Engineer · Greenalaya Nepal",
    source_url:
      "https://medium.com/@pritamth.ai/from-glaciers-to-algorithms-how-ai-can-help-nepal-watch-over-its-environment-94c826c4a16e",
  },
];

export function getSeedBlogPost(slug: string): BlogPost | null {
  return seedBlogPosts.find((post) => post.slug === slug) ?? null;
}
