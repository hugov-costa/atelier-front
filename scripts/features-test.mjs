import crypto from "node:crypto";
import zlib from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";

function makePng(size) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunk = (type, data) => {
    const typeBuffer = Buffer.from(type, "ascii");
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(Buffer.concat([typeBuffer, data])) >>> 0);
    return Buffer.concat([length, typeBuffer, data, crc]);
  };
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 2;
  const row = Buffer.alloc(1 + size * 3);
  for (let x = 0; x < size; x += 1) {
    row[1 + x * 3] = 200;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  return Buffer.concat([
    signature,
    chunk("IHDR", header),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
const API = `${BASE_URL}/api/v1`;
const CSRF_URL = `${BASE_URL}/sanctum/csrf-cookie`;
const STATE_FILE = process.env.STATE_FILE ?? "/tmp/features-state.json";
const phase = process.argv[2];

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
  return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

function xsrf() {
  const token = cookieJar.get("XSRF-TOKEN");
  return token ? { "X-XSRF-TOKEN": decodeURIComponent(token) } : {};
}

async function call(method, path, body, { withCsrf = false } = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;
  const isForm = body instanceof FormData;
  const headers = { Accept: "application/json", Cookie: cookieHeader() };
  if (body !== undefined && !isForm)
    headers["Content-Type"] = "application/json";
  if (withCsrf) Object.assign(headers, xsrf());

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    redirect: "manual",
  });
  storeCookies(response);
  const isJson = (response.headers.get("content-type") ?? "").includes("json");
  const payload = isJson ? await response.json().catch(() => null) : null;
  return { status: response.status, payload };
}

function base32Decode(secret) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const char of secret.replace(/=+$/, "").toUpperCase()) {
    const index = alphabet.indexOf(char);
    if (index >= 0) bits += index.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return Buffer.from(bytes);
}

function generateTotp(secret) {
  const key = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / 30);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(counter));
  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0xf;
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return (binary % 1000000).toString().padStart(6, "0");
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok: Boolean(ok) });
  console.log(
    `[${ok ? "PASS" : "FAIL"}] ${name}${detail ? ` -> ${detail}` : ""}`,
  );
}

async function register() {
  const stamp = Date.now();
  const state = {
    email: `feat_${stamp}@example.com`,
    password: "Password123!",
    newPassword: "NovaSenha456@",
  };
  await call("GET", CSRF_URL);
  const r = await call(
    "POST",
    "/register",
    {
      name: "Feature Tester",
      email: state.email,
      password: state.password,
      password_confirmation: state.password,
    },
    { withCsrf: true },
  );
  check("Registro", [200, 201].includes(r.status), `status=${r.status}`);
  writeFileSync(STATE_FILE, JSON.stringify(state));
}

async function login(email, password, code) {
  await call("GET", CSRF_URL);
  const body = code ? { email, password, code } : { email, password };
  return call("POST", "/login", body, { withCsrf: true });
}

