import { expect, test } from "@playwright/test";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

test.describe("Fluxo autenticado (contra a API)", () => {
  test.beforeAll(async ({ request }) => {
    let healthy = false;

    try {
      const response = await request.get(`${API_URL}/health`);
      healthy = response.ok();
    } catch {
      healthy = false;
    }

    test.skip(
      !healthy,
      `API indisponível em ${API_URL}; pulando o e2e autenticado.`,
    );
  });

  test("registra, mantém a sessão, acessa a conta e encerra a sessão", async ({
    page,
  }) => {
    test.setTimeout(60000);

    const email = `e2e_${Date.now()}@example.com`;
    const password = "Password123!";

    await page.goto("/register");
    await page.getByLabel("Nome").fill("E2E User");
    await page.getByLabel("E-mail").fill(email);
    await page.getByLabel("Senha", { exact: true }).fill(password);
    await page.getByLabel("Confirmar senha").fill(password);
    await page.getByRole("button", { name: "Cadastrar" }).click();

    await page.waitForURL((url) => !url.pathname.startsWith("/register"), {
      timeout: 20000,
    });

    await page.goto("/account");
    await expect(page).toHaveURL(/\/account/, { timeout: 15000 });

    const logout = page.getByRole("button", { name: "Sair" });
    await expect(logout).toBeVisible();
    await logout.click();

    await page.waitForURL(/\/login/, { timeout: 15000 });
  });
});
