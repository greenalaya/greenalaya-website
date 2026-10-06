import { seedTeamMembers } from "@/lib/content/seed";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { TeamMember } from "@/lib/types/team";

const teamColumns = "id, name, slug, position, bio, photo_url, linkedin_url, website_url";

function isPlaceholderPhoto(url: string | null | undefined) {
  return !url || url.endsWith("/placeholder.jpg") || url.includes("/placeholder.jpg?");
}

/** A Supabase row overrides its seed member, keeping the seed photo when the row has none. */
function mergeWithSeed(member: TeamMember, seed: TeamMember | undefined): TeamMember {
  if (!seed) return member;
  return {
    ...seed,
    ...member,
    photo_url: isPlaceholderPhoto(member.photo_url) ? seed.photo_url : member.photo_url,
  };
}

export async function getTeamMembers(): Promise<{
  members: TeamMember[];
  error: string | null;
}> {
  if (!isSupabaseConfigured()) {
    console.warn(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local. Falling back to seed team data.",
    );
    return { members: seedTeamMembers, error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("team_members").select(teamColumns);

  if (error) {
    console.warn(
      "Could not load team_members from Supabase. Falling back to seed data.",
      error.message,
    );
    return { members: seedTeamMembers, error: null };
  }

  // Keep the curated seed order; database rows override by slug and any
  // members only in the database are appended.
  const rows: TeamMember[] = data ?? [];
  const rowsBySlug = new Map(rows.map((member) => [member.slug, member]));
  const ordered = seedTeamMembers.map((seed) =>
    mergeWithSeed(rowsBySlug.get(seed.slug) ?? seed, seed),
  );
  const extras = rows.filter(
    (member) => !seedTeamMembers.some((seed) => seed.slug === member.slug),
  );

  return { members: [...ordered, ...extras], error: null };
}

export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  const seed = seedTeamMembers.find((member) => member.slug === slug);

  if (!isSupabaseConfigured()) {
    return seed ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select(teamColumns)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.warn(
      `Could not load team member "${slug}" from Supabase. Using seed data.`,
      error.message,
    );
    return seed ?? null;
  }

  return data ? mergeWithSeed(data, seed) : (seed ?? null);
}