async function verify() {
  const state = JSON.parse(readFileSync(STATE_FILE, "utf8"));

  const loginResult = await login(state.email, state.password);
  check(
    "Login inicial",
    loginResult.status === 200,
    `status=${loginResult.status}`,
  );
  const me = await call("GET", "/user");
  const userId = me.payload?.data?.id;
  check(
    "Usuário é admin (promovido)",
    me.payload?.data?.admin === true,
    `admin=${me.payload?.data?.admin}`,
  );

  console.log("--- Auditoria (admin) ---");
  const audits = await call("GET", "/users/audits?per_page=10");
  check(
    "GET /users/audits 200 com data/meta/links",
    audits.status === 200 &&
      Array.isArray(audits.payload?.data) &&
      "meta" in audits.payload &&
      "links" in audits.payload,
    `status=${audits.status} total=${audits.payload?.meta?.total}`,
  );
  const userAudits = await call("GET", `/users/${userId}/audits?per_page=10`);
  check(
    "GET /users/{id}/audits 200",
    userAudits.status === 200 && Array.isArray(userAudits.payload?.data),
    `status=${userAudits.status}`,
  );

  console.log("--- Avatar (MinIO) ---");
  const form = new FormData();
  const pngBuffer = makePng(16);
  form.append(
    "avatar",
    new Blob([pngBuffer], { type: "image/png" }),
    "avatar.png",
  );
  const upload = await call("POST", `/users/${userId}/avatar`, form, {
    withCsrf: true,
  });
  check(
    "Upload de avatar 200 + avatar_url",
    upload.status === 200 && Boolean(upload.payload?.data?.avatar_url),
    `status=${upload.status} url=${upload.payload?.data?.avatar_url}`,
  );
  const removeAvatar = await call(
    "DELETE",
    `/users/${userId}/avatar`,
    undefined,
    { withCsrf: true },
  );
  check(
    "Remoção de avatar 204",
    removeAvatar.status === 204,
    `status=${removeAvatar.status}`,
  );

  console.log("--- Verificação de e-mail ---");
  const resend = await call(
    "POST",
    "/email/verification-notification",
    undefined,
    { withCsrf: true },
  );
  check(
    "Reenvio de verificação 2xx",
    [200, 202, 204].includes(resend.status),
    `status=${resend.status}`,
  );

  console.log("--- Recuperação de senha ---");
  const forgot = await call(
    "POST",
    "/forgot-password",
    { email: state.email },
    { withCsrf: true },
  );
  check(
    "forgot-password 204",
    forgot.status === 204,
    `status=${forgot.status}`,
  );
  const resetInvalid = await call(
    "POST",
    "/reset-password",
    {
      token: "token-invalido",
      email: state.email,
      password: state.newPassword,
      password_confirmation: state.newPassword,
    },
    { withCsrf: true },
  );
  check(
    "reset-password com token inválido 422",
    resetInvalid.status === 422,
    `status=${resetInvalid.status}`,
  );

  console.log("--- Troca de senha ---");
  const changePass = await call(
    "PUT",
    "/user/password",
    {
      current_password: state.password,
      password: state.newPassword,
      password_confirmation: state.newPassword,
    },
    { withCsrf: true },
  );
  check(
    "PUT /user/password 204",
    changePass.status === 204,
    `status=${changePass.status}`,
  );
  await call("POST", "/logout", undefined, { withCsrf: true });
  const reloginNew = await login(state.email, state.newPassword);
  check(
    "Login com a nova senha 200",
    reloginNew.status === 200,
    `status=${reloginNew.status}`,
  );

  console.log("--- 2FA: provisionamento ---");
  const enable = await call("POST", "/two-factor/enable", undefined, {
    withCsrf: true,
  });
  const secret = enable.payload?.data?.secret;
  check(
    "enable 2FA retorna secret/qr/recovery",
    enable.status === 200 &&
      Boolean(secret) &&
      Boolean(enable.payload?.data?.qr_code_url) &&
      Array.isArray(enable.payload?.data?.recovery_codes),
    `status=${enable.status}`,
  );
  const confirm = await call(
    "POST",
    "/two-factor/confirm",
    { code: generateTotp(secret) },
    { withCsrf: true },
  );
  check("confirm 2FA 204", confirm.status === 204, `status=${confirm.status}`);

  writeFileSync(STATE_FILE, JSON.stringify({ ...state, secret }));
  summarize();
}

async function twofa() {
  const state = JSON.parse(readFileSync(STATE_FILE, "utf8"));

  const loginNoCode = await login(state.email, state.newPassword);
  check(
    "Login sem código 2FA é rejeitado 422",
    loginNoCode.status === 422,
    `status=${loginNoCode.status}`,
  );
  check(
    "Erro de login aponta o campo 'code'",
    Boolean(loginNoCode.payload?.errors?.code),
    `errors=${JSON.stringify(loginNoCode.payload?.errors)}`,
  );

  const loginWithCode = await login(
    state.email,
    state.newPassword,
    generateTotp(state.secret),
  );
  check(
    "Login com código 2FA 200",
    loginWithCode.status === 200,
    `status=${loginWithCode.status}`,
  );

  const disable = await call("DELETE", "/two-factor", undefined, {
    withCsrf: true,
  });
  check("disable 2FA 204", disable.status === 204, `status=${disable.status}`);
  summarize();
}

function summarize() {
  const failed = results.filter((r) => !r.ok);
  console.log(
    `\n${results.length - failed.length}/${results.length} verificações passaram.`,
  );
  if (failed.length) {
    failed.forEach((r) => console.log(`  - ${r.name}`));
    process.exit(1);
  }
}

const phases = { register, verify, twofa };
const run = phases[phase];
if (!run) {
  console.error("uso: node features-test.mjs register|verify|twofa");
  process.exit(2);
}
run().catch((error) => {
  console.error(error);
  process.exit(1);
});
