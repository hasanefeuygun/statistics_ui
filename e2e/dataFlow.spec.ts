import { test, expect } from "@playwright/test";

test("WS data flow: start -> updates -> stop -> no updates -> restart -> updates", async ({
  page,
}) => {
  await page.goto("/");

  const toggle = page.getByTestId("flow-toggle");
  const rateCard = page.getByTestId("current-rate").first();

  await expect(rateCard).toContainText("Click Start Data Flow to see");

  await toggle.click();

  await expect(rateCard).toHaveText(/^~?\d+$/, { timeout: 15000 });

  const v1 = (await rateCard.textContent())?.trim();

  await page.waitForTimeout(6500);
  const v2 = (await rateCard.textContent())?.trim();
  expect(v2).not.toBe(v1);

  await toggle.click();

  const s1 = (await rateCard.textContent())?.trim();
  await page.waitForTimeout(6500);
  const s2 = (await rateCard.textContent())?.trim();
  expect(s2).toBe(s1);

  await toggle.click();
  await page.waitForTimeout(6500);
  const v3 = (await rateCard.textContent())?.trim();
  expect(v3).not.toBe(s2);
});
