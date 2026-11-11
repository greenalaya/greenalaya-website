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
const LEPIDOPTERA_TAXON_ID = 47157;
const REVALIDATE_SECONDS = 3600;

const researchQuery = `place_id=${NEPAL_PLACE_ID}&taxon_id=${LEPIDOPTERA_TAXON_ID}&quality_grade=research`;
const openLicences = new Set(["cc0", "cc-by", "cc-by-nc"]);

export type QuizSpecies = {
  id: number;
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

/** The most-recorded species in Nepal, each with its openly licensed iNaturalist photo. */
export async function getNepalTopSpecies(limit = 12): Promise<QuizSpecies[] | null> {
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
  }>(`/observations/species_counts?${researchQuery}&per_page=40`);

  const species: QuizSpecies[] = [];
  for (const { count, taxon } of data?.results ?? []) {
    const photo = taxon.default_photo;
    if (!photo?.medium_url || !openLicences.has(photo.license_code ?? "")) continue;
    species.push({
      id: taxon.id,
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
