import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButterflyProjectDetail } from "@/components/butterfly-project-detail";
import { ChinariProjectDetail } from "@/components/chinari-project-detail";
import { MothsBagmatiProjectDetail } from "@/components/moths-bagmati-project-detail";
import { PageShell } from "@/components/page-shell";
import { butterflyProject } from "@/lib/content/butterfly-project";
import { chinariProject } from "@/lib/content/chinari-project";
import { mothsBagmatiProject } from "@/lib/content/moths-bagmati-project";
import { getProjectBySlug } from "@/lib/content/projects";
import { seedProjects } from "@/lib/content/seed";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === butterflyProject.slug) {
    return pageMetadata({
      title: butterflyProject.title,
      description: butterflyProject.summary,
      path: `/projects/${butterflyProject.slug}`,
    });
  }

  if (slug === chinariProject.slug) {
    return pageMetadata({
      title: chinariProject.title,
      description: chinariProject.summary,
      path: `/projects/${chinariProject.slug}`,
    });
  }

  if (slug === mothsBagmatiProject.slug) {
    return pageMetadata({
      title: mothsBagmatiProject.title,
      description: mothsBagmatiProject.summary,
      path: `/projects/${mothsBagmatiProject.slug}`,
    });
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    return pageMetadata({
      title: "Project not found",
      description: "Greenalaya Nepal project",
      noIndex: true,
    });
  }

  return pageMetadata({
    title: project.title,
    description: project.description ?? "Greenalaya Nepal project",
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  if (slug === butterflyProject.slug) {
    return <ButterflyProjectDetail />;
  }

  if (slug === chinariProject.slug) {
    return <ChinariProjectDetail />;
  }

  if (slug === mothsBagmatiProject.slug) {
    return <MothsBagmatiProjectDetail />;
  }

  return (
    <PageShell title={project.title} description="Greenalaya Nepal project">
      <p className="mt-6">
        <Link href="/projects" className="text-sm text-primary hover:underline">
          ← All projects
        </Link>
      </p>

      {project.description ? (
        <p className="mt-6 text-lg leading-relaxed text-foreground">{project.description}</p>
      ) : (
        <p className="mt-6 text-muted-foreground">No description yet.</p>
      )}
    </PageShell>
  );
}
