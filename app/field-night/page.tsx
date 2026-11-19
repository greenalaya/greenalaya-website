import { FieldNightGame } from "@/components/field-night/field-night-game";
import { homeContainerClass } from "@/components/home/home-styles";
import { getNepalQuizGroups } from "@/lib/content/inaturalist";
import { pageMetadata } from "@/lib/seo";
import { pageTitleClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

/**
 * Field Night (/field-night): the homepage hero's moths and butterflies as a 60-second game, on a
 * page of its own while it is being tried out. Not indexed.
 */
export const metadata = pageMetadata({
  title: "Field Night",
  description:
    "Photograph moths at the lamp and count butterflies at the flower: real species recorded in Nepal.",
  path: "/field-night",
  noIndex: true,
});

// Same species refresh as Nature Detective.
export const revalidate = 300;
export const dynamic = "force-static";

export default async function FieldNightPage() {
  const groups = await getNepalQuizGroups();
  const moths = groups.find((group) => group.id === "moths")?.species ?? null;
  const butterflies = groups.find((group) => group.id === "butterflies")?.species ?? null;

  return (
    <main className="bg-home-ground text-home-ink">
      <div className={cn(homeContainerClass, "pt-28 pb-20 md:pt-32 md:pb-24")}>
        <h1 className={cn(pageTitleClass, "text-center text-home-ink")}>Field Night</h1>
        <p className="mx-auto mt-4 max-w-[52ch] text-center text-lg leading-relaxed text-home-ink">
          Photograph the moths that come to your lamp, or count the butterflies at your flower.
          Every species is a real one recorded in Nepal.
        </p>
        <div className="mt-8">
          <FieldNightGame moths={moths} butterflies={butterflies} />
        </div>
      </div>
    </main>
  );
}
