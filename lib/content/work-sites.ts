/**
 * Where each field event took place, for the "Where We Work" map: an event in
 * lib/content/field-event-sites.ts names its place here by `id`. Locations are approximate and
 * only for orientation.
 */
export type WorkSite = {
  id: string;
  name: string;
  district: string;
  province: string;
  lat: number;
  lon: number;
};

export const workSites: WorkSite[] = [
  {
    id: "godawari",
    name: "Godawari",
    district: "Lalitpur",
    province: "Bagmati",
    lat: 27.5953,
    lon: 85.3804,
  },
  {
    id: "ranibari",
    name: "Ranibari Community Forest",
    district: "Kathmandu",
    province: "Bagmati",
    lat: 27.727,
    lon: 85.32,
  },
  {
    id: "hetauda",
    name: "Hetauda Forestry Complex",
    district: "Makwanpur",
    province: "Bagmati",
    lat: 27.4236,
    lon: 85.0367,
  },
];
