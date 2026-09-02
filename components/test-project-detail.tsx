import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Camera,
  CheckCircle2,
  Download,
  FileText,
  MapPin,
} from "lucide-react";
import { butterflyProject } from "@/lib/content/butterfly-project";

const guideFeatures = [
  "High-resolution dorsal and ventral wing photographs",
  "Binomial scientific names and recognized common names",
  "Precise observation dates, elevations, and habitats",
  "Butterfly anatomy, venation, and life-cycle diagrams",
  "Hotspot distribution summaries across 34 survey sites",
  "Free, mobile-friendly PDF reference for field study",
] as const;

const hotspotsList = [
  {
    district: "Kathmandu (22 Sites)",
    examples:
      "Shivapuri-Nagarjun foothills, Budhanilkantha, Sundarijal, Swayambhu ravines, Balaju wetlands",
  },
  {
    district: "Lalitpur (6 Sites)",
    examples:
      "Godawari Botanical Garden, Phulchowki base, Chapagaun & Lele valleys, Taudaha buffer",
  },
  {
    district: "Bhaktapur (6 Sites)",
    examples:
      "Suryabinayak green belt, Changunarayan forest edge, Pilot Baba trail, Nagarkot ridge",
  },
] as const;

const familiesList = [
  {
    name: "Nymphalidae",
    common: "Brush-footed Butterflies",
    desc: "Pansies, Admirals, and Emperors active in sunlit forest gaps.",
  },
  {
    name: "Papilionidae",
    common: "Swallowtails & Birdwings",
    desc: "Large, vibrant montane species recorded along ridge corridors.",
  },
  {
    name: "Pieridae",
    common: "Whites & Yellows",
    desc: "Abundant across open grasslands, gardens, and agricultural fringes.",
  },
  {
    name: "Lycaenidae",
    common: "Blues & Hairstreaks",
    desc: "Intricate micro-species inhabiting grassy understories and scrub.",
  },
  {
    name: "Hesperiidae",
    common: "Skippers",
    desc: "Fast, darting flyers frequenting shady streams and moist forest leaf-litter.",
  },
  {
    name: "Riodinidae",
    common: "Metalmarks",
    desc: "Distinctive woodland butterflies featuring iridescent reflective markings.",
  },
] as const;

const methodologySteps = [
  {
    number: "01",
    title: "Field Documentation",
    description:
      "Grassroots naturalists and photographers conducted non-invasive, in-situ observations capturing dorsal and ventral wing profiles across seasons.",
  },
  {
    number: "02",
    title: "Taxonomic Validation",
    description:
      "Every photograph was cross-referenced with regional entomological keys and verified by seasoned Nepali butterfly taxonomists.",
  },
  {
    number: "03",
    title: "Geo-Spatial Mapping",
    description:
      "Records were catalogued with precise GPS coordinates, dates, altitudes, and habitat classifications across 34 valley locations.",
  },
  {
    number: "04",
    title: "Open-Access Publishing",
    description:
      "Compiled into a free 134-page pictorial field guide formatted for smartphones, tablets, and print reference in schools and research labs.",
  },
] as const;

