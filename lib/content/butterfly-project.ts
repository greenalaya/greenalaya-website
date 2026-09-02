export const butterflyProject = {
  slug: "kathmandu-valley-butterfly-documentation",
  title: "Winged Wonders: Documenting the Butterflies of Kathmandu Valley",
  shortTitle: "Winged Wonders: Kathmandu Valley Butterflies",
  summary:
    "A Greenalaya Nepal and TinyLife Finders initiative transforming community photographs and field observations into an open, peer-reviewed guide to Kathmandu Valley's butterfly diversity.",
  heroImage: "/images/butterfly-publication-cover.png",
  publicationHref: "/publications/butterfly-images-kathmandu-valley",
  pdfUrl: "/publications/butterfly_images_of_kathmandu_valley.pdf",
  isbn: "9789905-0-0219-7",
  metrics: [
    { value: "174", label: "species documented" },
    { value: "503", label: "photographs curated" },
    { value: "34", label: "observation locations" },
    { value: "10", label: "photo contributors" },
  ],
  locations: [
    { district: "Kathmandu", count: 22 },
    { district: "Lalitpur", count: 6 },
    { district: "Bhaktapur", count: 6 },
  ],
  process: [
    {
      number: "01",
      title: "Field Documentation",
      description:
        "Grassroots naturalists and photographers conducted non-invasive, in-situ observations capturing dorsal and ventral wing profiles across seasons.",
    },
    {
      number: "02",
      title: "Taxonomic Validation",
      description:
        "Every photograph was cross-referenced with regional entomological keys and verified by seasoned Nepali butterfly taxonomists.",
    },
    {
      number: "03",
      title: "Geo-Spatial Mapping",
      description:
        "Records were catalogued with precise GPS coordinates, dates, altitudes, and habitat classifications across 34 valley locations.",
    },
    {
      number: "04",
      title: "Open-Access Publishing",
      description:
        "Compiled into a free 134-page pictorial field guide formatted for smartphones, tablets, and print reference in schools and research labs.",
    },
  ],
} as const;
