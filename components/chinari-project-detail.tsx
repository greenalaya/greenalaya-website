import Image from "next/image";
import { ProjectStatusTag } from "@/components/project-status-tag";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Database,
  Network,
  Radar,
  ShieldAlert,
  Tags,
  Users,
} from "lucide-react";
import { chinariProject } from "@/lib/content/chinari-project";
import { pageTitleClass, sectionTitleClass } from "@/lib/typography";

const whyItMattersIcons = [Camera, ShieldAlert, Users, Network] as const;
const howItWorksIcons = [Camera, Radar, Tags, CheckCircle2, Database] as const;

export function ChinariProjectDetail() {
  const subtitle = chinariProject.title.replace(/^Chinari:\s*/, "");

  return (
    <main className="overflow-hidden bg-background">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(135deg,#0c2116_0%,#123120_55%,#0a1c12_100%)] pt-20">
        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <Link
            href="/projects"
            className="-my-2.5 inline-flex min-h-11 w-fit items-center gap-2 py-2.5 text-sm font-semibold text-white/85 transition hover:text-white"
          >
            <ArrowLeft aria-hidden="true" className="size-4" /> All projects
          </Link>
          <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <ProjectStatusTag slug={chinariProject.slug} className="mb-5" />
              <h1 className={`${pageTitleClass} text-white`}>
                {chinariProject.shortTitle}
                <span className="mt-2 block text-2xl leading-tight font-normal text-white/90 sm:text-3xl lg:text-4xl">
                  {subtitle}
                </span>
              </h1>
              <p className="mt-7 text-base leading-relaxed text-white/85 sm:text-xl">
                {chinariProject.summary}
              </p>
            </div>
            <div className="flex justify-center lg:shrink-0 lg:justify-end">
              <Image
                src="/images/projects/chinari-logo-dark.png"
                alt="Chinari logo"
                width={1200}
                height={655}
                className="h-40 w-auto sm:h-52 lg:h-64"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <h2 className={`${sectionTitleClass} text-foreground`}>
              Structured biodiversity intelligence, built on human validation
            </h2>
          </div>
          <ul className="space-y-5">
            {chinariProject.mission.map((point) => (
              <li
                key={point}
                className="flex gap-3.5 text-base leading-7 text-muted-foreground sm:text-lg"
              >
                <CheckCircle2 aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="why-it-matters-heading"
        className="bg-secondary px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <h2
            id="why-it-matters-heading"
            className={`${sectionTitleClass} max-w-3xl text-foreground`}
          >
            Why This Matters
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {chinariProject.whyItMatters.map((point, index) => {
              const Icon = whyItMattersIcons[index];
              return (
                <div
                  key={point.title}
                  className="rounded-2xl border border-border bg-background p-6 sm:p-8"
                >
                  <Icon aria-hidden="true" className="size-6 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold text-foreground">{point.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className={`${sectionTitleClass} max-w-3xl text-foreground`}>How It Works</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            From field capture to a trusted biodiversity record, in five stages.
          </p>
          <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {chinariProject.howItWorks.map((step, index) => {
              const Icon = howItWorksIcons[index];
              return (
                <li key={step.title} className="flex flex-col">
                  <Icon aria-hidden="true" className="size-6 text-primary" />
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {index + 1}. {step.title}
                  </h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    </main>
  );
}
