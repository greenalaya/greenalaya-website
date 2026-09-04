import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButterflyProjectDetail } from "@/components/butterfly-project-detail";
import { PageShell } from "@/components/page-shell";
import { butterflyProject } from "@/lib/content/butterfly-project";
import { getSeedProject } from "@/lib/content/seed";
import { pageMetadata } from "@/lib/seo";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const revalidate = 300;
export const dynamic = "force-static";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function loadProject(slug: string) {
  let project = getSeedProject(slug);

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, slug, description, image_url, created_at")
      .eq("slug", slug)
      .maybeSingle();

    if (!error && data) {
      project = data;
    }
  }

  return project;
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

  const project = await loadProject(slug);

  if (!project) {
    return pageMetadata({
      title: "Projects",
      description: "Greenalaya Nepal project",
      path: `/projects/${slug}`,
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
  const project = await loadProject(slug);

  if (!project) {
    notFound();
  }

  if (slug === butterflyProject.slug) {
    return <ButterflyProjectDetail />;
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
