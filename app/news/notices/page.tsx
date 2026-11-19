import { NewsListPage } from "@/components/news-list-page";
import { getNotices } from "@/lib/content/notices";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Notices",
  description: "Notices from Greenalaya Nepal: calls for applications, vacancies and deadlines.",
  path: "/news/notices",
});

export const dynamic = "force-static";

/** Notices (/news/notices), in the News menu once there is a notice (lib/content/notices.ts). */
export default function NoticesPage() {
  return (
    <NewsListPage
      heading="Notices"
      intro="Calls for applications, vacancies, deadlines and other notices from Greenalaya Nepal."
      emptyMessage="There are no notices at the moment."
      entries={getNotices().map((notice) => ({
        id: notice.id,
        title: notice.title,
        date: notice.publishedOn,
        summary: notice.summary,
        href: notice.href,
      }))}
    />
  );
}
