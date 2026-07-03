import { describe, expect, it, vi } from "vitest";

import { FormValidationHttpError } from "@/utils/formValidationError";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { HttpError } from "@/utils/httpError";

describe("handleFormValidationError", () => {
  it("ignora erros que não são de validação", () => {
    const setError = vi.fn();
    const handled = handleFormValidationError(
      new HttpError(500, "Erro"),
      setError,
    );

    expect(handled).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });

  it("define o erro de cada campo retornado", () => {
    const setError = vi.fn();
    const error = new FormValidationHttpError(422, "Inválido", {
      email: ["E-mail já em uso."],
    });

    const handled = handleFormValidationError(error, setError);

    expect(handled).toBe(true);
    expect(setError).toHaveBeenCalledWith("email", {
      type: "server",
      message: "E-mail já em uso.",
    });
  });

  it("aplica o mapa de nomes servidor → formulário", () => {
    const setError = vi.fn();
    const error = new FormValidationHttpError(422, "Inválido", {
      password_confirmation: ["As senhas não coincidem."],
    });

    handleFormValidationError(error, setError, {
      password_confirmation: "passwordConfirmation",
    });

    expect(setError).toHaveBeenCalledWith("passwordConfirmation", {
      type: "server",
      message: "As senhas não coincidem.",
    });
  });
});
