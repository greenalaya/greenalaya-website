import { expect, test, type Page } from "@playwright/test";

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
  "/nature-detective",
  "/labs",
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

for (const path of ["/", "/home-preview"]) {
  test(`stay ahead section renders on ${path}`, async ({ page }) => {
    await page.goto(path);
    const band = page.locator("#get-involved");
    await expect(band.getByRole("heading", { name: /Stay ahead with/i })).toBeVisible();
    await expect(band.getByRole("link", { name: "Partner With Us" })).toHaveAttribute(
      "href",
      "/contact?intent=partner",
    );
    await expect(band.getByRole("link", { name: "Send a query" })).toHaveAttribute(
      "href",
      "/contact",
    );
    await expect(band.getByRole("link", { name: "Research Internship" })).toHaveAttribute(
      "href",
      "/contact?intent=internship",
    );
  });
}

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
  // The dark theme is pure black.
  expect(mainBackground).toBe("rgb(0, 0, 0)");
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
    { name: "AI Labs", path: "/labs" },
    { name: "Projects", path: "/projects" },
    { name: "Publications", path: "/publications" },
    { name: "Blog", path: "/blog" },
    { name: "News & Updates", path: "/news" },
    { name: "Media Coverage", path: "/news/media-coverage" },
  ] as const;

  for (const link of footerLinks) {
    await expect(footer.getByRole("link", { name: link.name })).toHaveAttribute("href", link.path);
  }
});

test("header drop-downs list each section's pages", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chrome",
    "Phones get the menu panel instead; covered by the mobile menu test.",
  );

  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  const projects = nav.getByRole("button", { name: "Projects pages" });
  await expect(projects).toHaveAttribute("aria-expanded", "false");
  await projects.click();
  await expect(projects).toHaveAttribute("aria-expanded", "true");
  await expect(nav.getByRole("link", { name: "Ongoing" })).toHaveAttribute(
    "href",
    "/projects/ongoing",
  );
  await page.keyboard.press("Escape");
  await expect(projects).toHaveAttribute("aria-expanded", "false");
  await expect(projects).toBeFocused();
});

test("closing band and footer exactly fill the last laptop screen", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chrome",
    "The one-screen ending is a laptop layout; phones scroll through it.",
  );
  // Twenty page loads (five pages at four sizes): more than the usual time limit allows when
  // the dev server is slow to answer.
  test.slow();

  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize(viewport);
    for (const path of ["/", "/home-preview", "/about"]) {
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
  // About, Projects, Publications and News are groups of their pages.
  await expect(mobileNav.getByRole("link", { name: "Organization" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "All Projects" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "All Publications" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "News & Updates" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Blog" })).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Research" })).toHaveCount(0);
  await expect(page.getByRole("dialog").getByRole("link", { name: "Get Involved" })).toBeVisible();

  await mobileNav.getByRole("link", { name: "All Projects" }).click();
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

test("mobile menu lists each section's pages", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "The menu panel is for small viewports.");

  await page.goto("/about");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Primary mobile" });
  const about = menu.getByRole("group", { name: "About" });
  await expect(about.getByRole("link", { name: "Advisors" })).toHaveAttribute(
    "href",
    "/about#advisors",
  );
  await expect(about.getByRole("link", { name: "Organization" })).toHaveAttribute(
    "aria-current",
    "page",
  );
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
  await page.goto("/about");
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
  "/nature-detective",
  "/labs",
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

test("homepage sections render in order", async ({ page }) => {
  await page.goto("/");
  // The homepage is the one page of the redesign that search engines index.
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(page.getByText(/^Meet the \d+ people/)).toHaveCount(0);
  // No "Funded by" section: the impact figures have the screen after the hero to themselves.
  await expect(page.locator("#supported-by")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Funded by" })).toHaveCount(0);
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
  // Phones and tablets: the scene starts paused, with "Double tap to play" over it, and a
  // play/pause button (top-left); laptops, where a pointer steers it, don't need either.
  const touchControl = scene.getByRole("button", { name: /follow(ing)? your finger/ });
  if ((page.viewportSize()?.width ?? 0) < 1024) {
    await expect(scene.getByText("Double tap to play")).toBeVisible();
    await expect(touchControl).toHaveAccessibleName("Let the flower or lamp follow your finger");
    await touchControl.click();
    await expect(touchControl).toHaveAccessibleName(
      "Stop the flower or lamp following your finger",
    );
    await expect(scene.getByText("Double tap to play")).toHaveCount(0);
  } else {
    await expect(touchControl).toBeHidden();
  }
  // After the hero: the impact figures on a screen of their own (shown here for review even
  // while a draft), then "Where We Work" and the flagship species, and then the closing band.
  const impact = page.locator("#impact-screen > #impact");
  await expect(impact.getByRole("heading", { name: "Our impact so far" })).toBeVisible();
  // Seven stops, starting with the founding in February 2026.
  await expect(impact.getByRole("listitem")).toHaveCount(7);
  await expect(impact.getByRole("listitem").first()).toContainText("February 2026");
  await expect(impact.getByRole("listitem").first()).toContainText("Greenalaya Nepal established");
  // No sources line under the figures.
  await expect(impact.getByText(/^Sources:/)).toHaveCount(0);
  // The screens come in this order (each may sit in a wrapper that holds its arrows).
  const order = await page.evaluate(() =>
    ["impact-screen", "where-we-work", "flagship-species", "get-involved"].map(
      (id) => document.getElementById(id)?.getBoundingClientRect().top ?? NaN,
    ),
  );
  expect(order.every((top, index) => index === 0 || top > order[index - 1])).toBe(true);
  // Work, publications, news and press have their own pages (in the header's menus), so the
  // homepage ends after the flagship species.
  for (const id of ["our-work", "publications", "news", "press"]) {
    await expect(page.locator(`#${id}`)).toHaveCount(0);
  }
  // The page scrolls normally: no browser snapping.
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType)).toBe(
    "none",
  );
  // After the map: the three flagship groups, two of them opening their project.
  const flagship = page.locator("#flagship-species");
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
  await expect(page.getByRole("heading", { name: /Stay ahead with/i })).toBeVisible();
});

