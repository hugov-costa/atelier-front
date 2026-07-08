import { StudentStatementResourceResponse } from "@/interfaces/studentStatement";
import { apiClient } from "@/lib/api-client";
import {
  parseApiResponse,
  resourceSchema,
  studentStatementResponseSchema,
} from "@/lib/responseSchemas";
import { HttpMethodType } from "@/types/httpMethod";

export async function getStudentStatement(
  studentId: string,
): Promise<StudentStatementResourceResponse> {
  const response = await apiClient<StudentStatementResourceResponse>({
    url: `/students/${studentId}/statement`,
    method: HttpMethodType.GET,
    errorMessage: "Erro ao carregar o extrato do aluno.",
  });

  return parseApiResponse(
    resourceSchema(studentStatementResponseSchema),
    response,
  );
}
