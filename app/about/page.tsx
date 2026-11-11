import {
  AboutAdvisors,
  AboutIntro,
  AboutMissionVision,
  AboutPartners,
} from "@/components/about/about-sections";
import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { StrategicPillarsOrbit } from "@/components/strategic-pillars-orbit";
import { ThematicAreasSection } from "@/components/thematic-areas-section";
import { getAdvisors } from "@/lib/content/advisors";
import { getCollaborators } from "@/lib/content/collaborators";
import { getSupportedBy } from "@/lib/content/supported-by";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Greenalaya Nepal connects environmental research, technology, and community action for conservation across Nepal.",
  path: "/about",
});

export const dynamic = "force-static";
export const revalidate = 300;

export default async function AboutPage() {
  const [{ members: advisors }, { members: supportedBy }, { members: collaborators }] =
    await Promise.all([getAdvisors(), getSupportedBy(), getCollaborators()]);

  // Advisors and partners are skipped when empty, so the arrows around them link past the gap.
  const advisorsLink = { href: "#advisors", label: "Back to our advisors" } as const;
  const partnersLink = { href: "#partners", label: "Back to our partners" } as const;
  const thematicLink = { href: "#thematic", label: "Back to our thematic areas" } as const;
  const hasPartners = supportedBy.length + collaborators.length > 0;
  const beforePartners = advisors.length > 0 ? advisorsLink : thematicLink;
  const beforeFooter = hasPartners ? partnersLink : beforePartners;

  return (
    <main className="about-tone bg-home-ground text-home-ink selection:bg-home-sage/60 selection:text-home-ink">
      <AboutIntro />
      <AboutMissionVision />
      <StrategicPillarsOrbit themed />
      <ThematicAreasSection
        themed
        nextHref={
          advisors.length > 0
            ? { href: "#advisors", label: "Scroll to our advisors" }
            : hasPartners
              ? { href: "#partners", label: "Scroll to our partners" }
              : { href: "#get-involved", label: "Scroll to get involved" }
        }
      />
      <AboutAdvisors
        advisors={advisors}
        nextHref={
          hasPartners
            ? { href: "#partners", label: "Scroll to our partners" }
            : { href: "#get-involved", label: "Scroll to get involved" }
        }
      />
      <AboutPartners
        supportedBy={supportedBy}
        collaborators={collaborators}
        previousHref={beforePartners}
      />
      <FooterStayAhead
        themed
        fillScreenWithFooter={{
          previousHref: beforeFooter.href,
          previousLabel: beforeFooter.label,
        }}
      />
    </main>
  );
}
