import { AboutIntro, AboutMissionVision, AboutPartners } from "@/components/about/about-sections";
import { AboutPeople } from "@/components/about/about-people";
import { FooterStayAhead } from "@/components/footer-stay-ahead";
import { StrategicPillarsOrbit } from "@/components/strategic-pillars-orbit";
import { ThematicAreasSection } from "@/components/thematic-areas-section";
import { getAdvisors } from "@/lib/content/advisors";
import { getCollaborators } from "@/lib/content/collaborators";
import { getSupportedBy } from "@/lib/content/supported-by";
import { getTeamMembers } from "@/lib/content/team";
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
  const [
    { members: advisors },
    { members: team },
    { members: supportedBy },
    { members: collaborators },
  ] = await Promise.all([getAdvisors(), getTeamMembers(), getSupportedBy(), getCollaborators()]);

  // "Our People" (advisors and team, at #advisors) and partners are skipped when empty, so the
  // arrows around them link past the gap.
  const hasPeople = advisors.length + team.length > 0;
  const peopleLink = { href: "#advisors", label: "Back to our people" } as const;
  const partnersLink = { href: "#partners", label: "Back to our partners" } as const;
  const thematicLink = { href: "#thematic", label: "Back to our thematic areas" } as const;
  const hasPartners = supportedBy.length + collaborators.length > 0;
  const beforePartners = hasPeople ? peopleLink : thematicLink;
  const beforeFooter = hasPartners ? partnersLink : beforePartners;

  return (
    <main className="about-tone about-mint bg-home-ground text-home-ink selection:bg-home-sage/60 selection:text-home-ink">
      <AboutIntro />
      <AboutMissionVision />
      <StrategicPillarsOrbit />
      <ThematicAreasSection
        nextHref={
          hasPeople
            ? { href: "#advisors", label: "Scroll to our people" }
            : hasPartners
              ? { href: "#partners", label: "Scroll to our partners" }
              : { href: "#get-involved", label: "Scroll to get involved" }
        }
      />
      <AboutPeople
        advisors={advisors}
        members={team}
        previousHref={thematicLink}
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
        fillScreenWithFooter={{
          previousHref: beforeFooter.href,
          previousLabel: beforeFooter.label,
        }}
      />
    </main>
  );
}
