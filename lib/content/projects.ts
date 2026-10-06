import { fetchListWithFallback } from "@/lib/content/fetch-list-with-fallback";
import { getSeedProject, seedProjects } from "@/lib/content/seed";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Project } from "@/lib/types/project";

const projectColumns = "id, title, slug, description, image_url, created_at";

/**
 * Supabase's projects table carries legacy rows beyond the projects we
 * maintain (leftover thematic-area placeholders). Only seed projects are
 * published; a Supabase row may override a seed project by slug.
 */
export async function getProjectList(): Promise<Project[]> {
  const remoteProjects = await fetchListWithFallback<Project>({
    table: "projects",
    columns: projectColumns,
    orderColumn: "created_at",
    seed: seedProjects,
    label: "projects",
  });

  const remoteBySlug = new Map(remoteProjects.map((project) => [project.slug, project]));

  return seedProjects.map((project) => {
    const remote = remoteBySlug.get(project.slug);
    return remote
      ? { ...project, ...remote, image_url: remote.image_url ?? project.image_url }
      : project;
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const seed = getSeedProject(slug);
  if (!seed || !isSupabaseConfigured()) return seed;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(projectColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn(`Could not load project "${slug}" from Supabase. Using seed data.`, error.message);
    return seed;
  }

  return data ? { ...seed, ...data, image_url: data.image_url ?? seed.image_url } : seed;
}
