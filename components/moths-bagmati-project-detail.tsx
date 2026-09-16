import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  FlaskConical,
  Leaf,
  MapPin,
  Users,
} from "lucide-react";
import { mothsBagmatiProject } from "@/lib/content/moths-bagmati-project";

const alignmentIcons = [FlaskConical, Users, Leaf] as const;

export function MothsBagmatiProjectDetail() {
  return (
    <main className="overflow-hidden bg-background">
      <section className="relative isolate min-h-[680px] overflow-hidden pt-20 sm:min-h-[720px]">
        <Image
          src={mothsBagmatiProject.heroImage}
          alt="A moth of Bagmati Province resting with wings spread"
          fill
          preload
          sizes="100vw"
          className="scale-[2.1] object-cover object-[48%_62%] sm:scale-[1.8] lg:scale-[1.55]"
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
              Citizen science &amp; biodiversity documentation
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Moonlight Dancer
              <span className="mt-2 block text-2xl font-normal leading-tight text-white/90 sm:text-3xl lg:text-4xl">
                Documenting the Moths of Bagmati Province
              </span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl">
              {mothsBagmatiProject.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-4 text-[#a8dc9d]" />
                Terai to the Central Himalayas, Bagmati Province
              </span>
              <span className="inline-flex items-center gap-2">
                <Camera aria-hidden="true" className="size-4 text-[#a8dc9d]" />
                Community-contributed photography
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Scaling up from a valley to a province
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            {mothsBagmatiProject.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="why-moths-heading"
        className="bg-secondary px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="why-moths-heading"
            className="max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Why Moths?
          </h2>
          <div className="mt-10 space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            {mothsBagmatiProject.whyMoths.map((paragraph) => (
              <p key={paragraph} className="max-w-4xl">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            How This Aligns With Greenalaya Nepal&apos;s Work
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            This project sits squarely within our core mission and strategic pillars.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {mothsBagmatiProject.alignment.map((point, index) => {
              const Icon = alignmentIcons[index];
              return (
                <div
                  key={point.pillar}
                  className="rounded-2xl border border-border bg-background p-6 sm:p-8"
                >
                  <Icon aria-hidden="true" className="size-6 text-primary" />
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                    {point.pillar}
                  </h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{point.description}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-10 leading-7 text-muted-foreground">
            It also speaks directly to two of our seven thematic focus areas:{" "}
            {mothsBagmatiProject.thematicAreas.map((area, index) => (
              <span key={area.title}>
                <span className="font-semibold text-foreground">{area.title}</span> (
                {area.note})
                {index < mothsBagmatiProject.thematicAreas.length - 1 ? " and " : "."}
              </span>
            ))}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="contributes-to-heading"
        className="bg-secondary px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="contributes-to-heading"
            className="max-w-3xl font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            What This Contributes To
          </h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2">
            {mothsBagmatiProject.contributesTo.map((point) => (
              <li
                key={point}
                className="flex gap-3.5 rounded-2xl border border-border bg-background p-6 text-base leading-7 text-muted-foreground"
              >
                <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Why your contribution matters
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
              Every submission is a verified data point
            </h2>
          </div>
          <div className="space-y-6 text-base leading-8 text-muted-foreground sm:text-lg">
            {mothsBagmatiProject.whyContribute.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="font-medium text-foreground">
              {mothsBagmatiProject.whyContribute.acknowledgment}
            </p>
            <p>{mothsBagmatiProject.whyContribute.closing}</p>
          </div>
        </div>
      </section>

      <section className="bg-[#102f1d] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#a8dc9d]">
            Contribute your moth photographs
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
            Submit your sightings
          </h2>
          <p className="mx-auto mt-6 max-w-2xl leading-7 text-white/80">
            Include the following details with every photograph so it can be recorded as a
            verified data point:
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {mothsBagmatiProject.submission.requiredInfo.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/90"
              >
                {item}
              </li>
            ))}
          </ul>
          <a
            href={mothsBagmatiProject.submission.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Camera aria-hidden="true" className="size-4" />
            Submit your moth photographs
          </a>
        </div>
      </section>
    </main>
  );
}
