import type { Metadata } from "next";
import { TestProjectDetail } from "@/components/test-project-detail";
import { butterflyProject } from "@/lib/content/butterfly-project";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Test Project: " + butterflyProject.title,
  description: butterflyProject.summary,
  path: "/test-project",
});

export default function TestProjectPage() {
  return <TestProjectDetail />;
}
