import { seedResearch } from "@/lib/content/seed";
import {
  defaultPublicationCover,
  getPublicationMetadata,
  publicationCovers,
  resolvePublicationPdfUrl,
  type PublicationMetadata,
} from "@/lib/site";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Research } from "@/lib/types/research";

export type PublicationCard = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  pdfUrl: string;
  abstract: string | null;
  publishedDateIso: string | null;
  metadata: PublicationMetadata | null;
};

export type PublicationDetail = PublicationCard;

const researchColumns = "id, title, slug, abstract, pdf_url, published_date";

function publicationYear(value: string | null) {
  return (value ? new Date(value) : new Date()).getFullYear().toString();
}

function toPublicationCard(item: Research): PublicationCard | null {
  const pdfUrl = resolvePublicationPdfUrl(item.pdf_url);
  if (!pdfUrl) return null;

  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    coverImage: publicationCovers[item.slug] ?? defaultPublicationCover,
    pdfUrl,
    abstract: item.abstract,
    publishedDateIso: item.published_date,
    metadata: getPublicationMetadata(item.slug, publicationYear(item.published_date)),
  };
}

function toPublicationCards(items: Research[]): PublicationCard[] {
  return [...items]
    .sort(
      (a, b) =>
        new Date(b.published_date ?? 0).getTime() - new Date(a.published_date ?? 0).getTime(),
    )
    .map(toPublicationCard)
    .filter((item): item is PublicationCard => item !== null);
}

/**
 * Seed publications stay listed until they are added to Supabase; a Supabase
 * row with the same slug takes precedence.
 */
export async function getPublications(): Promise<PublicationCard[]> {
  if (!isSupabaseConfigured()) {
    return toPublicationCards(seedResearch);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("research").select(researchColumns);

  if (error) {
    console.warn(
      "Could not load research from Supabase. Falling back to seed data.",
      error.message,
    );
    return toPublicationCards(seedResearch);
  }

  const rowsBySlug = new Map(seedResearch.map((item) => [item.slug, item]));
  (data ?? []).forEach((item) => rowsBySlug.set(item.slug, item));

  return toPublicationCards([...rowsBySlug.values()]);
}

export async function getPublicationBySlug(slug: string): Promise<PublicationDetail | null> {
  const seed = seedResearch.find((item) => item.slug === slug);

  if (!isSupabaseConfigured()) {
    return seed ? toPublicationCard(seed) : null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("research")
    .select(researchColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return seed ? toPublicationCard(seed) : null;
  }

  return toPublicationCard(data);
}
