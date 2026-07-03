"use client";

import { useEffect } from "react";

import { captureError } from "@/lib/error-reporter";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    captureError(error, {
      source: "global-error-boundary",
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold">Erro inesperado</h1>
        <p>Ocorreu um erro inesperado na aplicação.</p>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border px-4 py-2"
        >
          Recarregar
        </button>
      </body>
    </html>
  );
}
