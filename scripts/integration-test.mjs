const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const API = `${BASE_URL}/api/v1`;
const CSRF_URL = `${BASE_URL}/sanctum/csrf-cookie`;

const cookieJar = new Map();

function storeCookies(response) {
  for (const raw of response.headers.getSetCookie?.() ?? []) {
    const [pair] = raw.split(";");
    const index = pair.indexOf("=");
    if (index === -1) continue;
    cookieJar.set(pair.slice(0, index).trim(), pair.slice(index + 1).trim());
  }
}

function cookieHeader() {
  return [...cookieJar.entries()]
    .map(([name, value]) => `${name}=${value}`)
    .join("; ");
}

function csrfHeader() {
  const token = cookieJar.get("XSRF-TOKEN");
  return token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {};
}

async function call(method, path, body, { withCsrf = false } = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  const headers = { Accept: "application/json", Cookie: cookieHeader() };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (withCsrf) Object.assign(headers, csrfHeader());

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  storeCookies(response);

  const isJson = (response.headers.get("content-type") ?? "").includes(
    "application/json",
  );
  const payload = isJson ? await response.json().catch(() => null) : null;
  return { status: response.status, payload };
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok), detail });
  console.log(
    `[${ok ? "PASS" : "FAIL"}] ${name}${detail ? ` -> ${detail}` : ""}`,
  );
}

async function main() {
  const stamp = Date.now();
  const email = `it_${stamp}@example.com`;
  const password = "Password123!";

  const csrf = await call("GET", CSRF_URL);
  check(
    "GET /sanctum/csrf-cookie 2xx",
    csrf.status >= 200 && csrf.status < 300,
    `status=${csrf.status}`,
  );
  check("Cookie XSRF-TOKEN definido", cookieJar.has("XSRF-TOKEN"));

  const register = await call(
    "POST",
    "/register",
    {
      name: "Integration Tester",
      email,
      password,
      password_confirmation: password,
    },
    { withCsrf: true },
  );
  check(
    "POST /register cria usuário",
    [200, 201].includes(register.status),
    `status=${register.status}`,
  );

  const login = await call(
    "POST",
    "/login",
    { email, password },
    { withCsrf: true },
  );
  check(
    "POST /login autentica",
    login.status === 200,
    `status=${login.status}`,
  );
  check("Cookie access_token definido", cookieJar.has("access_token"));
  check(
    "login retorna usuário em data.user",
    Boolean(login.payload?.data?.user?.id),
    `id=${login.payload?.data?.user?.id}`,
  );

  const me = await call("GET", "/user");
  check("GET /user autenticado", me.status === 200, `status=${me.status}`);
  const currentUser = me.payload?.data;
  check(
    "GET /user retorna usuário em data",
    Boolean(currentUser?.id),
    `id=${currentUser?.id}`,
  );
  check("id do usuário é string (ULID)", typeof currentUser?.id === "string");

  const list = await call("GET", "/users?per_page=10&page=1");
  if (list.status === 200) {
    check(
      "GET /users (admin) retorna data/meta/links",
      Array.isArray(list.payload?.data) &&
        "meta" in list.payload &&
        "links" in list.payload,
      `total=${list.payload?.meta?.total}`,
    );
  } else {
    check(
      "GET /users restrito a admin retorna 403",
      list.status === 403,
      `status=${list.status}`,
    );
  }

  const single = await call("GET", `/users/${currentUser.id}`);
  check(
    "GET /users/{id} (próprio) retorna data",
    single.status === 200 && Boolean(single.payload?.data?.id),
    `status=${single.status}`,
  );

  const newName = `Integration Tester ${stamp}`;
  const update = await call(
    "PATCH",
    `/users/${currentUser.id}`,
    { name: newName },
    { withCsrf: true },
  );
  check(
    "PATCH /users/{id} atualiza",
    update.status === 200 && update.payload?.data?.name === newName,
    `name=${update.payload?.data?.name}`,
  );

  const withoutCsrf = await call(
    "PATCH",
    `/users/${currentUser.id}`,
    { name: "no-csrf" },
    { withCsrf: false },
  );
  check(
    "PATCH sem X-XSRF-TOKEN é rejeitado (419)",
    withoutCsrf.status === 419,
    `status=${withoutCsrf.status}`,
  );

  const logout = await call("POST", "/logout", undefined, { withCsrf: true });
  check(
    "POST /logout encerra sessão",
    [200, 204].includes(logout.status),
    `status=${logout.status}`,
  );

  const afterLogout = await call("GET", "/user");
  check(
    "GET /user após logout retorna 401",
    afterLogout.status === 401,
    `status=${afterLogout.status}`,
  );

  const failed = results.filter((result) => !result.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} verificações passaram.`,
  );
  if (failed.length > 0) {
    failed.forEach((result) =>
      console.log(`  - ${result.name} (${result.detail ?? ""})`),
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Erro inesperado:", error);
  process.exit(1);
});
