import { expect, test } from "@playwright/test";

test.describe("Fluxo de autenticação (UI)", () => {
  test("exibe erros de validação ao enviar o login vazio", async ({ page }) => {
    await page.goto("/login");

    await expect(page.getByLabel("E-mail")).toBeVisible();

    await page.getByRole("button", { name: "Entrar" }).click();

    await expect(page.getByText("Informe o e-mail.")).toBeVisible();
    await expect(page.getByText("Informe a senha.")).toBeVisible();
  });

  test("valida a confirmação de senha no registro", async ({ page }) => {
    await page.goto("/register");

    await page.getByLabel("Nome").fill("Jane Doe");
    await page.getByLabel("E-mail").fill("jane@example.com");
    await page.getByLabel("Senha", { exact: true }).fill("Password123!");
    await page.getByLabel("Confirmar senha").fill("Outra123!");
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await expect(page.getByText("As senhas não coincidem.")).toBeVisible();
  });

  test("navega entre login, registro e recuperação de senha", async ({
    page,
  }) => {
    await page.goto("/login");

    await page.getByRole("link", { name: "Cadastre-se" }).click();
    await expect(page).toHaveURL(/\/register$/);
    await expect(page.getByLabel("Confirmar senha")).toBeVisible();

    await page.getByRole("link", { name: "Entrar" }).click();
    await expect(page).toHaveURL(/\/login$/);

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
