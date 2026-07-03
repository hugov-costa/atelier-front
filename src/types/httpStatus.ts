export enum HttpStatusType {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  CSRF_TOKEN_MISMATCH = 419,
  INTERNAL_SERVER_ERROR = 500,
}

export const httpStatusTypeLabels: Partial<Record<HttpStatusType, string>> = {
  [HttpStatusType.BAD_REQUEST]: "Requisição inválida.",
  [HttpStatusType.UNAUTHORIZED]: "Não autorizado.",
  [HttpStatusType.FORBIDDEN]: "Acesso proibido.",
  [HttpStatusType.NOT_FOUND]: "Recurso não encontrado.",
  [HttpStatusType.CONFLICT]: "Conflito ao processar a requisição.",
  [HttpStatusType.UNPROCESSABLE_ENTITY]: "Erro de validação dos dados.",
  [HttpStatusType.TOO_MANY_REQUESTS]:
    "Muitas requisições. Tente novamente em instantes.",
  [HttpStatusType.CSRF_TOKEN_MISMATCH]:
    "Sessão expirada. Atualize a página e tente novamente.",
  [HttpStatusType.INTERNAL_SERVER_ERROR]: "Erro interno do servidor.",
};