test("media coverage page opens each article in a new tab", async ({ page }) => {
  await page.goto("/news/media-coverage");
  await expect(page.getByRole("heading", { level: 1, name: "Media Coverage" })).toBeVisible();
  const articles = page.getByRole("main").getByRole("link");
  expect(await articles.count()).toBeGreaterThan(0);
  for (const article of await articles.all()) {
    await expect(article).toHaveAttribute("href", /^https:\/\//);
    await expect(article).toHaveAttribute("target", "_blank");
  }
  // A Nepali headline is marked as Nepali.
  await expect(page.getByRole("main").locator('[lang="ne"]')).not.toHaveCount(0);
});

test("labs page explains the approach, Chinari and the research pillars", async ({ page }) => {
  await page.goto("/labs");
  // Hidden from search engines until the team approves it.
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Building Nepal's foundational data and AI for climate and biodiversity",
  );
  await expect(page.getByText(/not a commercial testing lab/)).toBeVisible();
  // The first screen links to partnering and to Chinari's own page.
  await expect(page.getByRole("link", { name: "About Chinari" })).toHaveAttribute(
    "href",
    "/projects/chinari-ai-wildlife-classification",
  );
  for (const name of [
    "Good AI starts with good local data",
    "Chinari: AI that identifies Nepal's animals",
    "Our research pillars",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Where we are going next" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "More about Chinari" })).toHaveCount(0);
  // Only work that is under way carries a "live" label; the rest say concept. Junkiri first.
  await expect(page.locator("#chinari").getByText("In development", { exact: true })).toBeVisible();
  await expect(page.locator("#chinari").getByRole("listitem")).toHaveCount(5);
  const pillars = page.locator("#pillars").getByRole("listitem");
  await expect(pillars).toHaveCount(3);
  await expect(pillars.first()).toContainText("Junkiri");
  for (const [name, status] of [
    ["Junkiri", "Pilot, ongoing"],
    ["GLOF", "Concept"],
    ["pollution", "Concept"],
  ]) {
    await expect(
      pillars.filter({ hasText: name }).getByText(status, { exact: true }),
    ).toBeVisible();
  }
  // The same closing band as the other pages.
  await expect(page.getByRole("heading", { name: /Stay ahead with/i })).toBeVisible();
});

test("homepage scrolls normally, with up and down arrows on laptops", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name === "mobile-chrome", "The arrows are for laptops only.");
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.goto("/");
  const pageY = () => page.evaluate(() => Math.round(window.scrollY));

  // One notch of the wheel scrolls a little, not a whole screen.
  await page.mouse.move(150, 400);
  await page.mouse.wheel(0, 100);
  await expect.poll(pageY).toBeGreaterThan(0);
  await page.waitForTimeout(800);
  expect(await pageY()).toBeLessThan(300);

  // Each screen has the About page's arrows: down to the next, up to the previous.
  const down = page.getByRole("link", { name: "Scroll to our impact" });
  await expect(down).toHaveAttribute("href", "#impact-screen");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await down.click();
  // Lands just under the fixed header (4.5rem = 72px).
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.round(document.getElementById("impact-screen")!.getBoundingClientRect().top),
      ),
    )
    .toBe(72);
  await expect(page.getByRole("link", { name: "Back to the top" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Scroll to where we work" })).toHaveAttribute(
    "href",
    "#where-we-work",
  );
  // The closing band's up arrow (shown only on screens tall enough to have room for it).
  await expect(
    page.locator('#get-involved a[aria-label="Back to our flagship species"]'),
  ).toHaveAttribute("href", "#flagship-species");
  await expect(page.getByRole("link", { name: "Scroll to get involved" })).toHaveAttribute(
    "href",
    "#get-involved",
  );
});

