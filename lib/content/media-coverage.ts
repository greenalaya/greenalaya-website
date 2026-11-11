/**
 * Coverage of Greenalaya Nepal in other outlets. Add an entry only after checking that
 * the article mentions Greenalaya Nepal.
 */
export type MediaCoverage = {
  id: string;
  outlet: string;
  headline: string;
  /** ISO date of publication. */
  publishedOn: string;
  language: "English" | "Nepali";
  url: string;
};

const mediaCoverage: MediaCoverage[] = [
  {
    id: "kathmandu-post-2026-10-08-butterfly-count-results",
    outlet: "The Kathmandu Post",
    headline: "Fourth butterfly count records 173 species across six provinces",
    publishedOn: "2026-10-08",
    language: "English",
    url: "https://kathmandupost.com/national/2026/10/08/fourth-butterfly-count-records-173-species-across-six-provinces",
  },
  {
    // Names Greenalaya Nepal (Kaski) as the count's coordinator and quotes its founder.
    id: "kantipur-2026-10-07-butterfly-count-results",
    outlet: "Kantipur",
    headline: "नेपालका ६ प्रदेशमा १ सय ७३ प्रजातिका पुतली अभिलेख",
    publishedOn: "2026-10-07",
    language: "Nepali",
    url: "https://ekantipur.com/news/2026/10/07/173-butterfly-species-recorded-in-6-provinces-of-nepal-57-40.html",
  },
  {
    // The English edition of the Kantipur story above. Only its first paragraph could be read
    // when it was checked, and that part does not name Greenalaya Nepal; kept at the team's
    // request as coverage of the count the organisation coordinated.
    id: "kantipur-english-2026-10-07-butterfly-count-results",
    outlet: "Kantipur",
    headline: "173 butterfly species recorded in six provinces of Nepal",
    publishedOn: "2026-10-07",
    language: "English",
    url: "https://ekantipur.com/news/2026/10/07/en/173-butterfly-species-recorded-in-6-provinces-of-nepal-57-40.html",
  },
  {
    // Asia News Network's republication of The Kathmandu Post's story (names Greenalaya Nepal).
    id: "asia-news-network-2026-10-09-butterfly-count-results",
    outlet: "Asia News Network",
    headline: "Fourth butterfly count records 173 species across six provinces in Nepal",
    publishedOn: "2026-10-09",
    language: "English",
    url: "https://asianews.network/fourth-butterfly-count-records-173-species-across-six-provinces-in-nepal/",
  },
  {
    // Asia News Network's republication of The Kathmandu Post's story (names Greenalaya Nepal).
    id: "asia-news-network-2026-09-17-butterfly-count-begins",
    outlet: "Asia News Network",
    headline: "Nepal begins a nationwide butterfly count",
    publishedOn: "2026-09-17",
    language: "English",
    url: "https://asianews.network/nepal-begins-a-nationwide-butterfly-count/",
  },
  {
    id: "kathmandu-post-2026-09-16-butterfly-count-begins",
    outlet: "The Kathmandu Post",
    headline: "Nepal begins a nationwide butterfly count",
    publishedOn: "2026-09-16",
    language: "English",
    url: "https://kathmandupost.com/climate-environment/2026/09/16/nepal-begins-a-nationwide-butterfly-count",
  },
];

/** Newest first. */
export function getMediaCoverage(): MediaCoverage[] {
  return [...mediaCoverage].sort(
    (a, b) => new Date(b.publishedOn).getTime() - new Date(a.publishedOn).getTime(),
  );
}
