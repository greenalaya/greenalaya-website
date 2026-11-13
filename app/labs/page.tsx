import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { LabsBuilding, LabsChinari, LabsHero } from "@/components/labs/labs-sections";
import { labsContent } from "@/lib/content/labs";
import { pageMetadata } from "@/lib/seo";
import { labsPath } from "@/lib/site";

/**
 * Greenalaya Nepal Labs: the technology the organisation builds (Chinari, Junkiri) and what
 * it is researching or planning (hazard monitoring; early warning, pollution and climate-tech).
 * Not indexed and not in the menu until the team approves it.
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
      <LabsBuilding />
      <LabsChinari />
      {/* The same closing band as the homepage preview and About, so the pages end alike. */}
      <FooterStayAhead themed />
    </main>
  );
}