test("Nature Detective: pick a group and a level, then name five species", async ({ page }) => {
  await page.goto("/home-preview-3");
  // The old test address forwards to the game.
  await expect(page).toHaveURL(/\/nature-detective$/);
  await expect(page).toHaveTitle(/Nature Detective/);
  await expect(page.getByRole("heading", { level: 1, name: "Nature Detective" })).toBeVisible();
  // The photos come from iNaturalist; without it the page says so.
  if (await page.getByText(/could not load its photos/).count()) return;

  await page.getByRole("button", { name: /^Birds/ }).click();
  // Level 1 is open, the others locked until it is passed.
  await expect(page.getByRole("button", { name: /Level 1: Beginner/ })).toBeEnabled();
  await expect(page.getByRole("button", { name: /Level 2: Explorer/ })).toBeDisabled();
  await page.getByRole("button", { name: /Level 1: Beginner/ }).click();

  // Five photos, three names each, then the score.
  for (let photo = 1; photo <= 5; photo++) {
    await expect(page.getByText(`Photo ${photo} of 5`)).toBeVisible();
    const options = page.locator("main ul button");
    await expect(options).toHaveCount(3);
    await options.first().click();
    await page.getByRole("button", { name: photo < 5 ? "Next photo" : "See your score" }).click();
  }
  await expect(page.getByText(/^[0-5] \/ 5$/)).toBeVisible();
  await page.getByRole("button", { name: /All levels|Go to level 2/ }).click();
  await page.getByRole("button", { name: "Choose another group" }).click();

  // Fireflies are coming soon.
  await page.getByRole("button", { name: /^Fireflies/ }).click();
  await expect(page.getByText("Fireflies: coming soon")).toBeVisible();
});

test("homepage preview is hidden from search engines", async ({ page }) => {
  await page.goto("/nature-detective");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
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
    "Our People",
    "Our Partners",
  ]) {
    await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
  }
  // Our People: the advisors, then the team.
  for (const name of ["Advisors", "Team"]) {
    await expect(
      page.locator("#advisors").getByRole("heading", { level: 3, name, exact: true }),
    ).toBeVisible();
  }
  await expect(page.locator("#team").getByRole("listitem")).not.toHaveCount(0);
  await expect(page.locator("#pillars").getByRole("button").first()).toBeVisible();
  await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
  await expect(
    page.locator('#partners a[href="https://www.facebook.com/TinyLifeFinders"]'),
  ).toHaveAttribute("target", "_blank");
});

test("About menu's Advisors and Our Partners glide to their sections", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "mobile-chrome",
    "Phones get the menu panel instead; covered by the mobile menu test.",
  );
  // Even with reduce motion on, which would otherwise make the page jump.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  const nav = page.getByRole("navigation", { name: "Primary", exact: true });
  for (const [name, id] of [
    ["Advisors", "advisors"],
    ["Our Partners", "partners"],
  ]) {
    await nav.getByRole("button", { name: "About pages" }).click();
    const before = await page.evaluate(() => scrollY);
    await nav.getByRole("link", { name }).click();
    await page.waitForTimeout(60);
    const during = await page.evaluate(() => scrollY);
    await expect(page).toHaveURL(new RegExp(`/about#${id}$`));
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((el) => Math.round(el.getBoundingClientRect().top)),
      )
      .toBeLessThan(100);
    const after = await page.evaluate(() => scrollY);
    // Part of the way there after a moment: a glide, not a jump.
    expect(during).not.toBe(after);
    expect(Math.abs(during - before)).toBeLessThan(Math.abs(after - before));
  }
});

