import { z } from "zod";

const clientEnvironmentSchema = z.object({
  apiUrl: z.string().url(),
});

const serverEnvironmentSchema = z.object({
  apiUrlServer: z.string().url(),
});

type ClientEnvironment = z.infer<typeof clientEnvironmentSchema>;
type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

function parseClientEnvironment(): ClientEnvironment {
  const result = clientEnvironmentSchema.safeParse({
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!result.success) {
    throw new Error(
      "Variável de ambiente inválida ou ausente: NEXT_PUBLIC_API_URL deve ser uma URL válida.",
    );
  }

  return result.data;
}

export const clientEnvironment: ClientEnvironment = parseClientEnvironment();

export function getServerEnvironment(): ServerEnvironment {
  const result = serverEnvironmentSchema.safeParse({
    apiUrlServer: process.env.API_URL_SERVER,
  });

  if (!result.success) {
    throw new Error(
      "Variável de ambiente inválida ou ausente: API_URL_SERVER deve ser uma URL válida.",
    );
  }

  return result.data;
}
