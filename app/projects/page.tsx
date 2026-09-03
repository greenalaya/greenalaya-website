import Image from "next/image";
import Link from "next/link";
import { butterflyProject } from "@/lib/content/butterfly-project";
import { fetchListWithFallback } from "@/lib/content/fetch-list-with-fallback";
import { seedProjects } from "@/lib/content/seed";
import { pageMetadata } from "@/lib/seo";
import type { Project } from "@/lib/types/project";

export const metadata = pageMetadata({
  title: "Our Projects",
  description: "Greenalaya Nepal's conservation, research, and innovation programs.",
  path: "/projects",
});

export const revalidate = 300;
export const dynamic = "force-static";

async function getProjects(): Promise<Project[]> {
  const projects = await fetchListWithFallback<Project>({
    table: "projects",
    columns: "id, title, slug, description, image_url",
    orderColumn: "title",
    seed: seedProjects,
    label: "projects",
  });

  const butterfly = projects.find((project) => project.slug === butterflyProject.slug);

  return butterfly
    ? [
        {
          ...butterfly,
          title: "Kathmandu Valley Butterfly Documentation",
          image_url: butterfly.image_url ?? "/images/projects/godawari-butterfly-watch.webp",
        },
      ]
    : seedProjects.filter((project) => project.slug === butterflyProject.slug);
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="bg-background px-5 pt-28 pb-20 sm:px-6 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Our work</p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Our Projects
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            Greenalaya Nepal&apos;s conservation, research, and innovation programs.
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {projects.map((project) => (
            <li key={project.id}>
              <article className="group">
                <Link href={`/projects/${project.slug}`} className="block no-underline">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : null}
                  </div>
                  <h2 className="mt-4 font-display text-lg leading-snug font-normal text-foreground transition group-hover:text-primary sm:text-xl">
                    {project.title}
                  </h2>
                  {project.description ? (
                    <p className="mt-2 text-base leading-7 text-muted-foreground">
                      {project.description}
                    </p>
                  ) : null}
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
