import { expect, test, type Page } from "@playwright/test";
import { impactIsDraft } from "@/lib/content/impact";

const publicRoutes = [
  "/",
  "/about",
  "/projects",
  "/publications",
  "/team",
  "/news",
  "/blog",
  "/contact",
  "/membership",
  "/home-preview",
  "/home-preview-2",
  "/home-preview-3",
];

for (const path of publicRoutes) {
  test(`loads ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });
}

test("team page renders modern showcase", async ({ page }) => {
  await page.goto("/team");
  await expect(page.getByRole("heading", { level: 1, name: "Our Team" })).toBeVisible();
  await expect(page.getByText("Nabin Sapkota")).toBeVisible();
  await expect(page.getByText("Siddartha Sapkota")).toBeVisible();
});

test("about page preserves collaborator order and supporter links", async ({ page }) => {
  await page.goto("/about");
  const supporters = page.getByRole("group", { name: "Supported by", exact: true });
  for (const [name, url] of [
    ["Idea Wild", "https://ideawild.org/"],
    ["Nature Conservation and Study Centre", "https://ncsc.org.np/"],
  ]) {
    const link = supporters.getByRole("link", { name: `Visit ${name} (opens in a new tab)` });
    await expect(link).toHaveAttribute("href", url);
    await expect(link).toHaveAttribute("target", "_blank");
  }
  const collaborators = page.getByRole("group", { name: "Collaborators", exact: true });
  await expect(collaborators.locator("p")).toHaveCount(0);
  const images = collaborators.getByRole("img");
  const expectedNames = [
    "Tinylife Finders",
    "Butterfly Watchers Nepal",
    "Club for Wildlife Conservation (CWC)",
    "Green and orange collaborator logo featuring wildlife",
    "IFSA Hetauda",
    "International Forestry Students' Association (IFSA) Pokhara",
    "Vision Green Organization",
  ];
  for (const [index, name] of expectedNames.entries()) {
    const logo = images.nth(index);
    await expect(logo).toHaveAttribute("alt", name);
    await logo.scrollIntoViewIfNeeded();
    await expect(logo).toBeVisible();
    await expect
      .poll(() => logo.evaluate((image: HTMLImageElement) => image.naturalWidth))
      .toBeGreaterThan(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
});

test("contact form renders required fields", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByLabel("Name")).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Message")).toBeVisible();
  await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
});

test("stay ahead section renders on home page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Stay ahead with/i })).toBeVisible();
  await expect(page.getByRole("link", { name: "Get Membership" })).toHaveAttribute(
    "href",
    "/membership",
  );
  await expect(page.getByRole("link", { name: "Research Internship" })).toHaveAttribute(
    "href",
    "/contact?intent=internship",
  );
  await expect(page.getByRole("link", { name: "Partner With Us" })).toHaveAttribute(
    "href",
    "/contact?intent=partner",
  );
});

test("home page hero and core sections render", async ({ page }) => {
  await page.goto("/");
  const heroCta = page.locator("#shader-hero-cta");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Building a Resilient Nepal Through Tech-Powered Conservation/i,
    }),
  ).toBeVisible();
  await expect(heroCta.getByRole("link", { name: "Explore Our Work", exact: true })).toBeVisible();
  await expect(heroCta.getByRole("link", { name: "Get Involved" })).toHaveAttribute(
    "href",
    "#get-involved",
  );
  await expect(page.getByRole("heading", { name: "Our Mission" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Our Vision" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Strategic Pillars" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Thematic Areas" })).toBeVisible();
});

test("home page anchor links scroll to target sections", async ({ page }) => {
  await page.goto("/");
  const heroCta = page.locator("#shader-hero-cta");

  await expect(heroCta.getByRole("link", { name: "Get Involved" })).toHaveAttribute(
    "href",
    "#get-involved",
  );
  await expect(
    heroCta.getByRole("link", { name: "Explore Our Work", exact: true }),
  ).toHaveAttribute("href", "#thematic");

  await expect(page.locator("#get-involved")).toBeAttached();
  await expect(page.locator("#thematic")).toBeAttached();
});

test("home page CTA links to the membership page", async ({ page }) => {
  await page.goto("/");
  const membershipLink = page
    .locator("#get-involved")
    .getByRole("link", { name: "Get Membership" });
  await expect(membershipLink).toHaveAttribute("href", "/membership");
});

test("membership page renders application form", async ({ page }) => {
  await page.goto("/membership");
  await expect(page.getByRole("heading", { level: 1, name: "Become a Member" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Membership Options" })).toBeVisible();
  await expect(page.getByLabel("Full Name")).toBeVisible();
  await expect(page.getByLabel("Membership Type")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit Membership Application" })).toBeVisible();
});

test("publications page matches reports catalog layout", async ({ page }) => {
  await page.goto("/publications");

  await expect(page.getByPlaceholder("Search publications by title or date")).toHaveCount(0);
  await page.getByRole("button", { name: "Search publications" }).click();
  await expect(page.getByPlaceholder("Search publications by title or date")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Publications", level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "All Publications" })).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: /Butterfly Images of Kathmandu Valley/i }).first(),
  ).toHaveAttribute("href", /\/publications\/butterfly-images-kathmandu-valley$/);
  await expect(page.getByText("2026").first()).toBeVisible();
});

test("publication detail page matches WWF-style layout", async ({ page }) => {
  await page.goto("/publications/butterfly-images-kathmandu-valley");

  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", {
      name: "Publications",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Butterfly Images of Kathmandu Valley/i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/Posted on/i)).toBeVisible();
  await expect(page.getByText("Language:")).toBeVisible();
  await expect(page.getByText("English")).toBeVisible();
  await expect(page.getByText("Publisher(s):")).toBeVisible();
  await expect(page.getByText("Greenalaya Nepal and TinyLife Finders")).toBeVisible();
  await expect(page.getByText("ISBN:")).toBeVisible();
  await expect(page.getByText("9789905-0-0219-7")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Download", level: 2 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download PDF" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Preview" })).toBeVisible();
});

test("butterfly project renders the full case study", async ({ page }) => {
  await page.goto("/projects/kathmandu-valley-butterfly-documentation");

  await expect(page.getByRole("heading", { level: 1, name: /Winged Wonders/i })).toBeVisible();
  await expect(page.getByText("174").first()).toBeVisible();
  await expect(page.getByText("503").first()).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "From field observation to field guide" }),
  ).toBeVisible();
  await expect(page.getByText("Explore the findings")).toHaveCount(0);
});

test("projects page lists the known projects only", async ({ page }) => {
  await page.goto("/projects");

  await expect(page.getByRole("heading", { level: 1, name: "Our Projects" })).toBeVisible();
  await expect(page.getByPlaceholder("Search projects by title or date")).toHaveCount(0);
  await page.getByRole("button", { name: "Search projects" }).click();
  await expect(page.getByPlaceholder("Search projects by title or date")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Kathmandu Valley Butterfly Documentation" }),
  ).toHaveAttribute("href", "/projects/kathmandu-valley-butterfly-documentation");
  await expect(page.getByRole("link", { name: /^Chinari/ })).toHaveAttribute(
    "href",
    "/projects/chinari-ai-wildlife-classification",
  );
  await expect(
    page.getByRole("link", { name: /Moonlight Dancer|Moths of Bagmati/i }),
  ).toHaveAttribute("href", "/projects/moths-of-bagmati-province");
  await expect(page.getByRole("main").locator("li")).toHaveCount(3);
});

test("chinari project page renders the condensed summary", async ({ page }) => {
  await page.goto("/projects/chinari-ai-wildlife-classification");

  await expect(page.getByRole("heading", { level: 1, name: /Chinari/ })).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Structured biodiversity intelligence, built on human validation",
      level: 2,
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Why This Matters", level: 2 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "How It Works", level: 2 })).toBeVisible();
});

test("blog page lists posts and navigates to detail", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("heading", { level: 1, name: "Blog" })).toBeVisible();
  const postLink = page.getByRole("link", { name: /From Glaciers to Algorithms/i }).first();
  await expect(postLink).toBeVisible();
  await postLink.click();
  await expect(page).toHaveURL(/\/blog\/ai-environment-nepal$/);
  await expect(
    page.getByRole("heading", { level: 1, name: /From Glaciers to Algorithms/i }),
  ).toBeVisible();
  await expect(page.getByText("Pritam Thapa").first()).toBeVisible();
});

test("/research/:slug redirects to /publications/:slug", async ({ page }) => {
  await page.goto("/research/butterfly-images-kathmandu-valley");
  await expect(page).toHaveURL(/\/publications\/butterfly-images-kathmandu-valley$/);
});

test("/research redirects to /publications", async ({ page }) => {
  await page.goto("/research");
  await expect(page).toHaveURL(/\/publications$/);
});

test("/resources redirects to /publications", async ({ page }) => {
  await page.goto("/resources");
  await expect(page).toHaveURL(/\/publications$/);
});

test("/advisors redirects to /about#advisors", async ({ page }) => {
  await page.goto("/advisors");
  await expect(page).toHaveURL(/\/about#advisors$/);
});

test("publications page uses theme background in dark mode", async ({ page }) => {
  await page.goto("/publications");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();

  const mainBackground = await page
    .locator("main.bg-background")
    .evaluate((element) => getComputedStyle(element).backgroundColor);

  expect(mainBackground).not.toBe("rgb(255, 255, 255)");
  expect(mainBackground).toBe("rgb(15, 20, 16)");
});

test("footer links route to dedicated pages", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chrome",
    "Desktop footer columns are hidden on mobile; covered by the footer accordion test.",
  );

  await page.goto("/");

  const footer = page.getByRole("contentinfo");
  const footerLinks = [
    { name: "About Greenalaya Nepal", path: "/about" },
    { name: "Advisors & Partners", path: "/about#advisors" },
    { name: "Team", path: "/team" },
    { name: "Projects", path: "/projects" },
    { name: "Publications", path: "/publications" },
    { name: "Blog", path: "/blog" },
    { name: "News & Updates", path: "/news" },
  ] as const;

  for (const link of footerLinks) {
    await expect(footer.getByRole("link", { name: link.name })).toHaveAttribute("href", link.path);
  }
});

test("closing band and footer exactly fill the last laptop screen", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chrome",
    "The one-screen ending is a laptop layout; phones scroll through it.",
  );

  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    for (const path of ["/", "/home-preview", "/home-preview-2", "/home-preview-3", "/about"]) {
      await page.goto(path);
      // The band sizes itself from the footer height the footer publishes once hydrated.
      await page.waitForFunction(() =>
        document.documentElement.style.getPropertyValue("--site-footer-h"),
      );
      // Scrolled to the very end, the band must start right under the 4.5rem (72px) header bar:
      // lower would leave a strip of the previous section showing, higher would hide the band.
      const bandTop = await page.evaluate(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, document.documentElement.scrollHeight);
        // Rounded: page heights carry sub-pixel fractions (e.g. 71.875), invisible on screen.
        return Math.round(document.querySelector("#get-involved")!.getBoundingClientRect().top);
      });
      expect(
        bandTop,
        `${path} at ${viewport.width}x${viewport.height}: band starts under the header`,
      ).toBeGreaterThanOrEqual(72);
      expect(
        bandTop,
        `${path} at ${viewport.width}x${viewport.height}: no strip of the previous section`,
      ).toBeLessThanOrEqual(74);
    }
  }
});

test("stay ahead section is not on other pages", async ({ page }) => {
  await page.goto("/team");
  await expect(page.getByRole("heading", { name: /Stay ahead with/i })).toHaveCount(0);
});

async function openMobileNav(page: Page) {
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("header includes primary navigation links on desktop", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chrome",
    "Desktop nav is hidden on mobile; covered by mobile nav test.",
  );

  await page.goto("/about");
  const nav = page.locator("header nav").first();
  await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "About" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Publications" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "News" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Blog" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Research" })).toHaveCount(0);
  await expect(page.getByRole("banner").getByRole("link", { name: "Get Involved" })).toBeVisible();
});

test("mobile menu exposes primary navigation links", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chrome",
    "Mobile menu is only shown on small viewports.",
  );

  await page.goto("/about");
  await openMobileNav(page);

  const mobileNav = page.getByRole("navigation", { name: "Primary mobile" });
  await expect(mobileNav.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "About" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Publications" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "News" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Blog" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Research" })).toHaveCount(0);
  await expect(page.getByRole("dialog").getByRole("link", { name: "Get Involved" })).toBeVisible();

  await mobileNav.getByRole("link", { name: "Projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
});

test("home page has no horizontal overflow on mobile", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chrome",
    "Overflow check targets the mobile viewport project.",
  );

  await page.goto("/");
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });
  expect(hasOverflow).toBe(false);
});

test("footer accordion exposes links on mobile", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== "mobile-chrome",
    "Footer accordion is only shown on small viewports.",
  );

  await page.goto("/about");
  const footer = page.getByRole("contentinfo");
  const ourWork = footer.getByRole("button", { name: "Our Work" });
  await expect(ourWork).toHaveAttribute("aria-expanded", "false");
  await ourWork.click();
  await expect(ourWork).toHaveAttribute("aria-expanded", "true");
  await expect(footer.getByRole("link", { name: "Projects" })).toHaveAttribute("href", "/projects");
});

test("sitemap lists published pages only", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBe(true);
  const xml = await response.text();

  for (const path of [
    "/projects/chinari-ai-wildlife-classification",
    "/projects/moths-of-bagmati-province",
    "/publications/pollinator-week-2026-event-report",
    "/news/big-butterfly-count-2026-godawari-walk",
    "/membership",
  ]) {
    expect(xml).toContain(path);
  }

  expect(xml).not.toContain("/projects/emerging-environmental-issues-research");
  expect(xml).not.toContain("/news/greenalaya-nepal-launch");
});

test("unknown project slugs return the branded 404", async ({ page }) => {
  const response = await page.goto("/projects/emerging-environmental-issues-research");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
});

test("retired news posts redirect", async ({ page }) => {
  await page.goto("/news/butterfly-images-kathmandu-valley-released");
  await expect(page).toHaveURL(/\/publications\/butterfly-images-kathmandu-valley$/);
});

test("strategic pillars are keyboard operable", async ({ page }) => {
  await page.goto("/");
  const pause = page.locator("#pillars").getByRole("button", { name: "Pause rotation" });
  await pause.click();
  await expect(
    page.locator("#pillars").getByRole("button", { name: "Play rotation" }),
  ).toHaveAttribute("aria-pressed", "true");
  const pillar = page.locator("#pillars button[aria-expanded]").first();
  await expect(pillar).toHaveAttribute("aria-expanded", "false");
  await pillar.focus();
  await page.keyboard.press("Enter");
  await expect(pillar).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(pillar).toHaveAttribute("aria-expanded", "false");
});

for (const path of [
  "/",
  "/about",
  "/team",
  "/projects/kathmandu-valley-butterfly-documentation",
  "/publications/pollinator-week-2026-event-report",
  "/news/godawari-butterfly-watch",
  "/blog/ai-environment-nepal",
  "/home-preview",
  "/home-preview-2",
  "/home-preview-3",
]) {
  test(`${path} renders without console errors or horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(path, { waitUntil: "networkidle" });

    expect(errors).toEqual([]);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("homepage preview renders every redesigned section", async ({ page }) => {
  await page.goto("/home-preview");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Field science and technology for Nepal's wildlife",
    }),
  ).toBeVisible();
  for (const name of [
    "Where We Work",
    "Our Work in Action",
    "Publications",
    "Recent events",
    "News & Media",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: /Stay ahead with/i })).toBeVisible();

  const heroActions = page.locator("#home-hero-actions");
  await expect(heroActions.getByRole("link", { name: "Explore our work" })).toHaveAttribute(
    "href",
    "#where-we-work",
  );
  await expect(heroActions.getByRole("link", { name: "About us" })).toHaveAttribute(
    "href",
    "/about",
  );

  for (const [section, href] of [
    ["#our-work", "/projects"],
    ["#publications", "/publications"],
    ["#news", "/news"],
  ] as const) {
    await expect(page.locator(`${section} a[href="${href}"]`)).toBeVisible();
  }
});

