import { homeContainerClass } from "@/components/home/home-styles";
import { QuizPicker } from "@/components/quiz/quiz-picker";
import { getNepalQuizGroups } from "@/lib/content/inaturalist";
import { natureDetectivePath } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { pageTitleClass } from "@/lib/typography";
import { cn } from "@/lib/utils";

/**
 * Nature Detective: pick a group (butterflies, moths, fireflies, bees, dragonflies, birds),
 * then a level, and name the species in each photo. The photos are live from iNaturalist. Not indexed yet.
 */
export const metadata = pageMetadata({
  title: "Nature Detective",
  description: "Can you name the butterflies, moths, bees, dragonflies and birds of Nepal?",
  path: natureDetectivePath,
  noIndex: true,
});

export const revalidate = 300;
export const dynamic = "force-static";

export default async function NatureDetectivePage() {
  const groups = await getNepalQuizGroups();
  const ready = groups.some((group) => group.species);

  return (
    <main className="bg-home-ground text-home-ink">
      <div className={cn(homeContainerClass, "pt-28 pb-20 md:pt-32 md:pb-24")}>
        <h1 className={cn(pageTitleClass, "text-center text-home-ink")}>Nature Detective</h1>
        <p className="mx-auto mt-4 max-w-[48ch] text-center text-lg leading-relaxed text-home-ink">
          Pick a group, then a level, and name the species in each photo. All of them are seen in
          Nepal.
        </p>
        <div className="mt-10">
          {ready ? (
            <QuizPicker groups={groups} />
          ) : (
            <p className="text-center text-lg text-home-ink">
              The quiz could not load its photos just now. Please try again in a little while.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