test("/about/advisors and /about/partners go to their sections of /about", async ({ page }) => {
  await page.goto("/about/partners");
  await expect(page).toHaveURL(/\/about#partners$/);
});

test("projects carry a status tag; Ongoing and Completed list only theirs", async ({ page }) => {
  const moths = 'a[href="/projects/moths-of-bagmati-province"]';
  const butterflies = 'a[href="/projects/kathmandu-valley-butterfly-documentation"]';
  await page.goto("/projects");
  await expect(
    page.locator(moths).getByText("Ongoing", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.locator(butterflies).getByText("Completed", { exact: true }).filter({ visible: true }),
  ).toBeVisible();

  await page.goto("/projects/ongoing");
  await expect(page.getByRole("heading", { level: 1, name: "Ongoing Projects" })).toBeVisible();
  await expect(page.locator(moths)).toBeVisible();
  await expect(page.locator(butterflies)).toHaveCount(0);

  await page.goto("/projects/completed");
  await expect(page.getByRole("heading", { level: 1, name: "Completed Projects" })).toBeVisible();
  await expect(page.locator(butterflies)).toBeVisible();
  await expect(page.locator(moths)).toHaveCount(0);

  await page.goto("/projects/kathmandu-valley-butterfly-documentation");
  await expect(page.getByRole("main").getByText("Completed", { exact: true })).toBeVisible();
});

test("publications carry a kind tag; each kind's page lists only its own", async ({ page }) => {
  const report = 'a[href="/publications/pollinator-week-2026-event-report"]';
  const book = 'a[href="/publications/butterfly-images-kathmandu-valley"]';
  await page.goto("/publications");
  await expect(
    page.locator(report).getByText("Report", { exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.locator(book).getByText("Book", { exact: true }).filter({ visible: true }),
  ).toBeVisible();

  await page.goto("/publications/reports");
  await expect(page.getByRole("heading", { level: 1, name: "Reports" })).toBeVisible();
  await expect(page.locator(report)).toBeVisible();
  await expect(page.locator(book)).toHaveCount(0);

  await page.goto("/publications/books");
  await expect(page.locator(book)).toBeVisible();
  await expect(page.locator(report)).toHaveCount(0);

  await page.goto("/publications/pollinator-week-2026-event-report");
  await expect(page.getByRole("main").getByText("Report", { exact: true })).toBeVisible();
});

test("/about-preview redirects to /about", async ({ page }) => {
  await page.goto("/about-preview");
  await expect(page).toHaveURL(/\/about$/);
});

test("where we work map opens a popup for each place", async ({ page }) => {
  await page.goto("/");
  const map = page.locator("#where-we-work");
  await map.scrollIntoViewIfNeeded();

  // A street map with the official boundary, credited in the map's corner.
  await expect(map.locator(".leaflet-control-attribution")).toContainText(
    "official map of Nepal (2020)",
  );

  // Nearby markers share a numbered cluster (on a phone, all four do at first); opening a
  // cluster zooms in until the marker stands alone.
  const marker = async (title: string) => {
    const found = map.locator(`[title^="${title}"]`);
    for (let tries = 0; tries < 4 && (await found.count()) === 0; tries++) {
      await map.locator(".fm-cluster").first().click();
      await page.waitForTimeout(800);
    }
    return found;
  };

  const popup = map.locator(".leaflet-popup");
  await expect(popup).toHaveCount(0);
  await (await marker("Greenalaya Nepal: Hemja, Pokhara")).click({ force: true });
  await expect(popup).toContainText("Gandaki Province");
  await map.locator(".leaflet-popup-close-button").click();
  await expect(popup).toHaveCount(0);

  await (await marker("Pollinator Week 2026: Forestry Complex, Hetauda")).click({ force: true });
  await expect(popup).toContainText("18+ Participants");
  await expect(popup).toContainText("10+ Pollinators found");

  // "Fit to Nepal" goes back to the whole country.
  await map.getByRole("button", { name: "Fit to Nepal" }).click();
  await expect(popup).toHaveCount(0);
});
