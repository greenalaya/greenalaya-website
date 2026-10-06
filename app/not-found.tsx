import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Page not found",
  description: "The page you were looking for could not be found.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <PageShell
      title="Page not found"
      description="The page you were looking for may have moved or no longer exists."
    >
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        <li>
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/projects" className="text-primary hover:underline">
            Projects
          </Link>
        </li>
        <li>
          <Link href="/publications" className="text-primary hover:underline">
            Publications
          </Link>
        </li>
        <li>
          <Link href="/news" className="text-primary hover:underline">
            News
          </Link>
        </li>
        <li>
          <Link href="/contact" className="text-primary hover:underline">
            Contact
          </Link>
        </li>
      </ul>
    </PageShell>
  );
}
