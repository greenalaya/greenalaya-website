/**
 * Dates are formatted in Nepal time with a fixed locale so the server-rendered
 * HTML and the browser agree regardless of the visitor's time zone (content
 * dates are stored as UTC midnight, which would otherwise shift a day west of
 * UTC and cause hydration mismatches).
 */
const SITE_TIME_ZONE = "Asia/Kathmandu";

const longDateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: SITE_TIME_ZONE,
});

const monthYearFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  timeZone: SITE_TIME_ZONE,
});

/** e.g. "September 17, 2026" */
export function formatLongDate(value: string | null | undefined) {
  if (!value) return null;
  return longDateFormat.format(new Date(value));
}

/** e.g. { month: "September", year: "2026" } */
export function formatMonthYearParts(value: string | null | undefined) {
  if (!value) return null;
  const parts = monthYearFormat.formatToParts(new Date(value));
  return {
    month: parts.find((part) => part.type === "month")?.value ?? "",
    year: parts.find((part) => part.type === "year")?.value ?? "",
  };
}
