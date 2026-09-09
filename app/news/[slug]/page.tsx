import { ArrowLeft, Binoculars, CalendarDays, MapPin, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-shell";
import { getSeedNewsPost } from "@/lib/content/seed";
import { articleJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const butterflyStorySlug = "godawari-butterfly-watch";
const butterflyStoryImages = {
  hero: "/images/news/butterfly-watching-godavari/participants-observing.jpg",
  group: "/images/news/butterfly-watching-godavari/organizers-and-guests.jpg",
  briefing: "/images/news/butterfly-watching-godavari/field-briefing.jpg",
  briefingWide: "/images/news/butterfly-watching-godavari/participant-briefing-wide.jpg",
  forestGroup: "/images/news/butterfly-watching-godavari/forest-observation-group.jpg",
  fullGroup: "/images/news/butterfly-watching-godavari/full-participant-group.jpg",
  portrait: "/images/news/butterfly-watching-godavari/participant-binoculars-portrait.jpg",
  presentation: "/images/news/butterfly-watching-godavari/limbu-butterfly-presentation.jpg",
} as const;

const butterflyGallery = [
  {
    src: butterflyStoryImages.fullGroup,
    alt: "The full group of butterfly watching participants gathered in Godawari",
    caption: "More than 45 participants joined the day’s program.",
    className: "md:col-span-12 md:aspect-[2/1]",
  },
  {
    src: butterflyStoryImages.forestGroup,
    alt: "A group of participants looking for butterflies along a forest trail",
    caption: "Field identification in practice.",
    className: "md:col-span-7",
  },
  {
    src: butterflyStoryImages.portrait,
    alt: "A participant observing butterflies through binoculars beside a forest trail",
    caption: "A closer look into Godawari’s living landscape.",
    className: "md:col-span-5 md:row-span-2 md:aspect-auto md:min-h-[42rem]",
  },
  {
    src: butterflyStoryImages.briefingWide,
    alt: "Participants listening to the field briefing before the observation walk",
    caption: "The group gathers for the pre-walk briefing.",
    className: "md:col-span-7",
  },
  {
    src: butterflyStoryImages.presentation,
    alt: "Mahendra Singh Limbu presenting butterfly identification guidance to participants",
    caption: "Mr. Mahendra Singh Limbu introduces butterfly ecology and identification.",
    className: "md:col-span-7",
  },
  {
    src: butterflyStoryImages.group,
    alt: "Organizers and distinguished guests at the Godawari butterfly-watching program",
    caption: "Organizers and guests at the close of the program.",
    className: "md:col-span-5",
  },
] as const;

const bigCountStorySlug = "big-butterfly-count-2026-godawari-walk";
const bigCountImages = {
  hero: "/images/news/big-butterfly-count-2026-godawari/umbrella-walk-canopy.jpg",
  notableSpecies: "/images/news/big-butterfly-count-2026-godawari/phone-macro-car-hood.jpg",
  groupPhoto: "/images/news/big-butterfly-count-2026-godawari/group-photo.jpg",
  roadside: "/images/news/big-butterfly-count-2026-godawari/roadside-photographing.jpg",
  phoneMacro: "/images/news/big-butterfly-count-2026-godawari/phone-macro-butterfly.jpg",
  forestObservation: "/images/news/big-butterfly-count-2026-godawari/group-forest-observation.jpg",
  throughRailing: "/images/news/big-butterfly-count-2026-godawari/photographer-through-railing.jpg",
} as const;

const bigCountGallery = [
  {
    src: bigCountImages.groupPhoto,
    alt: "The full group of participants gathered for the Godawari butterfly walk",
    caption: "13 participants joined the opening walk of Big Butterfly Month 2026.",
    className: "md:col-span-12 md:aspect-[2/1]",
  },
  {
    src: bigCountImages.roadside,
    alt: "Participants crouching roadside to photograph a butterfly in the rain",
    caption: "Rain didn't stop the field documentation.",
    className: "md:col-span-5 md:row-span-2 md:aspect-auto md:min-h-[42rem]",
  },
  {
    src: bigCountImages.phoneMacro,
    alt: "A close-up phone photograph of a butterfly resting on the ground",
    caption: "Documenting sightings, one frame at a time.",
    className: "md:col-span-7",
  },
  {
    src: bigCountImages.forestObservation,
    alt: "Participants looking up into the forest canopy during the walk",
    caption: "Scanning the canopy along the Godawari trail.",
    className: "md:col-span-7",
  },
  {
    src: bigCountImages.throughRailing,
    alt: "A participant photographing a butterfly resting on a railing",
    caption: "A closer look at one of the day's sightings.",
    className: "md:col-span-5",
  },
] as const;

async function loadNewsPost(slug: string) {
  let post = getSeedNewsPost(slug);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, excerpt, content, featured_image_url, published_at")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      post = data;
    }
  }

  return post;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadNewsPost(slug);

  if (!post) {
    return pageMetadata({
      title: "News",
      description: "News update from Greenalaya Nepal",
      path: `/news/${slug}`,
    });
  }

  return pageMetadata({
    title: post.title,
    description: post.excerpt ?? "News update from Greenalaya Nepal",
    path: `/news/${post.slug}`,
    image: post.featured_image_url,
  });
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-NP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await loadNewsPost(slug);

  if (!post) {
    notFound();
  }

  if (post.slug === bigCountStorySlug) {
    const articleUrl = `${siteConfig.url}/news/${post.slug}`;
    const shareText = encodeURIComponent(post.title);

    return (
      <>
        <JsonLd
          data={articleJsonLd({
            title: post.title,
            description: post.excerpt ?? "News update from Greenalaya Nepal",
            path: `/news/${post.slug}`,
            datePublished: post.published_at,
          })}
        />
        <main className="overflow-hidden pb-20 pt-20 md:pt-24">
          <article>
            <header className="relative bg-[#07150b] text-white">
              <div className="absolute inset-0">
                <Image
                  src={bigCountImages.hero}
                  alt="Participants walking under umbrellas through the rain-soaked Godawari forest canopy"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="100vw"
                  className="object-cover object-center opacity-45"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,8,0.96)_0%,rgba(4,18,8,0.76)_48%,rgba(4,18,8,0.2)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07150b]/90 via-transparent to-transparent" />
              </div>

              <div className="relative mx-auto flex min-h-[480px] max-w-7xl flex-col justify-between px-5 py-10 sm:min-h-[560px] sm:px-8 md:min-h-[680px] md:py-14 lg:px-10">
                <Link
                  href="/news"
                  className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <ArrowLeft className="size-4" aria-hidden /> All news
                </Link>

                <div className="max-w-4xl pb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8bd88f]">
                    Big Butterfly Month 2026
                  </p>
                  <h1 className="mt-5 font-display text-[clamp(2.35rem,5.4vw,4.9rem)] font-bold leading-[0.96] tracking-[-0.045em] text-white">
                    Big Butterfly Count 2026: Godawari Walk Records 16 Species
                  </h1>
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                    Rain didn&apos;t stop the count: Greenalaya Nepal opens Big Butterfly Month 2026
                    with a field walk in Godawari, Lalitpur.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/72">
                    {post.published_at ? (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#8bd88f]" />
                        {formatDate(post.published_at)}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-4 text-[#8bd88f]" />
                      Godawari, Nepal
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#8bd88f]" />3 min read
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <section className="border-b border-border bg-secondary/70">
              <div className="mx-auto grid max-w-6xl grid-cols-3 gap-px bg-border">
                {[
                  { icon: Users, value: "13", label: "participants" },
                  { icon: Binoculars, value: "16", label: "species recorded" },
                  { icon: Sparkles, value: "1", label: "notable rarity" },
                ].map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 bg-secondary/95 px-7 py-6 max-sm:flex-col max-sm:gap-2 max-sm:px-2 max-sm:py-5 max-sm:text-center sm:max-lg:flex-col sm:max-lg:gap-3 sm:max-lg:px-4 sm:max-lg:py-5 sm:max-lg:text-center sm:justify-center"
                  >
                    <Icon className="size-5 text-primary sm:size-6" aria-hidden />
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-10">
              <div className="max-w-3xl">
                <p className="font-display text-2xl font-medium leading-9 text-foreground sm:text-3xl sm:leading-[1.4]">
                  A great start to Big Butterfly Month 2026: despite rainfall and rainy weather,
                  Greenalaya Nepal recorded an impressive 16 butterfly species during a field walk
                  in Godawari, Lalitpur.
                </p>

                <div className="mt-10 space-y-7 text-[1.075rem] leading-8 text-muted-foreground">
                  <p>
                    Persistent rain and overcast skies didn&apos;t discourage the 13 participants who
                    turned out for the day&apos;s count, the first of many planned across Nepal this
                    September. Among the sightings was the notable{" "}
                    <strong className="font-semibold text-foreground">Spotted Jester</strong>,
                    drawing particular excitement from the group.
                  </p>
                  <p>
                    The walk was led by{" "}
                    <a
                      href="https://www.facebook.com/mslimbu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                      Mahendra Singh Limbu
                    </a>
                    , an advisor to Greenalaya Nepal, and coordinated by our Founder, Siddartha
                    Sapkota. The event was supported by Butterfly Watchers Nepal.
                  </p>
                </div>

                <figure className="my-12">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={bigCountImages.notableSpecies}
                      alt="A participant photographing the notable Spotted Jester butterfly resting on a car hood"
                      fill
                      sizes="(min-width: 1024px) 760px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
                    The Spotted Jester, one of the day&apos;s most notable sightings.
                  </figcaption>
                </figure>

                <div className="space-y-7 text-[1.075rem] leading-8 text-muted-foreground">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    A wet start, a strong count
                  </h2>
                  <p>
                    Sixteen species in the rain is no small feat, and it set an encouraging tone
                    for the month ahead. Greenalaya Nepal extends its thanks to every participant
                    and to Butterfly Watchers Nepal for supporting the walk.
                  </p>
                  <blockquote className="border-l-4 border-primary bg-secondary px-6 py-5 font-display text-xl font-medium leading-8 text-foreground sm:text-2xl">
                    Even the rain couldn&apos;t dampen sixteen species and one rare find - proof that
                    Godawari has plenty more to show us this September.
                  </blockquote>
                  <p>
                    More butterfly walks and counts are planned throughout September across Nepal
                    as part of Big Butterfly Month 2026.
                  </p>
                </div>
              </div>

              <aside
                className="h-fit rounded-2xl border border-border bg-card p-5 shadow-[0_14px_40px_rgba(13,55,22,0.06)] lg:sticky lg:top-28"
                aria-label="Article details"
              >
                <div>
                  <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                    In collaboration with
                  </p>
                  <ul className="mt-4 space-y-3 text-sm font-semibold leading-5 text-foreground">
                    <li className="flex gap-2.5">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>Butterfly Watchers Nepal</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-7 border-t border-border pt-6">
                  <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                    Share this story
                  </p>
                  <div className="mt-4 grid gap-2 text-sm font-semibold text-primary">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                    >
                      Facebook
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={`mailto:?subject=${shareText}&body=${encodeURIComponent(articleUrl)}`}
                      className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </aside>
            </div>

            <section
              className="bg-[#07150b] px-5 py-14 text-white sm:px-8 md:py-20 lg:px-10"
              aria-labelledby="gallery-heading"
            >
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#8bd88f]">
                      Field journal
                    </p>
                    <h2 id="gallery-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                      A rainy day in the field
                    </h2>
                  </div>
                </div>
                <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-12">
                  {bigCountGallery.map((image) => (
                    <figure
                      key={image.src}
                      className={`group relative aspect-[3/2] overflow-hidden rounded-2xl ${image.className}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 58vw, (min-width: 768px) 60vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-16">
                        <figcaption className="text-sm leading-6 text-white/85">
                          {image.caption}
                        </figcaption>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          </article>
        </main>
      </>
    );
  }

  if (post.slug === butterflyStorySlug) {
    const articleUrl = `${siteConfig.url}/news/${post.slug}`;
    const shareText = encodeURIComponent(post.title);

    return (
      <>
        <JsonLd
          data={articleJsonLd({
            title: post.title,
            description: post.excerpt ?? "News update from Greenalaya Nepal",
            path: `/news/${post.slug}`,
            datePublished: post.published_at,
          })}
        />
        <main className="overflow-hidden pb-20 pt-20 md:pt-24">
          <article>
            <header className="relative bg-[#07150b] text-white">
              <div className="absolute inset-0">
                <Image
                  src={butterflyStoryImages.hero}
                  alt="Two participants using binoculars to observe butterflies in Godawari forest"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="100vw"
                  className="object-cover object-center opacity-45"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,18,8,0.96)_0%,rgba(4,18,8,0.76)_48%,rgba(4,18,8,0.2)_100%)]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07150b]/90 via-transparent to-transparent" />
              </div>

              <div className="relative mx-auto flex min-h-[480px] max-w-7xl flex-col justify-between px-5 py-10 sm:min-h-[560px] sm:px-8 md:min-h-[680px] md:py-14 lg:px-10">
                <Link
                  href="/news"
                  className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-white/20 bg-black/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/10"
                >
                  <ArrowLeft className="size-4" aria-hidden /> All news
                </Link>

                <div className="max-w-4xl pb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8bd88f]">
                    Community conservation
                  </p>
                  <h1 className="mt-5 font-display text-[clamp(2.35rem,5.4vw,4.9rem)] font-bold leading-[0.96] tracking-[-0.045em] text-white">
                    Greenalaya Nepal’s Godawari Butterfly Watch Records 46+ Species
                  </h1>
                  <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
                    Greenalaya Nepal brings together over 45 nature enthusiasts for a day of citizen
                    science, discovery, and shared wonder.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/72">
                    {post.published_at ? (
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="size-4 text-[#8bd88f]" />
                        {formatDate(post.published_at)}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="size-4 text-[#8bd88f]" />
                      Godawari, Nepal
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-[#8bd88f]" />4 min read
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <section className="border-b border-border bg-secondary/70">
              <div className="mx-auto grid max-w-6xl grid-cols-3 gap-px bg-border">
                {[
                  { icon: Users, value: "45+", label: "participants" },
                  { icon: Binoculars, value: "46+", label: "species recorded" },
                  { icon: Sparkles, value: "2", label: "rare highlights" },
                ].map(({ icon: Icon, value, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 bg-secondary/95 px-7 py-6 max-sm:flex-col max-sm:gap-2 max-sm:px-2 max-sm:py-5 max-sm:text-center sm:max-lg:flex-col sm:max-lg:gap-3 sm:max-lg:px-4 sm:max-lg:py-5 sm:max-lg:text-center sm:justify-center"
                  >
                    <Icon className="size-5 text-primary sm:size-6" aria-hidden />
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 md:py-20 lg:grid-cols-[minmax(0,1fr)_15rem] lg:px-10">
              <div className="max-w-3xl">
                <p className="font-display text-2xl font-medium leading-9 text-foreground sm:text-3xl sm:leading-[1.4]">
                  In a celebrated effort to promote biodiversity awareness and citizen science,
                  Greenalaya Nepal successfully hosted a highly engaging butterfly-watching program
                  in the ecologically rich region of Godawari.
                </p>

                <div className="mt-10 space-y-7 text-[1.075rem] leading-8 text-muted-foreground">
                  <p>
                    Organized in collaboration with Butterfly Watchers Nepal, TinyLife Finders, and
                    the Club for Wildlife Conservation (CWC), the event drew an enthusiastic crowd
                    of more than 45 nature lovers and conservation enthusiasts.
                  </p>
                  <p>
                    The day’s activities were expertly led by{" "}
                    <a
                      href="https://www.facebook.com/mslimbu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                      Mr. Mahendra Singh Limbu
                    </a>
                    , who also serves as an advisor to Greenalaya Nepal. After the field
                    observation, Mr. Limbu delivered an insightful presentation that equipped
                    attendees with knowledge of butterfly ecology, behavior, and field
                    identification techniques. His guidance helped participants reflect on their
                    sightings and deepen their understanding of the biodiversity they had
                    encountered in Godawari’s lush natural habitat.
                  </p>
                </div>

                <figure className="my-12">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
                    <Image
                      src={butterflyStoryImages.briefing}
                      alt="Mahendra Singh Limbu briefing participants before the field observation"
                      fill
                      sizes="(min-width: 1024px) 760px, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">
                    Mr. Mahendra Singh Limbu shares field identification guidance with participants
                    before the observation walk.
                  </figcaption>
                </figure>

                <div className="space-y-7 text-[1.075rem] leading-8 text-muted-foreground">
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    A remarkable day in the field
                  </h2>
                  <p>
                    The expedition yielded remarkable results: the group recorded over{" "}
                    <strong className="font-semibold text-foreground">
                      46 distinct species of butterflies
                    </strong>
                    . Among the sightings were two rare and seldom-seen species, the Great
                    Hockeystick Sailer and the Scarce Lilacfork, bringing immense excitement to
                    amateur watchers and seasoned experts alike.
                  </p>
                  <blockquote className="border-l-4 border-primary bg-secondary px-6 py-5 font-display text-xl font-medium leading-8 text-foreground sm:text-2xl">
                    Every observation adds to our shared understanding of Nepal’s biodiversity, and
                    every new observer strengthens the community protecting it.
                  </blockquote>
                  <p>
                    The event was further honored by the presence of distinguished guests{" "}
                    <a
                      href="https://www.facebook.com/hemsagar.baral.9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                      Mr. Hem Sagar Baral
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.facebook.com/rajendra.gurung.585"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                    >
                      Mr. Rajendra Gurung
                    </a>
                    . Their participation underscored the importance of community-driven
                    conservation and wildlife observation efforts in Nepal.
                  </p>
                  <p>
                    Greenalaya Nepal extends its deepest gratitude to all participants, esteemed
                    guests, and partner organizations for their active involvement and for making
                    the program so fruitful.
                  </p>
                </div>
              </div>

              <aside
                className="h-fit rounded-2xl border border-border bg-card p-5 shadow-[0_14px_40px_rgba(13,55,22,0.06)] lg:sticky lg:top-28"
                aria-label="Article details"
              >
                <div>
                  <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                    In collaboration with
                  </p>
                  <ul className="mt-4 space-y-3 text-sm font-semibold leading-5 text-foreground">
                    <li className="flex gap-2.5">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>Butterfly Watchers Nepal</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>TinyLife Finders</span>
                    </li>
                    <li className="flex gap-2.5">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden
                      />
                      <span>Club for Wildlife Conservation (CWC)</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-7 border-t border-border pt-6">
                  <p className="text-[0.7rem] font-bold uppercase leading-5 tracking-[0.18em] text-muted-foreground">
                    Share this story
                  </p>
                  <div className="mt-4 grid gap-2 text-sm font-semibold text-primary">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                    >
                      Facebook
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                    >
                      LinkedIn
                    </a>
                    <a
                      href={`mailto:?subject=${shareText}&body=${encodeURIComponent(articleUrl)}`}
                      className="rounded-lg bg-secondary px-3 py-2.5 transition hover:bg-accent"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </aside>
            </div>

            <section
              className="bg-[#07150b] px-5 py-14 text-white sm:px-8 md:py-20 lg:px-10"
              aria-labelledby="gallery-heading"
            >
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#8bd88f]">
                      Field journal
                    </p>
                    <h2 id="gallery-heading" className="mt-3 font-display text-3xl font-bold sm:text-4xl">
                      A day of shared discovery
                    </h2>
                  </div>
                </div>
                <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-12">
                  {butterflyGallery.map((image) => (
                    <figure
                      key={image.src}
                      className={`group relative aspect-[3/2] overflow-hidden rounded-2xl ${image.className}`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1024px) 58vw, (min-width: 768px) 60vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-16">
                        <figcaption className="text-sm leading-6 text-white/85">
                          {image.caption}
                        </figcaption>
                      </div>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          </article>
        </main>
      </>
    );
  }

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt ?? "News update from Greenalaya Nepal",
          path: `/news/${post.slug}`,
          datePublished: post.published_at,
        })}
      />
      <PageShell
        title={post.title}
        description={
          post.excerpt ??
          (post.published_at ? (formatDate(post.published_at) ?? "News update") : "News update")
        }
      >
        <p className="mt-6">
          <Link href="/news" className="text-sm text-primary hover:underline">
            ← All news
          </Link>
        </p>

        {post.published_at ? (
          <p className="mt-2 text-sm text-muted-foreground">{formatDate(post.published_at)}</p>
        ) : null}

        {post.content ? (
          <div className="mt-6 whitespace-pre-wrap text-lg leading-relaxed text-foreground">
            {post.content}
          </div>
        ) : post.excerpt ? (
          <p className="mt-6 text-lg leading-relaxed text-foreground">{post.excerpt}</p>
        ) : (
          <p className="mt-6 text-muted-foreground">Content coming soon.</p>
        )}
      </PageShell>
    </>
  );
}
