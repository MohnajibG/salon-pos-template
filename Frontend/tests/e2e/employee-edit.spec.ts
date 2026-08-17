import { test, expect } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";

test("cliquer sur modifier ouvre une modal au lieu de rediriger vers l'accueil", async ({
  page,
}) => {
  await loginAsAdmin(page);

  await page.goto("/admin/employees");

  await page.getByRole("button", { name: "Modifier" }).first().click();

  // La modal doit s'ouvrir, sans navigation vers une autre page
  await expect(page.getByText("Modifier l'employé")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/employees$/);

  // Fermer sans enregistrer pour ne pas modifier de vraies données
  await page.getByRole("button", { name: "Fermer" }).click();

  await expect(page.getByText("Modifier l'employé")).not.toBeVisible();
});
