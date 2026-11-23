import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { LabsApproach, LabsChinari, LabsHero, LabsPillars } from "@/components/labs/labs-sections";
import { labsContent } from "@/lib/content/labs";
import { pageMetadata } from "@/lib/seo";
import { labsPath } from "@/lib/site";

/**
 * Greenalaya Nepal Labs: the research, data and AI side of the organisation. Why local data
 * comes first, Chinari and the research pillars (Junkiri, GLOF, pollution), then the closing band. Not indexed and not in the menu until the team approves it.
 */
export const metadata = pageMetadata({
  title: "Labs",
  description: labsContent.hero.description,
  path: labsPath,
  noIndex: true,
});

export const dynamic = "force-static";

export default function LabsPage() {
  return (
    <main className="bg-home-ground text-home-ink selection:bg-home-sage/60 selection:text-home-ink">
      <LabsHero />
      <LabsApproach />
      <LabsChinari />
      <LabsPillars />
      {/* The same closing band as the other pages. */}
      <FooterStayAhead />
    </main>
  );
}