test("second homepage preview shows its supporters after the hero", async ({ page }) => {
  await page.goto("/home-preview-2");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByText(/^Meet the \d+ people/)).toHaveCount(0);
  // The two supporters have their own section on the screen straight after the hero (shared
  // with the impact figures), not inside the hero.
  await expect(
    page.locator('section[aria-labelledby="home-hero-title"] #hero-supporters-title'),
  ).toHaveCount(0);
  const supporters = page.locator(
    'section[aria-labelledby="home-hero-title"] + div > section[aria-labelledby="hero-supporters-title"]',
  );
  // The heading stands alone (no description line) and says what the two gave: grants.
  await expect(supporters.getByRole("heading", { name: "Funded by" })).toBeVisible();
  await expect(supporters.getByText(/Each logo opens their website/)).toHaveCount(0);
  await expect(supporters.getByRole("link")).toHaveCount(2);
  await expect(supporters.getByRole("link", { name: /^Idea Wild/ })).toHaveAttribute(
    "href",
    "https://ideawild.org/",
  );
  await expect(
    supporters.getByRole("link", { name: /^The Mohamed bin Zayed Species Conservation Fund/ }),
  ).toHaveAttribute("href", "https://www.speciesconservation.org/");
  // The right side is the moth lamp, a butterfly meadow in the light theme; the species
  // quiz has its own test page.
  await expect(page.locator('section[aria-labelledby="name-quiz-title"]')).toHaveCount(0);
  const scene = page.locator('section[aria-labelledby="light-scene-title"]');
  await expect(
    scene.getByRole("heading", { name: "Bring the butterflies to your flower" }),
  ).toBeAttached();
  // The title is for screen readers only, and there is no instruction line.
  await expect(scene.getByText(/Move your pointer or finger/)).toHaveCount(0);
  await scene.getByRole("button", { name: "Hide the flower" }).click();
  await expect(scene.getByRole("button", { name: "Show the flower" })).toBeVisible();
  // No running count of the insects is shown.
  await expect(scene.getByText(/butterflies at the flower|moths at the light/)).toHaveCount(0);
  // Phones and tablets get a pause button (top-left) that stops the flower or lamp following
  // a finger; laptops, where a pointer steers it, don't need one.
  const touchControl = scene.getByRole("button", { name: /follow(ing)? your finger/ });
  if ((page.viewportSize()?.width ?? 0) < 1024) {
    await expect(touchControl).toHaveAccessibleName(
      "Stop the flower or lamp following your finger",
    );
    await touchControl.click();
    await expect(touchControl).toHaveAccessibleName("Let the flower or lamp follow your finger");
  } else {
    await expect(touchControl).toBeHidden();
  }
  // Under the funders: the impact figures (shown here for review even while a draft), then
  // "Where We Work" and the first redesign's work, publications and news sections.
  const impact = page.locator("#supported-by + #impact");
  await expect(impact.getByRole("heading", { name: "Our impact so far" })).toBeVisible();
  await expect(impact.getByRole("listitem")).toHaveCount(5);
  // The sources line is left off this page to keep the screen uncrowded.
  await expect(impact.getByText(/^Sources:/)).toHaveCount(0);
  // ...and "Where We Work" follows that shared screen.
  await expect(
    page.locator("div:has(> #supported-by):has(> #impact) + #where-we-work"),
  ).toBeVisible();
  // After the map: the three flagship groups, two of them opening their project.
  const flagship = page.locator("#where-we-work + #flagship-species");
  await expect(flagship.getByRole("heading", { name: "Our Flagship Species" })).toBeVisible();
  await expect(flagship.getByRole("listitem")).toHaveCount(3);
  await expect(flagship.getByRole("link", { name: /Butterflies/ })).toHaveAttribute(
    "href",
    "/projects/kathmandu-valley-butterfly-documentation",
  );
  await expect(flagship.getByRole("link", { name: /Moths/ })).toHaveAttribute(
    "href",
    "/projects/moths-of-bagmati-province",
  );
  await expect(flagship.getByText("Fireflies")).toBeVisible();
  // After the organisation's own news: newspaper coverage, each tile opening the newspaper's
  // site in a new tab (at most six), with a Nepali headline marked as Nepali.
  const press = page.locator("#news + #press");
  await expect(press.getByRole("heading", { name: "In the National Press" })).toBeVisible();
  const articles = press.getByRole("link");
  expect(await articles.count()).toBeGreaterThan(0);
  expect(await articles.count()).toBeLessThanOrEqual(6);
  for (const article of await articles.all()) {
    await expect(article).toHaveAttribute("href", /^https:\/\//);
    await expect(article).toHaveAttribute("target", "_blank");
  }
  await expect(press.locator('[lang="ne"]')).not.toHaveCount(0);
  await expect(page.getByRole("heading", { name: /Stay ahead with/i })).toBeVisible();
});

