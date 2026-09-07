import { MembershipSection } from "@/components/membership-section";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Membership",
  description:
    "Become a member of Greenalaya Nepal and join a community advancing conservation, research, and sustainable development across Nepal.",
  path: "/membership",
});

export default function MembershipPage() {
  return <MembershipSection />;
}
