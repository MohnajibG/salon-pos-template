import { Page, expect } from "@playwright/test";

export const loginAsAdmin = async (page: Page) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "E2E_ADMIN_EMAIL et E2E_ADMIN_PASSWORD doivent être définis (voir .env.e2e.example)",
    );
  }

  await page.goto("/login");

  await page.getByPlaceholder("admin@salonpro.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(page).toHaveURL(/\/admin\/dashboard/);
};
