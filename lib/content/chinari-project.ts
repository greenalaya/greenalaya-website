export const chinariProject = {
  slug: "chinari-ai-wildlife-classification",
  title: "Chinari: AI-Based Vertebrate Classification Platform for Nepal",
  shortTitle: "Chinari",
  summary:
    "An AI platform for the automated detection, tracking, and species-level identification of Nepal's vertebrate fauna from camera-trap imagery, ranger field reports, and citizen-submitted photos and videos.",
  mission: [
    "To transform wildlife observations into trusted, structured biodiversity intelligence through a licensed AI platform that automates the detection, tracking, and species-level identification of Nepal's vertebrate fauna.",
    "Chinari provides secure APIs and web-based applications that enable conservation organizations, researchers, government agencies, and approved partners to process camera-trap imagery, ranger field reports, and citizen-submitted photos and videos through scalable cloud.",
    "The platform automatically processes high-confidence observations while routing ambiguous or low-confidence cases - such as those affected by poor lighting, motion blur, occlusion, partial visibility, or visually similar species, to human-in-the-loop review workflows, where qualified experts validate or correct predictions before they become trusted biodiversity records.",
    "By combining AI automation with expert verification, Chinari accelerates biodiversity monitoring without replacing scientific judgment.",
  ],
  whyItMatters: [
    {
      title: "Camera-trap backlogs, reviewed faster",
      description:
        "Camera-trap archives from multiple parks and research projects sit partially reviewed today, delaying the population and distribution insights that depend on them.",
    },
    {
      title: "Faster conflict and anti-poaching response",
      description:
        "Human-wildlife conflict and anti-poaching response benefit from faster, more consistent species and incident identification in the field.",
    },
    {
      title: "Citizen science that scales",
      description:
        "A growing citizen-science community can multiply data-collection capacity, but only if submissions can be triaged and validated at scale.",
    },
    {
      title: "One shared record, not scattered files",
      description:
        "Cross-agency and cross-NGO data currently sits in fragmented formats, limiting the value of any single organization's effort.",
    },
  ],
  howItWorks: [
    {
      title: "Capture",
      description:
        "A camera-trap, a ranger's phone, or a citizen scientist's device produces an image or video, tagged with GPS and a timestamp where available.",
    },
    {
      title: "Detect",
      description:
        "Detection and tracking models locate candidate animals in each frame and link the same individual across a video or burst.",
    },
    {
      title: "Classify",
      description:
        "A multi-model classification ensemble proposes a species-level identification, backing off to genus or family when confidence is too low to call the exact species.",
    },
    {
      title: "Validate",
      description:
        "High-confidence, routine calls are auto-accepted; low-confidence, novel, or high-stakes sightings are routed to a qualified human reviewer.",
    },
    {
      title: "Record",
      description:
        "The confirmed observation is written to the biodiversity record and queued as training signal for the next model iteration.",
    },
  ],
} as const;
