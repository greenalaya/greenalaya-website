import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Camera, CheckCircle2, FileText, MapPin } from "lucide-react";
import { butterflyProject } from "@/lib/content/butterfly-project";

const guideFeatures = [
  "Common and scientific species names",
  "Observation dates and locations",
  "Photographer credits for every image",
  "Butterfly anatomy and life-cycle graphics",
  "Hotspot and observation-location maps",
  "Searchable, smartphone-friendly format",
] as const;

export function ButterflyProjectDetail() {
  return (
    <main className="overflow-hidden bg-background">
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
          <div className="max-w-5xl py-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a8dc9d]">
              Citizen science &amp; urban biodiversity
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Winged Wonders
              <span className="mt-2 block text-2xl font-normal leading-tight text-white/90 sm:text-3xl lg:text-4xl xl:text-[2.75rem] lg:whitespace-nowrap">
                Documenting the Butterflies of Kathmandu Valley
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl">
              {butterflyProject.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4 text-[#a8dc9d]" />
                Kathmandu, Lalitpur &amp; Bhaktapur
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
          </div>
          <p className="text-xs text-white/65 text-right">
            Cover photograph: Blue Pansy by Ruman Shrestha
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Why it began
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Turning observations into accessible knowledge
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            <p>
              Butterflies are among the most visible and engaging members of Kathmandu Valley&apos;s
              biodiversity, yet many observations remain scattered across personal photographs and
              social media. Without a species name, date, or location, a beautiful image has limited
              value as a learning resource.
            </p>
            <p>
              Greenalaya Nepal and TinyLife Finders created this initiative to make those encounters
              more useful. By bringing photographs together, checking identifications, preserving
              observation details, and crediting every contributor, the project transformed
              individual records into a free field guide for students, researchers, educators, and
              nature enthusiasts.
            </p>
          </div>
        </div>
      </section>

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
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <MapPin aria-hidden="true" className="size-5 text-[#a8dc9d]" />
                <h3 className="text-xl font-semibold">34 observation locations</h3>
              </div>
              <div className="mt-7 grid grid-cols-3 gap-3">
                {butterflyProject.locations.map((location) => (
                  <div key={location.district}>
                    <p className="text-2xl font-bold sm:text-3xl">{location.count}</p>
                    <p className="mt-1 text-lg font-medium leading-snug text-white/85 sm:text-xl whitespace-nowrap">
                      {location.district}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Camera aria-hidden="true" className="size-5 text-[#a8dc9d]" />
                <h3 className="text-xl font-semibold">Six butterfly families</h3>
              </div>
              <p className="mt-5 leading-7 text-white/70">
                The guide represents Hesperiidae, Lycaenidae, Nymphalidae, Papilionidae, Pieridae,
                and Riodinidae across six mapped hotspot areas.
              </p>
            </div>
          </div>
        </div>
      </section>

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
            {butterflyProject.process.map((step) => (
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
              The 134-page guide makes local butterfly identification more approachable by pairing
              multiple photographic views with useful field information.
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
            <Link
              href={butterflyProject.publicationHref}
              className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <BookOpen aria-hidden="true" className="size-4" />
              View the publication
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Built together
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              A community effort, carefully credited
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            <p>
              Greenalaya Nepal and TinyLife Finders combined conservation research, nature
              observation, photography, species identification, mapping, and publication design to
              create this open resource.
            </p>
            <p>
              Ten photographers contributed images. Mahendra Singh Limbu, Bimal Raj Shrestha, and
              Sanej Prasad Suwal supported species identification, while Mahesh Bajracharya and
              Prasan Shrestha made significant photographic contributions. The initiative also
              recognizes Ruman Shrestha&apos;s key role in bringing the publication to life.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