test("third homepage preview has the species quiz in the hero", async ({ page }) => {
  await page.goto("/home-preview-3");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Research\.\s*Technology\.\s*Conservation\./,
  );
  // The quiz needs iNaturalist; without it the moth lamp stands in.
  const quiz = page.locator('section[aria-labelledby="name-quiz-title"]');
  if ((await quiz.count()) > 0) {
    const options = quiz.locator("ul button");
    await expect(options).toHaveCount(3);
    await options.first().click();
    await expect(quiz.getByRole("button", { name: "Next photo" })).toBeVisible();
    await expect(quiz.getByText(/^[01] \/ 1 right$/)).toBeVisible();
  } else {
    await expect(page.locator('section[aria-labelledby="light-scene-title"]')).toBeVisible();
  }
  await expect(page.locator("#supported-by").getByRole("link")).toHaveCount(2);
  await expect(page.locator("#where-we-work")).toBeVisible();
});

test("homepage preview is hidden from search engines", async ({ page }) => {
  await page.goto("/home-preview");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("homepage preview switches between our news and media coverage", async ({ page }) => {
  await page.goto("/home-preview");
  const news = page.locator("#news");
  const ours = news.getByRole("tab", { name: "Our News" });
  const media = news.getByRole("tab", { name: "Media Coverage" });

  await expect(ours).toHaveAttribute("aria-selected", "true");
  await media.click();
  await expect(media).toHaveAttribute("aria-selected", "true");
  const coverage = news.getByRole("tabpanel").getByRole("link").first();
  // The newest article comes first, whichever newspaper it is in; it opens on that paper's site.
  await expect(coverage).toHaveAttribute("href", /^https:\/\//);
  await expect(coverage).toHaveAttribute("target", "_blank");

  await media.press("ArrowLeft");
  await expect(ours).toHaveAttribute("aria-selected", "true");
  await expect(ours).toBeFocused();
});

test("homepage preview leads with partnership, not membership", async ({ page }) => {
  await page.goto("/home-preview");
  const involved = page.locator("#get-involved");
  await expect(involved.getByRole("link", { name: "Partner With Us" })).toHaveAttribute(
    "href",
    "/contact?intent=partner",
  );
  await expect(involved.getByRole("link", { name: "Send a query" })).toHaveAttribute(
    "href",
    "/contact",
  );
  await expect(involved.locator('a[href="/membership"]')).toHaveCount(0);
});

test("about page keeps still advisors and links TinyLife Finders", async ({ page }) => {
  await page.goto("/about");
  const advisors = page.locator("#advisors");
  await expect(advisors.locator(`[class*="animate-marquee"]`)).toHaveCount(0);
  await expect(advisors.getByRole("listitem").first()).toBeVisible();
  await expect(page.locator('a[href="https://www.facebook.com/TinyLifeFinders"]')).toHaveAttribute(
    "target",
    "_blank",
  );
});

test("about page shows mission, vision, pillars and thematic areas", async ({ page }) => {
  await page.goto("/about");
  await expect(
    page.getByRole("heading", { level: 1, name: "About Greenalaya Nepal" }),
  ).toBeVisible();
  for (const name of [
    "Our Mission",
    "Our Vision",
    "Strategic Pillars",
    "Thematic Areas",
    "Advisors",
    "Our Partners",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
  await expect(page.locator("#pillars").getByRole("button").first()).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(
    page.locator('#partners a[href="https://www.facebook.com/TinyLifeFinders"]'),
  ).toHaveAttribute("target", "_blank");
});

test("/about-preview redirects to /about", async ({ page }) => {
  await page.goto("/about-preview");
  await expect(page).toHaveURL(/\/about$/);
});

test("homepage preview keeps unconfirmed impact figures off the page", async ({ page }) => {
  await page.goto("/home-preview");
  const impact = page.locator("#impact");
  if (impactIsDraft) {
    // Draft figures stay hidden until the team confirms them; no "Draft" label ships either.
    await expect(impact).toHaveCount(0);
    await expect(page.getByText(/^Draft:/)).toHaveCount(0);
  } else {
    await expect(impact.getByRole("listitem")).toHaveCount(5);
    await expect(impact.getByText(/^Sources:/)).toBeVisible();
    await expect(impact.getByText("174", { exact: true })).toBeVisible();
  }
});

test("where we work map filters and selects places", async ({ page }) => {
  await page.goto("/home-preview");
  const map = page.locator("#where-we-work");

  await expect(map.getByText(/Official map of Nepal \(2020\)/)).toBeVisible();
  // The map follows the hero (or the impact figures, once they are confirmed).
  await expect(page.locator("main > section:nth-child(2)")).toHaveAttribute(
    "id",
    impactIsDraft ? "where-we-work" : "impact",
  );

  await map.getByRole("button", { name: "Hetauda Forestry Complex, Makwanpur" }).click();
  await expect(
    map.getByRole("heading", { level: 3, name: "Hetauda Forestry Complex" }),
  ).toBeVisible();

  await map.getByRole("button", { name: "Pollinators", exact: true }).click();
  await expect(map.getByRole("button", { name: /^Moths project: Bagmati Province$/ })).toHaveCount(
    0,
  );
  await map.getByRole("button", { name: "All work", exact: true }).click();
  await expect(
    map.getByRole("button", { name: /^Moths project: Bagmati Province$/ }),
  ).toBeVisible();

  await map.getByText(/^All places/).click();
  await map
    .getByRole("button", { name: /Kathmandu district/ })
    .last()
    .click();
  await expect(map.getByRole("heading", { level: 3, name: "Kathmandu district" })).toBeVisible();
});

test("where we work map keeps a selection that matches the filter", async ({ page }) => {
  await page.goto("/home-preview");
  const map = page.locator("#where-we-work");

  await map.getByRole("button", { name: /^Kathmandu district: 22 documented locations$/ }).click();
  await expect(map.getByRole("heading", { level: 3, name: "Kathmandu district" })).toBeVisible();

  // Kathmandu's butterfly documentation is not pollinator work, so a pollinator site is selected.
  await map.getByRole("button", { name: "Pollinators", exact: true }).click();
  await expect(
    map.getByRole("heading", { level: 3, name: "Ranibari Community Forest" }),
  ).toBeVisible();
});
