import { test, expect } from "@playwright/test";

test("Home page opens", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Statistics,", level: 1 }),
  ).toBeVisible();
});