export function TestProjectDetail() {
  return (
    <main className="overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative isolate min-h-[680px] overflow-hidden pt-20 sm:min-h-[720px]">
        <Image
          src={butterflyProject.heroImage}
          alt="Blue Pansy butterfly resting on a yellow flower"
          fill
          preload
          sizes="100vw"
          className="scale-[1.45] object-cover object-center sm:scale-125 lg:scale-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,24,12,0.94)_0%,rgba(7,24,12,0.75)_48%,rgba(7,24,12,0.32)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,24,12,0.72)_0%,transparent_48%)]" />

        <div className="relative mx-auto flex min-h-[600px] max-w-7xl flex-col justify-between px-5 py-12 sm:min-h-[640px] sm:px-8 sm:py-16 lg:px-12">
          <Link
            href="/projects"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/85 transition hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> All projects
          </Link>

          <div className="max-w-4xl py-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a8dc9d]">
              Citizen science &amp; urban biodiversity
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Winged Wonders
              <span className="mt-2 block text-2xl font-normal leading-tight text-white/90 sm:text-4xl lg:text-5xl">
                Documenting the Butterflies of Kathmandu Valley
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl">
              A Greenalaya Nepal and TinyLife Finders initiative transforming community photographs
              and field observations into an open, peer-reviewed guide to Kathmandu Valley&apos;s
              butterfly diversity.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4 text-[#a8dc9d]" />
                Kathmandu · Lalitpur · Bhaktapur
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpen aria-hidden="true" className="size-4 text-[#a8dc9d]" />
                Published April 2026
              </span>
              <span className="inline-flex items-center gap-2">
                <FileText aria-hidden="true" className="size-4 text-[#a8dc9d]" />
                ISBN: 9789905-0-0219-7
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/publications/butterfly_images_of_kathmandu_valley.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <Download aria-hidden="true" className="size-4" />
                Download Field Guide (PDF)
              </a>
              <Link
                href="/publications/butterfly-images-kathmandu-valley"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-xs transition hover:bg-white/20"
              >
                <BookOpen aria-hidden="true" className="size-4" />
                View Publication Details
              </Link>
            </div>
          </div>

          <p className="text-xs text-white/65">
            Cover photograph: Blue Pansy (<em>Junonia orithya</em>) · Ruman Shrestha
          </p>
        </div>
      </section>

      {/* Why It Began / Urban Ecology Section */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Why it began
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Butterflies as bioindicators in a changing valley
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            <p>
              Kathmandu Valley is a unique geographic bowl spanning altitudinal gradients from 1,300
              meters on the valley floor to over 2,700 meters on surrounding ridges. This topography
              creates diverse microclimates supporting rich insect life. Yet, as urban sprawl
              accelerates and open green patches shrink, local pollinators face severe habitat
              pressures.
            </p>
            <p>
              Because butterflies are highly sensitive to microclimatic changes and plant diversity,
              documenting their presence provides vital data on urban ecological health. Greenalaya
              Nepal and TinyLife Finders launched this initiative to organize thousands of scattered
              field photographs into a rigorous, open-access pictorial guide that empowers students,
              researchers, and citizens to recognize and protect local biodiversity.
            </p>
          </div>
        </div>
      </section>

      {/* Project Impact / Dark Green Section */}
      <section
        aria-labelledby="impact-heading"
        className="bg-[#102f1d] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a8dc9d]">
            Project impact
          </p>
          <h2
            id="impact-heading"
            className="mt-4 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl lg:whitespace-nowrap"
          >
            Butterfly photographs of Kathmandu Valley
          </h2>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 lg:grid-cols-4">
            {butterflyProject.metrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col bg-[#173d27] px-5 py-8 sm:px-8 sm:py-10"
              >
                <dt className="text-lg sm:text-xl font-medium leading-snug text-white/85 whitespace-nowrap">
                  {metric.label}
                </dt>
                <dd className="order-first mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Survey Locations Card */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="size-5 text-[#a8dc9d]" />
                <h3 className="text-xl font-semibold">34 Observation Locations</h3>
              </div>
              <div className="mt-6 space-y-4">
                {hotspotsList.map((item) => (
                  <div
                    key={item.district}
                    className="border-t border-white/10 pt-3 first:border-0 first:pt-0"
                  >
                    <p className="text-sm font-semibold text-[#a8dc9d]">{item.district}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/75 sm:text-sm">
                      {item.examples}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Families Card */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Camera aria-hidden="true" className="size-5 text-[#a8dc9d]" />
                <h3 className="text-xl font-semibold">Six Butterfly Families</h3>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {familiesList.map((fam) => (
                  <div
                    key={fam.name}
                    className="rounded-xl bg-white/[0.04] p-3 border border-white/10"
                  >
                    <p className="text-sm font-bold text-white">{fam.name}</p>
                    <p className="text-xs text-[#a8dc9d]">{fam.common}</p>
                    <p className="mt-1 text-[11px] leading-snug text-white/65">{fam.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach / Process Section */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Our approach</p>
          <h2 className="mt-4 max-w-4xl text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:whitespace-nowrap">
            From field observation to field guide
          </h2>
          <p className="mt-6 max-w-5xl text-lg leading-8 text-muted-foreground lg:whitespace-nowrap">
            A collaborative four-step citizen science workflow connecting naturalists,
            entomologists, and digital open-access tools.
          </p>
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {methodologySteps.map((step) => (
              <li key={step.number} className="flex flex-col">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl font-bold text-primary">
                    {parseInt(step.number, 10)}
                  </span>
                  <h3 className="text-2xl font-semibold text-foreground">{step.title}</h3>
                </div>
                <div className="mt-3.5 border-b-2 border-primary" />
                <p className="mt-4 leading-7 text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The Outcome Section with Book Specs & Citation */}
      <section className="bg-secondary px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto aspect-[781/765] w-full max-w-[560px] overflow-hidden rounded-[2rem] bg-muted shadow-2xl shadow-black/10">
            <Image
              src={butterflyProject.heroImage}
              alt="Cover artwork for the Butterfly Images of Kathmandu Valley mobile guide"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">The outcome</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:whitespace-nowrap">
              A field guide made for discovery
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              The 134-page guide makes local butterfly identification approachable by pairing
              multi-angle photographic views with precise seasonal and habitat information.
            </p>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {guideFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm leading-6 text-foreground"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-primary"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Academic citation box */}
            <div className="mt-8 rounded-2xl border bg-background/80 p-4 text-xs text-muted-foreground backdrop-blur-xs">
              <p className="font-semibold text-foreground mb-1">Recommended Citation:</p>
              <p className="font-mono text-[11px] leading-relaxed select-all">
                Greenalaya Nepal &amp; TinyLife Finders. (2026).{" "}
                <em>Butterfly Images of Kathmandu Valley: A Field Photographic Guide</em> (1st ed.,
                p. 134). Kathmandu, Nepal. ISBN: 9789905-0-0219-7.
              </p>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/publications/butterfly_images_of_kathmandu_valley.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Download aria-hidden="true" className="size-4" />
                Download PDF (Free)
              </a>
              <Link
                href={butterflyProject.publicationHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-input bg-background px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <BookOpen aria-hidden="true" className="size-4" />
                View publication
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Built Together / Credits Section */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Built together
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              A community effort, carefully credited
            </h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground sm:text-lg">
              Greenalaya Nepal and TinyLife Finders combined conservation research, nature
              observation, photography, species identification, mapping, and publication design to
              create this open resource.
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Initiative Lead &amp; Design
                </p>
                <p className="mt-2 text-base font-bold text-foreground">Ruman Shrestha</p>
                <p className="text-xs text-muted-foreground">
                  TinyLife Finders &amp; Greenalaya Nepal
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Taxonomic Identification &amp; Review
                </p>
                <ul className="mt-2 space-y-1 text-sm font-semibold text-foreground">
                  <li>Mahendra Singh Limbu</li>
                  <li>Bimal Raj Shrestha</li>
                  <li>Sanej Prasad Suwal</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Contributing Photographers
              </p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Special photographic contributions by{" "}
                <strong className="text-foreground">Mahesh Bajracharya</strong> and{" "}
                <strong className="text-foreground">Prasan Shrestha</strong>, alongside 8 fellow
                naturalists who generously contributed field sightings across Kathmandu, Lalitpur,
                and Bhaktapur.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-foreground text-sm">
                  Documented an unrecorded butterfly species in the valley?
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share your sightings with our conservation team for future editions.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Submit Observation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
