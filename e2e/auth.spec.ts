import { expect, test } from "@playwright/test";

test.describe("Fluxo de autenticação (UI)", () => {
  test("exibe erros de validação ao enviar o login vazio", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByRole("textbox", { name: /e-?mail/i })).toBeVisible();

    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe o e-mail.")).toBeVisible();
    await expect(page.getByText("Informe a senha.")).toBeVisible();
  });

  test("navega do login para a recuperação de senha", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "Esqueceu a senha?" }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
    await expect(
      page.getByRole("button", { name: "Enviar link" }),
    ).toBeVisible();
  });

  test("redireciona rota protegida para o login", async ({ page }) => {
    await page.goto("/users");

    await expect(page).toHaveURL(/\/login/);
  });
});
