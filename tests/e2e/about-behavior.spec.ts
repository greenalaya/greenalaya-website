import { expect, test } from "@playwright/test";
import { normalizeSupportedBy } from "@/lib/content/supported-by";
import { seedSupportedBy } from "@/lib/content/seed";

test("supporters preserve curated entries and include database-only additions", () => {
  const extra = {
    ...seedSupportedBy[0],
    id: "additional-supporter",
    slug: "additional-supporter",
    name: "Additional supporter",
  };
  const updated = { ...seedSupportedBy[0], bio: "Updated biography", photo_url: null };
  const members = normalizeSupportedBy([updated, extra]);

  expect(members.map((member) => member.slug)).toEqual([
    ...seedSupportedBy.map((member) => member.slug),
    extra.slug,
  ]);
  expect(members[0].bio).toBe(updated.bio);
  expect(members[0].photo_url).toBe(seedSupportedBy[0].photo_url);
  expect(members.at(-1)).toEqual(extra);
});

for (const path of ["/about", "/"]) {
  test(`${path} hydrates cleanly with reduced motion`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    expect(pageErrors.filter((message) => /hydrat/i.test(message))).toEqual([]);
    // The orbit's pause control has nothing to pause when motion is reduced.
    await expect(
      page.locator("#pillars").getByRole("button", { name: "Pause rotation" }),
    ).toBeHidden();
  });
}

test("pillar descriptions stay connected to their controls across viewport sizes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  // Clicks before hydration have no handler yet, so wait for the page to settle first.
  await page.waitForLoadState("networkidle");
  const pillars = page.locator("#pillars");
  const controls = pillars.locator("button[aria-expanded]");

  for (const width of [390, 1440, 768]) {
    await page.setViewportSize({ width, height: 900 });
    for (let index = 0; index < 2; index += 1) {
      const control = controls.nth(index);
      await control.click();
      await expect(control).toHaveAttribute("aria-expanded", "true");
      const panelId = await control.getAttribute("aria-controls");
      const panel = page.locator(`#${panelId}`);
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("heading")).toHaveText(await control.innerText());
      await expect(pillars.getByRole("region")).toHaveCount(1);

      const transitionDuration = await control
        .locator("..")
        .evaluate((node) => getComputedStyle(node).transitionDuration);
      expect(transitionDuration.split(",").every((duration) => parseFloat(duration) === 0)).toBe(
        true,
      );
      await page.keyboard.press("Escape");
      await expect(control).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();
    }
  }
});
