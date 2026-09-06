import { seedCollaborators } from "@/lib/content/seed";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Collaborator } from "@/lib/types/collaborator";

export async function getCollaborators(): Promise<{
  members: Collaborator[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    console.warn(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local. Falling back to seed collaborator data.",
    );
    return {
      members: seedCollaborators,
      error: null,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collaborators")
    .select("id, name, slug, position, bio, photo_url")
    .order("name");

  if (error) {
    console.warn(
      "Could not load collaborators from Supabase. Falling back to seed data.",
      error.message,
    );
    return { members: seedCollaborators, error: null };
  }

  // Exclude our own logo, including the legacy partner placeholder.
  const members = (data ?? []).filter(
    (member) =>
      !/greenalaya/i.test(`${member.name} ${member.slug}`) &&
      !member.photo_url?.includes("/collaborators/partner-logo.png"),
  );
  if (members.length === 0) {
    return { members: seedCollaborators, error: null };
  }

  // Preserve the order logos were shared, even when database entries exist.
  const orderedCollaborators = seedCollaborators.map(
    (seed) => ({ ...seed, ...members.find((member) => member.slug === seed.slug) }),
  );
  const additionalCollaborators = members.filter(
    (member) => !seedCollaborators.some((seed) => seed.slug === member.slug),
  );

  return { members: [...orderedCollaborators, ...additionalCollaborators], error: null };
}
