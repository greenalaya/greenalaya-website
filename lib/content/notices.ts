/**
 * Notices from Greenalaya Nepal (calls for applications, vacancies, deadlines, closures and the
 * like), newest first on /news/notices. "Notices" joins the News menu once this list has its
 * first entry.
 */
export type Notice = {
  id: string;
  title: string;
  /** ISO date the notice was issued. */
  publishedOn: string;
  /** The notice itself, in a sentence or two. */
  summary: string;
  /** The full notice (a PDF or a page), if there is one. */
  href?: string;
};

const notices: Notice[] = [];

export function getNotices(): Notice[] {
  return [...notices].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}
