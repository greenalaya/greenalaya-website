/**
 * Nepal's most-recorded butterflies and moths, from iNaturalist's public API, for the hero's
 * "Can you name this species?" quiz.
 *
 * Counts are research-grade records only (identification confirmed by the community), and only
 * photos with an open licence (CC0, CC BY or CC BY-NC) are used, each shown with its
 * photographer's credit. Refreshed at most once an hour; any failure returns null, and the
 * hero then leaves the quiz out.
 */

const API = "https://api.inaturalist.org/v1";
const NEPAL_PLACE_ID = 7335;
const REVALIDATE_SECONDS = 3600;

const openLicences = new Set(["cc0", "cc-by", "cc-by-nc"]);

export type QuizSpecies = {
  id: number;
  /** The quiz group it belongs to (see quizGroups), when the quiz mixes groups. */
  group?: QuizGroupId;
  name: string;
  scientificName: string;
  count: number;
  photo: { src: string; credit: string; license: string };
  url: string;
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(5000),
      headers: { Accept: "application/json" },
    });
    return response.ok ? ((await response.json()) as T) : null;
  } catch {
    return null;
  }
}

/** "(c) Yukta, some rights reserved (CC BY-NC)" → "Yukta". */
function photographer(attribution: string | undefined) {
  return (
    (attribution ?? "")
      .replace(/^\(c\)\s*/i, "")
      .replace(/,?\s*(some|all|no) rights reserved.*$/i, "")
      .replace(/\s*\(CC[^)]*\)\s*$/i, "")
      .trim() || "an iNaturalist observer"
  );
}

/**
 * The groups the species quiz covers. Each is an iNaturalist taxon in Nepal, research-grade
 * records only. Fireflies have no `query`: Nepal has too few firefly records with usable photos
 * (none confirmed yet) for a fair quiz, so the quiz shows them as coming soon.
 */
export const quizGroups = [
  { id: "butterflies", label: "Butterflies", one: "butterfly", query: "taxon_id=47224" },
  { id: "moths", label: "Moths", one: "moth", query: "taxon_id=47157&without_taxon_id=47224" },
  { id: "fireflies", label: "Fireflies", one: "firefly", query: null },
  { id: "bees", label: "Bees", one: "bee", query: "taxon_id=630955" },
  { id: "dragonflies", label: "Dragonflies", one: "dragonfly", query: "taxon_id=47792" },
  { id: "birds", label: "Birds", one: "bird", query: "taxon_id=3" },
] as const;

export type QuizGroupId = (typeof quizGroups)[number]["id"];

export type QuizGroup = {
  id: QuizGroupId;
  label: string;
  /** One of them, for the quiz's question ("Can you name this butterfly?"). */
  one: string;
  /** Null when there aren't enough species with usable photos (the group is "coming soon"). */
  species: QuizSpecies[] | null;
};

/** Every quiz group with its most-recorded species in Nepal, fetched side by side. */
export async function getNepalQuizGroups(limit = 20): Promise<QuizGroup[]> {
  return Promise.all(
    quizGroups.map(async (group) => ({
      id: group.id,
      label: group.label,
      one: group.one,
      species: group.query
        ? await getNepalSpecies(
            `place_id=${NEPAL_PLACE_ID}&${group.query}&quality_grade=research`,
            limit,
            group.id,
          )
        : null,
    })),
  );
}

/** The most-recorded species for a query, each with its openly licensed iNaturalist photo. */
async function getNepalSpecies(
  query: string,
  limit: number,
  group?: QuizGroupId,
): Promise<QuizSpecies[] | null> {
  const data = await getJson<{
    results?: {
      count: number;
      taxon: {
        id: number;
        name: string;
        preferred_common_name?: string | null;
        default_photo?: {
          medium_url?: string;
          attribution?: string;
          license_code?: string | null;
        } | null;
      };
    }[];
  }>(`/observations/species_counts?${query}&per_page=40`);

  const species: QuizSpecies[] = [];
  for (const { count, taxon } of data?.results ?? []) {
    const photo = taxon.default_photo;
    if (!photo?.medium_url || !openLicences.has(photo.license_code ?? "")) continue;
    species.push({
      id: taxon.id,
      ...(group ? { group } : {}),
      name: taxon.preferred_common_name ?? taxon.name,
      scientificName: taxon.name,
      count,
      photo: {
        src: photo.medium_url,
        credit: photographer(photo.attribution),
        license: (photo.license_code ?? "").toUpperCase().replace(/^CC-/, "CC "),
      },
      url: `https://www.inaturalist.org/taxa/${taxon.id}`,
    });
    if (species.length === limit) break;
  }
  // The quiz needs a few species to choose wrong answers from.
  return species.length >= 6 ? species : null;
}
