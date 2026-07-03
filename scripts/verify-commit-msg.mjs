import { readFileSync } from "node:fs";

const COMMIT_TYPES = [
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
];

const SUBJECT_PATTERN = new RegExp(
  `^(${COMMIT_TYPES.join("|")})(\\([a-z0-9._/-]+\\))?!?: .{1,72}$`,
);

const ERROR_MESSAGE = [
  "",
  "  ✖ Mensagem de commit inválida.",
  "",
  "    Use Conventional Commits: '<type>[(scope)][!]: <subject>'",
  "    com type minúsculo e subject de no máximo 72 caracteres.",
  `    Tipos permitidos: ${COMMIT_TYPES.join(", ")}.`,
  "",
];

const messagePath = process.argv[2];

if (!messagePath) {
  console.error("verify-commit-msg: caminho da mensagem de commit ausente.");
  process.exit(1);
}

const firstLine = (
  readFileSync(messagePath, "utf8").split("\n")[0] ?? ""
).replace(/\r$/, "");

if (!SUBJECT_PATTERN.test(firstLine)) {
  console.error(
    [...ERROR_MESSAGE, `    Recebido: "${firstLine}"`, ""].join("\n"),
  );
  process.exit(1);
}
